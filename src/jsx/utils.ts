import { Exec, Provider } from "@common/lang.ts"
import { Inject } from "@jsx/inject.ts"

export type HotSpotProps = { render: Provider<Element>, ref: Inject.Ref<{ update: Exec }> }

export const Hotspot = ({ render, ref }: HotSpotProps) => {
    let current = render()
    ref.addTarget({
        update: () => {
            const next = render()
            current.replaceWith(next)
            current = next
        }
    })
    return current
}