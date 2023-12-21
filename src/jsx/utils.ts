import { Exec, Func } from "@common/lang.ts"
import { Inject } from "@jsx/inject.ts"

export type HotspotUpdater = { update: Exec }

export type HotSpotProps = { render: Func<HotspotUpdater, Element>, ref: Inject.Ref<HotspotUpdater> }

export const Hotspot = ({ render, ref }: HotSpotProps) => {
    let current: Element
    const updater = {
        update: () => {
            const next = render(updater)
            current.replaceWith(next)
            current = next
        }
    }
    ref.addTarget(updater)
    current = render(updater)
    return current
}