import { Await } from "@jsx/utils.ts"
import { Track, UserTrackList } from "./api.ts"
import { Html } from "@ui/html.ts"
import css from "./app.sass?inline"
import { Playback } from "./playback.ts"
import { int } from "@common/lang.ts"

const dateToString = (() => {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const
    return (date: Date) => [date.getDay() + 1, month[date.getMonth()], date.getFullYear()].join(" ")
})()

const durationToString = (millis: number) => {
    const seconds = Math.floor(millis / 1000)
    const s = Math.floor(seconds) % 60
    const m = Math.floor(seconds / 60) % 60
    const h = Math.floor(seconds / 3600)
    return (h > 0 ? [h, m, s] : [m, s]).map(x => x.toString(10).padStart(2, "0")).join(":")
}

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

const TrackListItem = ({ track, index }: { track: Track, index: int }) => (
    <div class="track" data-track-key={track.key}>
        <button onclick={(event: Event) => {
            event.stopPropagation()
            playback.toggle(track)
        }} data-index={index + 1} />
        <img src={track.coverUrl} />
        <div class="names">
            <span style={{ color: "white" }}>{track.name}</span>
            <span>{track.user.name}</span>
        </div>
        <span class="genre">{track.genreName}</span>
        <span class="date">{dateToString(new Date(track.created))}</span>
        <span class="duration">{durationToString(track.duration)}</span>
    </div>
)

export const AudiotoolApp = () => {
    const request = "https://api.audiotool.com/user/sandburgen/tracks.json?offset=50&limit=500"
    return (
        <main class={Html.adoptStyleSheet(css, "audiotool")}>
            <Await<UserTrackList>
                promise={() => fetch(request).then(x => x.json())}
                loading={() => <div class="loading">loading</div>}
                success={(result) => (
                    <div>
                        <h1>{result.name}</h1>
                        <div class="tracks">
                            {result.tracks.map((track: Track, index: int) => <TrackListItem track={track}
                                                                                            index={index} />)}
                        </div>
                    </div>)}
                failure={({ retry }) => (
                    <div class="failure">
                        <p>Could not load tracklist.</p>
                        <button onclick={retry}>Retry</button>
                    </div>)} />
        </main>
    )
}