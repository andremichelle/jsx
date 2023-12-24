import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { Html } from "@ui/html.ts"
import { fetchUsers, User } from "../api.ts"
import css from "./ArtistCards.sass?inline"
import { ListHeader } from "./ListHeader.tsx"

const className = Html.adoptStyleSheet(css, "artist-cards")

export type ArtistCardsProps = {
    keys: ReadonlyArray<string>
}

export const ArtistCards = ({ keys }: ArtistCardsProps) => {
    const element: HTMLElement = <section className={className} />
    const fetch = async () => {
        const loadingIndicator = <LoadingIndicator title="loading artists" />
        element.append(loadingIndicator)
        return fetchUsers(...keys)
            .then((response: ReadonlyArray<User>) => {
                if (!element.isConnected) {return}
                element.append(<ListHeader name="Popular Audiotool Artists" />)
                element.append(...response.map(user => (
                    <button onclick={() => location.hash = `tracks/${user.key}`}>
                        <img src={user.avatar} />
                        <div>{user.name}</div>
                    </button>
                )))
            })
            .catch(() => {
                if (element.isConnected) {
                    element.append(<FailureIndicatorIndicator title="Could not load playlists"
                                                              onRetry={() => fetch()} />)
                }
            })
            .finally(() => loadingIndicator.remove())
    }

    fetch().then()
    return element
}