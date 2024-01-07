import { replaceChildren, JsxValue } from "@jsx/create-element.ts"
import { BrowserLocation } from "@ui/location.ts"
import { Terminator } from "@common/terminable.ts"
import { isDefined } from "@common/lang.ts"
import { RouteMatcher } from "@ui/route-matcher.ts"

export type RouterProps = {
    routes: Array<{ path: string, render: (path: string) => JsxValue }>
    fallback: (path: string) => JsxValue
}

export const Router = ({ routes, fallback }: RouterProps) => {
    const routing = RouteMatcher.create(routes)
    const resolveRoute = (path: string): JsxValue =>
        routing.resolve(path).mapOr(route => route.render(path), () => fallback(path))
    return Terminator.wrapWeak(<div style={{ display: "contents" }} />,
        (weakParent) => BrowserLocation.get().catchupAndSubscribe(location => {
            const element = weakParent.deref()
            if (isDefined(element)) {
                replaceChildren(element, resolveRoute(location.path))
            }
        }))
}