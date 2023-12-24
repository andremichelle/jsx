import { Hotspot, HotspotUpdater } from "@jsx/utils.ts"
import { Html } from "@ui/html.ts"
import { Inject } from "@jsx/inject.ts"
import { Option } from "@common/option.ts"
import { ApiRequest, router } from "../api.ts"
import { Playback } from "../playback.ts"
import { Player } from "./Player.tsx"
import { TrackList } from "./TrackList.tsx"
import { Playlists } from "./Playlists.tsx"
import css from "./App.sass?inline"

const playback = new Playback()

document.title = "audiotool music browser"

export const App = () => {
    let request: Option<ApiRequest> = router(location.href)
    const trackListUpdater = Inject.ref<HotspotUpdater>()
    window.onhashchange = (event: HashChangeEvent) => {
        request = router(event.newURL)
        trackListUpdater.get().update()
    }
    return (
        <main className={Html.adoptStyleSheet(css, "audiotool")}>
            <Player playback={playback} />
            <section className="content">
                <Hotspot ref={trackListUpdater} render={() => request.match({
                    none: () => <div>
                        <h1>Missing Homepage</h1>
                        <h4>Start with of my favourites...</h4>
                        <ul>
                            <li><a href="#tracks/sandburgen">Sandburgen</a></li>
                            <li><a href="#tracks/kepz">Kepz</a></li>
                            <li><a href="#tracks/sumad">Sumad</a></li>
                            <li><a href="#playlist/huqtsd2pt">Playlist 2019 (Sandburgen)</a></li>
                        </ul>
                    </div>,
                    some: request => {
                        if (request.scope === "playlists") {
                            return <Playlists request={request} />
                        } else {
                            return <TrackList playback={playback} request={request} />
                        }
                    }
                })} />
            </section>
            {/*<Footer />*/}
        </main>
    )
}

// old school dom manipulation for list-player states
playback.subscribe(event => {
    if (event.state === "activate") {
        document.querySelectorAll("[data-track-key].active")
            .forEach(element => element.classList.remove("active", "buffering", "playing", "error"))
        event.track.ifSome(track => document.querySelectorAll(`[data-track-key="${track.key}"]`)
            .forEach(element => {
                element.classList.add("active")
                element.firstElementChild?.scrollIntoView({ behavior: "smooth", block: "center" })
            }))
    } else if (event.state === "buffering") {
        document.querySelectorAll("[data-track-key].active")
            .forEach(element => element.classList.add("buffering"))
    } else if (event.state === "playing") {
        document.querySelectorAll("[data-track-key].active")
            .forEach(element => {
                element.classList.remove("buffering")
                element.classList.add("playing")
            })
    } else if (event.state === "paused") {
        document.querySelectorAll("[data-track-key].active")
            .forEach(element => element.classList.remove("playing"))
    }
})

window.addEventListener("keydown", (event: KeyboardEvent) => {
    event.preventDefault()
    if (event.code === "ArrowRight") {
        playback.nextTrack()
    } else if (event.code === "ArrowLeft") {
        playback.prevTrack()
    } else if (event.code === "Space") {
        playback.togglePlay()
    }
})