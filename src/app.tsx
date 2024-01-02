import { MagicPills } from "./MagicPills.tsx"
import { isDefined, Nullable } from "@common/lang.ts"
import { Html } from "@ui/html.ts"

const isRouteMatch = (path: string, route: string): boolean => {
    const normalizedPath = path.replace(/^\/|\/$/g, "")
    const normalizedRoute = route.replace(/^\/|\/$/g, "")
    const pathSegments = normalizedPath.split("/")
    const routeSegments = normalizedRoute.split("/")
    for (let i = 0; i < routeSegments.length; i++) {
        if (routeSegments[i] !== pathSegments[i]) {
            return false
        }
    }
    return true
}

type RouterProps = {
    routes: Array<{ path: string, render: () => Element }>
    fallback: (path: string) => Element
}

// TODO How to better type children
// TODO When to remove listeners
const Router = ({ routes, fallback }: RouterProps) => {
    const contents: Element = <main style={{ display: "contents" }} />
    const resolveRoute = (path: string): Element =>
        routes.find(route => isRouteMatch(path, route.path))?.render() ?? fallback(path)

    let currentPage: Nullable<Element> = null
    const change = (path: string, pushState: boolean) => {
        if (pushState) {history.pushState(null, "", path)}
        const nextPage = resolveRoute(path)
        if (isDefined(currentPage) && currentPage.isConnected) {
            currentPage.replaceWith(nextPage)
        } else {
            Html.empty(contents)
            contents.appendChild(nextPage)
        }
        currentPage = nextPage
    }
    change(location.pathname, false)

    window.addEventListener("popstate", () => change(location.pathname, false))
    window.addEventListener("click", (event: Event) => {
        const target = event.target
        if (target instanceof HTMLAnchorElement) {
            const path = target.getAttribute("path")
            if (isDefined(path)) {
                change(path, true)
                event.preventDefault()
            }
        }
    })
    return contents
}

export const App = () => (
    <main>
        <nav>
            <a href="#" path="/">home</a> | <a href="#" path="/work">work</a> | <a href="#" path="/about">about</a> | <a
            href="#" path="/doesnotexist">404</a>
        </nav>
        <Router routes={[
            { path: "", render: () => <MagicPills /> },
            { path: "work", render: () => <p>Work</p> },
            { path: "about/", render: () => <p>about</p> }
        ]} fallback={(path) => <p>{`404 ('${path}')`}</p>}>
        </Router>
    </main>)

document.title = "JSX Launchpad"