import { Option } from "@common/option.ts"
import { assert } from "@common/lang.ts"

export type Route = { path: string }

export class RouteMatcher<R extends Route> {
    static create<R extends Route>(routes: ReadonlyArray<R>): RouteMatcher<R> {return new RouteMatcher<R>(routes)}

    static match(route: string, path: string): boolean {
        assert(route.startsWith("/") && path.startsWith("/"), "Does not start with a slash.")
        const routeSegments = route.split("/")
        const pathSegments = path.split("/")
        for (let i = 1; i < pathSegments.length; i++) {
            if (routeSegments[i] === "*") {
                return true
            }
            if (pathSegments[i] !== routeSegments[i]) {
                return false
            }
        }
        return true
    }

    readonly #routes: ReadonlyArray<R>

    private constructor(routes: ReadonlyArray<R>) {
        this.#routes = routes.toSorted((a: Route, b: Route) => {
            if (a.path < b.path) {return -1}
            if (a.path > b.path) {return 1}
            return 0
        })
    }

    resolve(path: string): Option<R> {return Option.wrap(this.#routes.find(route => RouteMatcher.match(route.path, path)))}
}