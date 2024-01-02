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

// TODO How to better type children
// TODO When to remove listeners
const Router = ({}: RouterProps, children: ReadonlyArray<RouteProps>) => {
    const contents: Element = <main style={{ display: "contents" }} />
    const createContent = (path: string): Option<Element> =>
        Option.wrap(children.find((route: RouteProps) => isRouteMatch(path, route.path))?.render())

    let currentPage: Option<Element> = Option.None
    const change = (path: string, pushState: boolean) => {
        if (pushState) {history.pushState(null, "", path)}
        const nextPage = createContent(path)
        nextPage.match({
            none: () => contents.firstChild?.remove(),
            some: content => {
                if (currentPage.mapOr(element => element.isConnected, false)) {
                    currentPage.unwrap().replaceWith(content)
                } else {
                    contents.appendChild(content)
                }
            }
        })
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
            <a href="#" path="/">home</a> | <a href="#" path="/work">work</a> | <a href="#" path="/about">about</a> | <a
            href="#" path="/unknown">404</a>
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