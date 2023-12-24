import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { fetchTrackList, Track } from "../api.ts"
import { Playback } from "../playback.ts"
import { Html } from "@ui/html.ts"
import { int } from "@common/lang.ts"
import css from "./TrackList.sass?inline"
import { TrackListItem } from "./TrackListItem.tsx"

const className = Html.adoptStyleSheet(css, "track-list")

export type TrackListProps = {
    playback: Playback
    request: RequestInfo
}

export const TrackList = ({ playback, request }: TrackListProps) => {
    let index: int = 0
    let lastTrack: Track | undefined
    const element: HTMLElement = <section className={className} />
    const fetchTracks = (request: RequestInfo) =>
        fetchTrackList(request, lastTrack)
            .then(list => {
                if (!element.isConnected) {return}
                const tracks: ReadonlyArray<Track> = list.tracks
                element.append(...tracks.map((track: Track) => (
                    <TrackListItem playback={playback}
                                   track={track}
                                   index={index++} />
                )))
                lastTrack = tracks.at(-1)
                const nextRequest = list.next
                if (nextRequest === undefined) {return}
                const moreEntriesIndicator = <LoadingIndicator title="loading more tracks" />
                const observer = new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        fetchTracks(nextRequest).then(() => moreEntriesIndicator.remove())
                        observer.disconnect()
                    }
                })
                element.append(moreEntriesIndicator)
                observer.observe(moreEntriesIndicator)
            })
            .catch(() => {
                if (element.isConnected) {
                    element.append(<FailureIndicatorIndicator title="Could not load more tracks"
                                                              onRetry={() => fetchTracks(request)} />)
                }
            })
    const loadingIndicator = <LoadingIndicator title="loading tracks" />
    element.append(loadingIndicator)
    fetchTracks(request).then(() => loadingIndicator.remove())
    return element
}