import { Track, UserTrackList } from "./api.ts"
import { int } from "@common/lang.ts"
import { Await } from "@jsx/utils.ts"
import { Playback } from "./playback.ts"

export type TrackListProps = {
    request: RequestInfo
    playback: Playback
}

export const TrackList = ({ request, playback }: TrackListProps) => (
    <Await<UserTrackList>
        promise={() => fetch(request).then(x => x.json())}
        loading={() => <div class="loading">loading</div>}
        success={(result) => (
            <div>
                <h1>{result.name}</h1>
                <div class="tracks">
                    {result.tracks.map((track: Track, index: int) => <TrackListItem playback={playback}
                                                                                    track={track}
                                                                                    index={index} />)}
                </div>
            </div>)}
        failure={({ retry }) => (
            <div class="failure">
                <p>Could not load tracklist.</p>
                <button onclick={retry}>Retry</button>
            </div>)} />
)

type TrackListItemProps = {
    playback: Playback
    track: Track
    index: int
}

const TrackListItem = ({ playback, track, index }: TrackListItemProps) => (
    <div class="track" data-track-key={track.key}>
        <button class="play" onclick={(event: Event) => {
            event.stopPropagation()
            playback.toggle(track)
        }} data-index={index + 1} />
        <img src={track.coverUrl}
             onerror={(event: Event) => (event.target as HTMLImageElement).src = track.snapshotUrl} />
        <div class="names">
            <span style={{ color: "white" }}>{track.name}</span>
            <div class="collaborators">{track.collaborators.map(user => (
                <a href={`#tracks/${user.key}`}>{user.name}</a>
            ))}</div>
        </div>
        <a href={`#genre/${track.genreKey}`} class="genre">{track.genreName}</a>
        <span class="date">{dateToString(new Date(track.created))}</span>
        <span class="duration">{durationToString(track.duration)}</span>
    </div>
)

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