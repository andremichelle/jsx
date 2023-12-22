import { Hotspot, HotspotUpdater } from "@jsx/utils.ts"
import { Html } from "@ui/html.ts"
import css from "./app.sass?inline"
import { Playback } from "./playback.ts"
import { Inject } from "@jsx/inject.ts"
import { TrackList } from "./TrackList.tsx"
import { Option } from "@common/option.ts"

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

const router = (url: string): Option<RequestInfo> => {
    const API_URL = `https://api.audiotool.com`
    const path: ReadonlyArray<string> = new URL(url).hash.substring(1).split("/")
    const scope = path[0]
    if (scope === "tracks") {
        return Option.wrap(`${API_URL}/user/${path[1]}/tracks.json?offset=0&limit=500`)
    }
    if (scope === "genre") {
        return Option.wrap(`${API_URL}/tracks/query.json?genre=${path[1]}&offset=0&limit=500`)
    }
    return Option.None
}

export const AudiotoolApp = () => {
    const trackListUpdater = Inject.ref<HotspotUpdater>()

    let request: Option<RequestInfo> = router(location.href)
    window.addEventListener("hashchange", (event: HashChangeEvent) => {
        request = router(event.newURL)
        trackListUpdater.get().update()
    })

    return (
        <main class={Html.adoptStyleSheet(css, "audiotool")}>
            <Hotspot ref={trackListUpdater} render={() => request.match({
                none: () => <p>Nothing selected. Start with <a href="#tracks/sandburgen">Sandburgen</a></p>,
                some: request => <TrackList playback={playback} request={request} />
            })} />
        </main>
    )
}