import { Playback } from "../playback.ts"
import { Html } from "@ui/html.ts"
import { Inject } from "@jsx/inject.ts"
import css from "./PlaybackProgress.sass?inline"

const className = Html.adoptStyleSheet(css, "playback-progress")

export type PlaybackProgressType = {
    playback: Playback
}

export const PlaybackProgress = ({ playback }: PlaybackProgressType) => {
    const bar = Inject.ref<HTMLDivElement>()
    playback.subscribe(event => {
        if (event.state === "progress") {
            bar.get().style.setProperty("--progress", event.progress.toString())
        }
    })
    return (
        <div className={className}>
            <div className="socket" onclick={(event: MouseEvent) => {
                const target: HTMLDivElement = event.currentTarget as HTMLDivElement
                const clientRect = target.getBoundingClientRect()
                const position = (event.clientX - clientRect.left) / clientRect.width
                playback.active.ifSome(track => playback.playTrackFrom(track, position))
            }}>
                <div className="bar" ref={bar} />
            </div>
        </div>
    )
}