import { TerminableOwner, Terminator } from "@common/terminable.ts"
import { Events } from "@ui/events.ts"
import { applyChildren, JsxNode } from "@jsx/create-element.ts"
import { DomElement } from "@jsx/definitions.ts"
import { Routing } from "@common/routing.ts"

export const Link = ({ href }: { href: string }) => <a href={href} link></a>

export type RouterProps = {
    lifeTime?: TerminableOwner
    routes: Array<{ path: string, render: (path: string) => JsxNode }>
    fallback: (path: string) => JsxNode
}

export const Router = ({ lifeTime, routes, fallback }: RouterProps) => {
    const contents: DomElement = <main style={{ display: "contents" }} />

    const routing = Routing.create(routes)
    const resolveRoute = (path: string): JsxNode =>
        routing.resolve(path).mapOr(route => route.render(path), fallback(path))

    const change = (path: string, manual: boolean) => {
        if (manual) {
            if (location.pathname === path) {
                return
            }
            history.pushState(null, "", path)
        }
        applyChildren(contents, resolveRoute(path))
        requestAnimationFrame(() => {
            document.querySelectorAll<HTMLAnchorElement>("a[link]").forEach(a => {
                if (a.getAttribute("link") === "active") {
                    a.setAttribute("link", "")
                }
                if (routing.contains(a.href, path)) {
                    a.setAttribute("link", "active")
                }
            })
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