import { Exec, Func, Provider } from "@common/lang.ts"
import { JsxValue, replaceChildren } from "@jsx/create-element.ts"
import { DomElement } from "@jsx/definitions.ts"

export type AwaitProps<T> = {
    factory: Provider<Promise<T>>,
    loading: Provider<JsxValue>,
    success: Func<T, JsxValue>,
    failure: Func<{ reason: any, retry: Exec }, JsxValue>
}

export const Await = <T, >({ factory, loading, success, failure }: AwaitProps<T>) => {
    const contents: DomElement = <div style={{ display: "contents" }} />
    const start = () => {
        replaceChildren(contents, loading())
        factory().then(
            result => replaceChildren(contents, success(result)),
            reason => replaceChildren(contents, failure({ reason, retry: () => start() })))
    }
    start()
    return contents
}