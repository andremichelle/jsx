import { Option } from "@common/option.ts"
import { assert } from "@common/lang.ts"

export type Route = { path: string }

export class Routing<R extends Route> {
    static create<R extends Route>(routes: ReadonlyArray<R>): Routing<R> {return new Routing<R>(routes)}

    readonly #routes: ReadonlyArray<R>

    private constructor(routes: ReadonlyArray<R>) {
        this.#routes = routes.toSorted((a: Route, b: Route) => {
            if (a.path < b.path) {return -1}
            if (a.path > b.path) {return 1}
            return 0
        })
    }

    resolve(path: string): Option<R> {return Option.wrap(this.#routes.find(route => isRouteMatch(path, route.path)))}
    contains(path: string, route: string): boolean {return isRouteMatch(new URL(path).pathname, route)}
}

const isRouteMatch = (path: string, route: string): boolean => {
    assert(path.startsWith("/") && route.startsWith("/"), "Does not start with a slash.")
    const pathSegments = path.split("/")
    const routeSegments = route.split("/")
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