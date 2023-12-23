import { Track, UserTrackList } from "./api.ts"
import { Playback } from "./playback.ts"
import { int } from "@common/lang.ts"
import css from "./TrackList.sass?inline"
import { Html } from "@ui/html.ts"
import { UserList } from "./UserList.tsx"
import { dateToString, timespanToString } from "./time-conversion.ts"

const className = Html.adoptStyleSheet(css, "track-list")

export type TrackListProps = {
    data: UserTrackList
    playback: Playback
}

export const TrackList = ({ data, playback }: TrackListProps) => (
    <div className={className}>
        {data.tracks.map((track: Track, index: int) => (
            <TrackListItem playback={playback}
                           track={track}
                           index={index} />
        ))}
    </div>
)

export type TrackListItemProps = {
    playback: Playback
    track: Track
    index: int
}

export const TrackListItem = ({ playback, track, index }: TrackListItemProps) => {
    const toggleTrackHandler = (event: Event) => {
        event.stopPropagation()
        playback.toggle(track)
    }
    return (
        <div className="track" data-track-key={track.key}>
            <button className="play" onclick={toggleTrackHandler}><span className="index">{index + 1}</span></button>
            <img src={track.coverUrl}
                 onerror={(event: Event) => (event.target as HTMLImageElement).src = track.snapshotUrl} />
            <div className="names">
                <div className="track" onclick={toggleTrackHandler}>{track.name}</div>
                <UserList users={track.collaborators} />
            </div>
            <span className="date">{dateToString(new Date(track.created))}</span>
            <span className="duration">{timespanToString(track.duration)}</span>
            <a href={`#genre/${track.genreKey}`} className="genre">{track.genreName}</a>
        </div>
    )
}