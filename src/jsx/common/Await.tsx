import { Exec, Func, Provider } from "@common/lang.ts"
import { applyChildren, JsxNode } from "@jsx/create-element.ts"
import { DomElement } from "@jsx/definitions.ts"

export type AwaitProps<T> = {
    promise: Provider<Promise<T>>,
    loading: Provider<JsxNode>,
    success: Func<T, JsxNode>,
    failure: Func<{ reason: any, retry: Exec }, JsxNode>
}

export const Await = <T, >({ promise, loading, success, failure }: AwaitProps<T>) => {
    const contents: DomElement = <div style={{ display: "contents" }} />
    const start = () => {
        applyChildren(contents, loading())
        promise().then(
            result => applyChildren(contents, success(result)),
            reason => applyChildren(contents, failure({ reason, retry: () => start() })))
    }
    start()
    return contents
}