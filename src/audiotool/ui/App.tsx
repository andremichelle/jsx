import { Hotspot, HotspotUpdater } from "@jsx/utils.ts"
import { Html } from "@ui/html.ts"
import { Inject } from "@jsx/inject.ts"
import { Option } from "@common/option.ts"
import { router } from "../api.ts"
import { Playback } from "../playback.ts"
import { Player } from "./Player.tsx"
import { TrackList } from "./TrackList.tsx"
import { Playlists } from "./Playlists.tsx"
import css from "./App.sass?inline"
import { ArtistCards } from "./ArtistCards.tsx"
import { ApiRequest } from "../data-types.ts"

const playback = new Playback()

const artists = [
    "sandburgen", "kepz", "kurpingspace2", "sumad", "dabrig", "1n50mn1ac", "brainwalker", "retrorhythm", "eliatrix",
    "trancefreak12", "melancolia", "christian-chrom", "hipposandos", "markolmx", "ole", "chackoflakko", "sharkyyo",
    "banterclaus", "jordynth", "ewan_mcculloch", "snowfire", "shakey63", "meastrostromea", "jetdarc", "skyboundzoo",
    "borozo", "intracktion", "flying-baby-seal", "structure", "yafeelma", "nominal", "tophat", "fbs_cgman", "cgman",
    "oscarollie", "almate", "offbeatninja123", "cuddlexdude", "foxyfennec", "daftwill", "jambam", "tottenhauser",
    "amoeba", "opaqity", "808chunk", "joa", "trulsenstad", "tornsage"
] as const

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
                    none: () => <ArtistCards keys={artists} />,
                    some: request => {
                        if (request.scope === "playlists") {
                            return <Playlists request={request} />
                        } else {
                            return <TrackList playback={playback} request={request} />
                        }
                    }
                })} />
            </section>
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
    if (event.code === "ArrowRight") {
        playback.nextTrack()
    } else if (event.code === "ArrowLeft") {
        playback.prevTrack()
    } else if (event.code === "Space") {
        event.preventDefault()
        playback.togglePlay()
    }
})