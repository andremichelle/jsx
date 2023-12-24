import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { ApiPlayListsRequest, PlaylistsResponse } from "../api.ts"
import { Html } from "@ui/html.ts"
import css from "./Playlists.sass?inline"
import { ListHeader } from "./ListHeader.tsx"

const className = Html.adoptStyleSheet(css, "playlists")

export type PlaylistsProps = {
    request: ApiPlayListsRequest
}

export const Playlists = ({ request }: PlaylistsProps) => {
    const element: HTMLElement = <section className={className} />
    const fetch = (request: ApiPlayListsRequest) => request.fetch()
        .then((response: PlaylistsResponse) => {
            if (!element.isConnected) {return}
            element.append(
                <ListHeader name={`${response.artistName}'s Playlists`} button={{
                    label: "Show Artists Tracks",
                    onClick: () => location.hash = `tracks/${request.artistKey}`
                }} />)
            element.append(...response.playlists.map(playlist => (
                <button onclick={() => location.hash = `playlist/${playlist.key}`}>
                    {playlist.name}
                </button>
            )))
        })
        .catch(() => {
            if (element.isConnected) {
                element.append(<FailureIndicatorIndicator title="Could not load playlists"
                                                          onRetry={() => fetch(request)} />)
            }
        })
    const loadingIndicator = <LoadingIndicator title="loading playlists" />
    element.append(loadingIndicator)
    fetch(request).then(() => loadingIndicator.remove())
    return element
}