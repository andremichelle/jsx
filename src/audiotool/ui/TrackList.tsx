import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { ApiTrackListResponse, fetchTracks, Track } from "../api.ts"
import { Playback } from "../playback.ts"
import { Html } from "@ui/html.ts"
import { int } from "@common/lang.ts"
import css from "./TrackList.sass?inline"
import { TrackListItem } from "./TrackListItem.tsx"

const className = Html.adoptStyleSheet(css, "track-list")

export type TrackListProps = {
    playback: Playback
    request: ApiTrackListResponse
}

export const TrackList = ({ playback, request }: TrackListProps) => {
    let index: int = 0
    const element: HTMLElement = <section className={className} />
    const fetch = (request: ApiTrackListResponse) => request.fetch()
        .then(response => {
            if (!element.isConnected) {return}
            if (index === 0 && request.scope === "tracks") {
                element.append(
                    <header>
                        <h1>{response.name}</h1>
                        <button onclick={() => location.hash = `playlists/${request.artist}`}>
                            Show Artists Playlists
                        </button>
                    </header>
                )
            }
            const tracks: ReadonlyArray<Track> = response.tracks
            element.append(...tracks.map((track: Track) => (
                <TrackListItem playback={playback}
                               track={track}
                               index={index++} />
            )))
            const nextInfo = response.next
            if (nextInfo === undefined) {return}
            const moreEntriesIndicator = <LoadingIndicator title="loading more tracks" />
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    fetch({ ...request, fetch: () => fetchTracks(nextInfo, tracks.at(-1)) })
                        .finally(() => moreEntriesIndicator.remove())
                    observer.disconnect()
                }
            })
            element.append(moreEntriesIndicator)
            observer.observe(moreEntriesIndicator)
        })
        .catch(() => {
            if (element.isConnected) {
                element.append(<FailureIndicatorIndicator title="Could not load tracks"
                                                          onRetry={() => fetch(request)} />)
            }
        })
    const loadingIndicator = <LoadingIndicator title="loading tracks" />
    element.append(loadingIndicator)
    fetch(request).then(() => loadingIndicator.remove())
    return element
}