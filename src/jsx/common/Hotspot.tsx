import { Exec, Provider } from "@common/lang.ts"
import { replaceChildren, JsxValue } from "@jsx/create-element.ts"
import { Inject } from "@jsx/inject.ts"
import { DomElement } from "@jsx/definitions.ts"

export type HotspotUpdater = { update: Exec }
export type HotSpotProps = { render: Provider<JsxValue>, ref: Inject.Ref<HotspotUpdater> }

export const Hotspot = ({ render, ref }: HotSpotProps) => {
    const contents: DomElement = <div style={{ display: "contents" }} />
    replaceChildren(contents, render())
    ref.addTarget({ update: () => replaceChildren(contents, render()) })
    return contents
}