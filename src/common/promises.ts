import { Provider } from "@common/lang.ts"
import { TimeSpan } from "@common/time-span.ts"

export namespace Promises {
    export const fail = <T>(after: TimeSpan, thenUse: Provider<Promise<T>>): Provider<Promise<T>> => {
        let use: Provider<Promise<T>> = () =>
            new Promise<T>((_, reject) => setTimeout(() => reject("fails first"), after.millis()))
        return () => {
            const promise: Promise<T> = use()
            use = thenUse
            return promise
        }
    }
}