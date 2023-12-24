import { UserList } from "./UserList.tsx"
import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { dateToString, timespanToString } from "../time-conversion.ts"
import { fetchTrackList, Track } from "../api.ts"
import { Playback } from "../playback.ts"
import { Html } from "@ui/html.ts"
import { int } from "@common/lang.ts"
import css from "./TrackList.sass?inline"

const className = Html.adoptStyleSheet(css, "track-list")

export type TrackListProps = {
    playback: Playback
    request: RequestInfo
}

export const TrackList = ({ playback, request }: TrackListProps) => {
    let index: int = 0
    const element: HTMLDivElement = <div className={className} />
    const fetchTracks = (request: RequestInfo) =>
        fetchTrackList(request)
            .then(list => {
                if (!element.isConnected) {
                    console.debug(`ignore ${request}`)
                    return
                }
                element.append(...list.tracks.map((track: Track) => (
                    <TrackListItem playback={playback}
                                   track={track}
                                   index={index++} />
                )))
                const nextRequest = list.next
                if (nextRequest === undefined) {return}
                const moreEntriesIndicator = <LoadingIndicator title="loading more tracks" />
                const observer = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        fetchTracks(nextRequest).then(() => moreEntriesIndicator.remove())
                        observer.disconnect()
                    }
                })
                observer.observe(moreEntriesIndicator)
                element.append(moreEntriesIndicator)
            })
            .catch(() => {
                if (element.isConnected) {
                    element.append(
                        <FailureIndicatorIndicator title="Could not load more tracks"
                                                   onRetry={() => fetchTracks(request)} />
                    )
                }
            })
    const loadingIndicator = <LoadingIndicator title="loading tracks" />
    element.append(loadingIndicator)
    fetchTracks(request).then(() => loadingIndicator.remove())
    return element
}

type TrackListItemProps = {
    playback: Playback
    track: Track
    index: int
}

const TrackListItem = ({ playback, track, index }: TrackListItemProps) => {
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