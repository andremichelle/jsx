import { applyChildren, JsxNode } from "@jsx/create-element.ts"
import { DomElement } from "@jsx/definitions.ts"
import { BrowserLocation } from "@ui/location.ts"
import { Terminator } from "@common/terminable.ts"
import { isDefined } from "@common/lang.ts"
import { RouteMatcher } from "@ui/route-matcher.ts"

export const Link = ({ href }: { href: string }) => {
    const location = BrowserLocation.get()
    const anchor: HTMLAnchorElement = <a href={href} onclick={(event: Event) => {
        location.navigateTo(href)
        event.preventDefault()
    }} link></a>
    return Terminator.wrapWeak(anchor, weakRef =>
        location.catchupAndSubscribe(location =>
            weakRef.deref()?.setAttribute("link", RouteMatcher.match(location.path, href) ? "active" : "")))
}

export type RouterProps = {
    routes: Array<{ path: string, render: (path: string) => JsxNode }>
    fallback: (path: string) => JsxNode
}

export const Router = ({ routes, fallback }: RouterProps) => {
    const contents: DomElement = <main style={{ display: "contents" }} />

    const routing = RouteMatcher.create(routes)
    const resolveRoute = (path: string): JsxNode =>
        routing.resolve(path).mapOr(route => route.render(path), () => fallback(path))

    return Terminator.wrapWeak(contents, (weak) => BrowserLocation.get()
        .catchupAndSubscribe(location => {
            const element = weak.deref()
            if (isDefined(element)) {
                applyChildren(element, resolveRoute(location.path))
            }
        }))
}