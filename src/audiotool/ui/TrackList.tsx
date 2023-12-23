import { Track, UserTrackList } from "../api.ts"
import { Playback } from "../playback.ts"
import { int } from "@common/lang.ts"
import css from "./TrackList.sass?inline"
import { Html } from "@ui/html.ts"
import { UserList } from "./UserList.tsx"
import { dateToString, timespanToString } from "../time-conversion.ts"

const className = Html.adoptStyleSheet(css, "track-list")

export type TrackListProps = {
    list: UserTrackList
    playback: Playback
}

export const TrackList = ({ list, playback }: TrackListProps) => (
    <div className={className}>
        {list.tracks.map((track: Track, index: int) => (
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
            <button className="play" onclick={toggleTrackHandler}>
                <span className="index">{index + 1}</span>
            </button>
            <img src={track.coverUrl ?? track.snapshotUrl} />
            <div className="names">
                <div className="track" onclick={toggleTrackHandler}>{track.name}</div>
                <UserList users={track.collaborators} />
            </div>
            <div className="meta">
                <div className="date">
                    <svg>
                        <use href="#create" />
                    </svg>
                    <span>{dateToString(new Date(track.created))}</span>
                </div>
                <div className="duration">
                    <svg>
                        <use href="#duration" />
                    </svg>
                    <span>{timespanToString(track.duration)}</span>
                </div>
            </div>
            <a href={`#genre/${track.genreKey}`} className="genre">{track.genreName}</a>
        </div>
    )
}