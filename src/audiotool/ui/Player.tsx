import css from "./Player.sass?inline"
import { Html } from "@ui/html.ts"
import { Playback } from "../playback.ts"
import { Inject } from "@jsx/inject.ts"
import { Procedure } from "@common/lang.ts"
import { AuthorList } from "./AuthorList.tsx"
import { PlaybackProgress } from "./PlaybackProgress.tsx"
import { timespanToString } from "../time-conversion.ts"
import { ApiV1 } from "../api.v1.ts"

export type PlayerProps = { playback: Playback }

export const Player = ({ playback }: PlayerProps) => {
    const headerClasses = Inject.classes("cover")
    const stateClasses = Inject.classes("state")
    const coverHref = Inject.attribute(Html.EmptyGif)
    const profileLink = Inject.attribute("#")
    const trackName = Inject.text("")
    const playbackElapsed = Inject.text("00:00")
    const playbackDuration = Inject.text("00:00")
    const populateUserList = Inject.ref<Procedure<ReadonlyArray<ApiV1.User>>>()
    const element = (
        <section className={Html.adoptStyleSheet(css, "player")}>
            <div className="center">
                <header className={headerClasses}
                        onclick={() => playback.active.ifSome(track => playback.toggle(track))}>
                    <img src={coverHref} />
                    <img src={coverHref} />
                    <div className={stateClasses} />
                </header>
                <div className="info">
                    <div className="top">
                        <div className="meta">
                            <a className="name" href={profileLink} target="audiotool">{trackName}</a>
                            <AuthorList populate={populateUserList} users={[]} />
                        </div>
                        <nav>
                            <button style={{ display: "none" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"
                                        fill="currentColor"></path>
                                </svg>
                            </button>
                            <button onclick={() => location.hash = ""}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z"
                                        fill="currentColor"></path>
                                </svg>
                            </button>
                        </nav>
                    </div>
                    <PlaybackProgress playback={playback} />
                    <div className="time">
                        <span>{playbackElapsed}</span>
                        <span>{playbackDuration}</span>
                    </div>
                </div>
            </div>
        </section>
    )
    playback.subscribe(event => {
        if (event.state === "activate") {
            event.track.match({
                none: () => {
                    coverHref.value = ""
                    trackName.value = ""
                    populateUserList.get()([])
                    playbackElapsed.value = timespanToString(0)
                    playbackDuration.value = timespanToString(0)
                    headerClasses.remove("active")
                    profileLink.value = "#"
                },
                some: track => {
                    coverHref.value = `${location.protocol}${track.coverUrl ?? track.snapshotUrl}`
                    trackName.value = track.name
                    populateUserList.get()(track.collaborators)
                    playbackDuration.value = timespanToString(track.duration)
                    headerClasses.add("active")
                    profileLink.value = `https://www.audiotool.com/track/${track.key}`
                }
            })
        } else if (event.state === "progress") {
            playbackElapsed.value = timespanToString(event.elapsedInSeconds * 1000)
        } else if (event.state === "buffering") {
            stateClasses.add("buffering")
        } else if (event.state === "playing") {
            stateClasses.add("playing")
            stateClasses.remove("buffering")
        } else if (event.state === "paused") {
            stateClasses.remove("playing")
        }
    })
    return element
}