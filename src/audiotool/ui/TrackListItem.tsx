import { AuthorList } from "./AuthorList.tsx"
import { dateToString, timespanToString } from "../time-conversion.ts"
import { Playback } from "../playback.ts"
import { Track } from "../api.ts"
import { int } from "@common/lang.ts"
import css from "./TrackListItem.sass?inline"
import { Html } from "@ui/html.ts"

const className = Html.adoptStyleSheet(css, "track-list-item")

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
        <div className={className} data-track-key={track.key}>
            <button className="play" onclick={toggleTrackHandler}>
                <span className="index">{index + 1}</span>
            </button>
            <img src={track.coverUrl ?? track.snapshotUrl} onclick={toggleTrackHandler} />
            <div className="names">
                <div className="track" onclick={toggleTrackHandler}>{track.name}</div>
                <AuthorList users={track.collaborators} />
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