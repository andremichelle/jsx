import { Hotspot, HotspotUpdater } from "@jsx/utils.ts"
import { Html } from "@ui/html.ts"
import { Inject } from "@jsx/inject.ts"
import { Option } from "@common/option.ts"
import { router } from "../api.ts"
import { Playback } from "../playback.ts"
import { Player } from "./Player.tsx"
import css from "./App.sass?inline"
import { TrackList } from "./TrackList.tsx"

const playback = new Playback()

document.title = "audiotool music browser"

export const App = () => {
    let request: Option<RequestInfo> = router(location.href)
    const trackListUpdater = Inject.ref<HotspotUpdater>()
    window.onhashchange = (event: HashChangeEvent) => {
        request = router(event.newURL)
        trackListUpdater.get().update()
    }
    return (
        <main className={Html.adoptStyleSheet(css, "audiotool")}>
            <Player playback={playback} />
            <div className="content">
                <Hotspot ref={trackListUpdater} render={() => request.match({
                    none: () => <div>
                        <h4>Start with of my favourites:</h4>
                        <ul>
                            <li><a href="#tracks/sandburgen">Sandburgen</a></li>
                            <li><a href="#tracks/kepz">Kepz</a></li>
                            <li><a href="#album/huqtsd2pt">Album 2019 (Sandburgen)</a></li>
                        </ul>
                    </div>,
                    some: request => <TrackList playback={playback} request={request} />
                })} />
            </div>
            {/*<footer />*/}
        </main>
    )
}

// old school dom manipulation for list-player states
playback.subscribe(event => {
    if (event.state === "activate") {
        document.querySelectorAll(".track.active")
            .forEach(element => element.classList.remove("active", "buffering", "playing", "error"))
        event.track.ifSome(track => document.querySelectorAll(`.track[data-track-key="${track.key}"]`)
            .forEach(element => element.classList.add("active")))
    } else if (event.state === "buffering") {
        document.querySelectorAll(".track.active")
            .forEach(element => element.classList.add("buffering"))
    } else if (event.state === "playing") {
        document.querySelectorAll(".track.active")
            .forEach(element => {
                element.classList.remove("buffering")
                element.classList.add("playing")
            })
    } else if (event.state === "paused") {
        document.querySelectorAll(".track.active")
            .forEach(element => element.classList.remove("playing"))
    }
})