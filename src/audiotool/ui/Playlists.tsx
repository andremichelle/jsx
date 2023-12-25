import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { Html } from "@ui/html.ts"
import css from "./Playlists.sass?inline"
import { ListHeader } from "./ListHeader.tsx"
import { ApiV1 } from "../api.v1.ts"

const className = Html.adoptStyleSheet(css, "playlists")

export type PlaylistsProps = { request: ApiV1.PlayListsRequest }

export const Playlists = ({ request }: PlaylistsProps) => {
    const element: HTMLElement = <section className={className} />
    const fetch = (request: ApiV1.PlayListsRequest) => request.fetch()
        .then((response: ApiV1.PlaylistsResponse) => {
            if (!element.isConnected) {return}
            element.append(
                <ListHeader name={response.name} link={{
                    label: "Show Artists Tracks",
                    href: `#tracks/${request.artistKey}`
                }} />
            )
            element.append(...response.playlists.map(playlist => (
                <button onclick={() => location.hash = `playlist/${playlist.key}`}>
                    <img src={playlist.image} />
                    <div>{playlist.name}</div>
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