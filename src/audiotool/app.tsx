import { Hotspot, HotspotUpdater } from "@jsx/utils.ts"
import { Html } from "@ui/html.ts"
import css from "./app.sass?inline"
import { Playback } from "./playback.ts"
import { Inject } from "@jsx/inject.ts"
import { AwaitTrackList } from "./AwaitTrackList.tsx"
import { Option } from "@common/option.ts"
import { Player } from "./Player.tsx"
import { router } from "./api.ts"

const playback = new Playback()
playback.subscribe(event => {
    if (event.state === "activate") {
        document.querySelectorAll(".track.active")
            .forEach(element => element.classList.remove("active", "buffering", "playing", "error"))
        event.track.ifSome(track => document.querySelectorAll(`.track[data-track-key="${track.key}"]`)
            .forEach(element => element.classList.add("active")))
    } else if (event.state === "playing") {
        document.querySelectorAll(".track.active")
            .forEach(element => {
                element.classList.remove("buffering")
                element.classList.add("playing")
            })
    } else if (event.state === "paused") {
        document.querySelectorAll(".track.active")
            .forEach(element => element.classList.remove("playing"))
    } else if (event.state === "buffering") {
        document.querySelectorAll(".track.active")
            .forEach(element => element.classList.add("buffering"))
    }
})

export const AudiotoolApp = () => {
    let request: Option<RequestInfo> = router(location.href)
    const trackListUpdater = Inject.ref<HotspotUpdater>()
    window.addEventListener("hashchange", (event: HashChangeEvent) => {
        request = router(event.newURL)
        trackListUpdater.get().update()
    })
    return (
        <main className={Html.adoptStyleSheet(css, "audiotool")}>
            <Player playback={playback} />
            <div className="content">
                <Hotspot ref={trackListUpdater} render={() => request.match({
                    none: () => <p>Nothing selected. Start with <a href="#tracks/sandburgen">Sandburgen</a></p>,
                    some: request => <AwaitTrackList playback={playback} request={request} />
                })} />
            </div>
            <footer />
        </main>
    )
}