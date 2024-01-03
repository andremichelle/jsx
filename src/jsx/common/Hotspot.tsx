import { Exec, Provider } from "@common/lang.ts"
import { applyChildren, JsxNode } from "@jsx/create-element.ts"
import { Inject } from "@jsx/inject.ts"
import { DomElement } from "@jsx/definitions.ts"

export type HotspotUpdater = { update: Exec }

export type HotSpotProps = { render: Provider<JsxNode>, ref: Inject.Ref<HotspotUpdater> }

export const Hotspot = ({ render, ref }: HotSpotProps) => {
    const contents: DomElement = <div style={{ display: "contents" }} />
    applyChildren(contents, render())
    ref.addTarget({ update: () => applyChildren(contents, render()) })
    return contents
}