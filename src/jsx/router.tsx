import { TerminableOwner, Terminator } from "@common/terminable.ts"
import { Html } from "@ui/html.ts"
import { Events } from "@ui/events.ts"
import { appendChildren, JsxNode } from "@jsx/create-element.ts"
import { DomElement } from "@jsx/definitions.ts"

const isRouteMatch = (path: string, route: string): boolean => {
    const pathSegments = path.split("/")
    const routeSegments = route.split("/")
    for (let i = 0; i < routeSegments.length; i++) {if (routeSegments[i] !== pathSegments[i]) {return false}}
    return true
}

export type LinkProps = { href: string }

export const Link = ({ href }: LinkProps) => <a href={href} link></a>

export type RouterProps = {
    lifeTime?: TerminableOwner
    routes: Array<{ path: string, render: () => JsxNode }>
    fallback: (path: string) => JsxNode
}

export const Router = ({ lifeTime, routes, fallback }: RouterProps) => {
    const contents: DomElement = <main style={{ display: "contents" }} />
    const resolveRoute = (path: string): JsxNode =>
        routes.find(route => isRouteMatch(path, route.path))?.render() ?? fallback(path)

    const change = (path: string, pushState: boolean) => {
        if (pushState) {history.pushState(null, "", path)}
        // TODO Compare and replace with new instances
        Html.empty(contents)
        appendChildren(contents, resolveRoute(path))
        requestAnimationFrame(() => {
            document.querySelectorAll("a[link='active']").forEach(a => a.setAttribute("link", ""))
            document.querySelectorAll(`a[link][href='${path}']`).forEach(a => a.setAttribute("link", "active"))
        })
    }
    change(location.pathname, false)
    lifeTime ??= new Terminator()
    lifeTime.own(Events.subscribe(window, "popstate", () => change(location.pathname, false)))
    lifeTime.own(Events.subscribe(window, "click", (event: Event) => {
        const target = event.target
        if (target instanceof HTMLAnchorElement) {
            const url = new URL(target.href)
            if (url.origin === location.origin) {
                change(url.pathname, true)
                event.preventDefault()
                event.stopImmediatePropagation()
            }
        }
    }))
    return contents
}