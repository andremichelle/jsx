import { Exec, Func, Provider } from "@common/lang.ts"
import { JsxNode, replaceChildren } from "@jsx/create-element.ts"
import { DomElement } from "@jsx/definitions.ts"

export type AwaitProps<T> = {
    factory: Provider<Promise<T>>,
    loading: Provider<JsxNode>,
    success: Func<T, JsxNode>,
    failure: Func<{ reason: any, retry: Exec }, JsxNode>
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