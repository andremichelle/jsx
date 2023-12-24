import { LoadingIndicator } from "./LoadingIndicator.tsx"
import { FailureIndicatorIndicator } from "./FailureIndicator.tsx"
import { Html } from "@ui/html.ts"
import { fetchUsers } from "../api.ts"
import css from "./ArtistCards.sass?inline"
import { ListHeader } from "./ListHeader.tsx"
import { Option } from "@common/option.ts"
import { User } from "../data-types.ts"

const className = Html.adoptStyleSheet(css, "artist-cards")

let cache: Option<ReadonlyArray<User>> = Option.None

export type ArtistCardsProps = {
    keys: ReadonlyArray<string>
}

export const ArtistCards = ({ keys }: ArtistCardsProps) => {
    const element: HTMLElement = <section className={className} />
    const populate = (users: ReadonlyArray<User>) => {
        element.append(<ListHeader name="Popular Audiotool Artists" />)
        element.append(...users.toSorted(() => Math.sign(Math.random() * 2.0 - 1.0))
            .map(user => (
                <button onclick={() => location.hash = `tracks/${user.key}`}>
                    <img src={user.avatar} />
                    <div>{user.name}</div>
                </button>
            )))
    }
    if (cache.nonEmpty()) {
        populate(cache.unwrap())
    } else {
        const fetch = async () => {
            const loadingIndicator = <LoadingIndicator title="loading artists" />
            element.append(loadingIndicator)
            return fetchUsers(...keys)
                .then((users: ReadonlyArray<User>) => {
                    cache = Option.wrap(users)
                    if (element.isConnected) {populate(users)}
                })
                .catch(() => {
                    if (element.isConnected) {
                        element.append(
                            <FailureIndicatorIndicator title="Could not load playlists"
                                                       onRetry={() => fetch()} />
                        )
                    }
                })
                .finally(() => loadingIndicator.remove())
        }
        fetch().then(() => {})
    }
    return element
}