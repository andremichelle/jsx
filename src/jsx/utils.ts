import { Exec, Func, Provider } from "@common/lang.ts"
import { Inject } from "@jsx/inject.ts"

export type HotspotUpdater = { update: Exec }

export type HotSpotProps = { render: Provider<Element>, ref: Inject.Ref<HotspotUpdater> }

export const Hotspot = ({ render, ref }: HotSpotProps) => {
    let current: Element = render()
    const updater = {
        update: () => {
            const next = render()
            current.replaceWith(next)
            current = next
        }
    }
    ref.addTarget(updater)
    return current
}

export type AwaitProps<T> = {
    promise: Promise<T>,
    loading: Provider<Element>,
    success: Func<T, Element>,
    failure: Func<any, Element>
}

export const Await = <T>({ promise, loading, success, failure }: AwaitProps<T>) => {
    let current = loading()
    promise.then(result => {
        const next = success(result)
        current.replaceWith(next)
        current = next
    }, reason => {
        const next = failure(reason)
        current.replaceWith(next)
        current = next
    })
    return current
}