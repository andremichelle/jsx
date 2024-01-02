import { MagicPills } from "./MagicPills.tsx"
import { isDefined, Provider } from "@common/lang.ts"
import { Option } from "@common/option.ts"

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

type RouterProps = {}

// TODO How to type children
const Router = ({}: RouterProps, children: ReadonlyArray<RouteProps>) => {
    const contents: Element = <div style={{ display: "contents" }} />
    const createContent = (path: string): Option<Element> =>
        Option.wrap(children.find((route: RouteProps) => isRouteMatch(path, route.path))?.render())

    let page: Option<Element> = Option.None
    const change = (path: string, pushState: boolean) => {
        if (pushState) {
            history.pushState(null, "", path)
        }
        const next: Option<Element> = createContent(path)
        if (next.nonEmpty()) {
            if (page.mapOr(element => element.isConnected, false)) {
                page.unwrap().replaceWith(next.unwrap())
            } else {
                contents.appendChild(next.unwrap())
            }
        }
        page = next
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

type RouteProps = {
    path: string
    render: Provider<Element>
}

const Route = (props: RouteProps) => {
    return props
}

export const App = () => (
    <main>
        <nav>
            <a href="#" path="/">home</a> | <a href="#" path="/work">work</a> | <a href="#" path="/about">about</a>
        </nav>
        <Router>
            <Route path="/" render={() => <MagicPills />} />
            <Route path="/work" render={() => <p>Work</p>} />
            <Route path="/about" render={() => <p>About</p>} />
            <Route path="*" render={() => <p>404</p>} />
        </Router>
    </main>
)

document.title = "JSX Launchpad"