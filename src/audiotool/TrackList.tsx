import { Track, UserTrackList } from "./api.ts"
import { Playback } from "./playback.ts"
import { int } from "@common/lang.ts"
import css from "./TrackList.sass?inline"
import { Html } from "@ui/html.ts"

const className = Html.adoptStyleSheet(css, "track-list")

export type TrackListProps = {
    data: UserTrackList
    playback: Playback
}

export const TrackList = ({ data, playback }: TrackListProps) => (
    <div class={className}>
        <h1>{data.name}</h1>
        <div className="tracks">
            {data.tracks.map((track: Track, index: int) => <TrackListItem playback={playback}
                                                                          track={track}
                                                                          index={index} />)}
        </div>
    </div>
)

export type TrackListItemProps = {
    playback: Playback
    track: Track
    index: int
}

export const TrackListItem = ({ playback, track, index }: TrackListItemProps) => (
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
        <span class="date">{dateToString(new Date(track.created))}</span>
        <span class="duration">{durationToString(track.duration)}</span>
        <a href={`#genre/${track.genreKey}`} class="genre">{track.genreName}</a>
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