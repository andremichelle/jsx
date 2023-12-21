import { Exec, Func, Provider } from "@common/lang.ts"
import { Inject } from "@jsx/inject.ts"

export type HotspotUpdater = { update: Exec }

export type HotSpotProps = { render: Provider<Element>, ref: Inject.Ref<HotspotUpdater> }

export const Hotspot = ({ render, ref }: HotSpotProps) => {
    let current: Element = render()
    const updater = {
        update: () => {
            if (current.isConnected) {
                const next = render()
                current.replaceWith(next)
                current = next
            }
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
    const element = loading()
    promise.then(result => {
        if (element.isConnected) {
            element.replaceWith(success(result))
        }
    }, reason => {
        if (!element.isConnected) {
            element.replaceWith(failure(reason))
        }
    })
    return element
}