import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { TrackListItem } from "./TrackListItem.tsx"
import { ApiTrackListRequest, fetchTracks, Track } from "../api.ts"
import { Playback } from "../playback.ts"
import { Html } from "@ui/html.ts"
import { int } from "@common/lang.ts"
import css from "./TrackList.sass?inline"
import { ListHeader } from "./ListHeader.tsx"

const className = Html.adoptStyleSheet(css, "track-list")

export type TrackListProps = {
    playback: Playback
    request: ApiTrackListRequest
}

export const TrackList = ({ playback, request }: TrackListProps) => {
    let index: int = 0
    const element: HTMLElement = <section className={className} />
    const fetch = (request: ApiTrackListRequest) => request.fetch()
        .then(response => {
            if (!element.isConnected) {return}
            if (index === 0) {
                element.append(
                    <ListHeader name={response.name} link={
                        request.scope === "tracks"
                            ? {
                                label: "Show Artists Playlists",
                                href: `#playlists/${request.artistKey}`
                            } : undefined} />)
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