import css from "./Player.sass?inline"
import { Html } from "@ui/html.ts"
import { Playback } from "../playback.ts"
import { Inject } from "@jsx/inject.ts"
import { Procedure } from "@common/lang.ts"
import { User } from "../api.ts"
import { UserList } from "./UserList.tsx"
import { PlaybackProgress } from "./PlaybackProgress.tsx"
import { timespanToString } from "../time-conversion.ts"

export type PlayerProps = {
    playback: Playback
}

export const Player = ({ playback }: PlayerProps) => {
    const headerClasses = Inject.classes("cover")
    const stateClasses = Inject.classes("state")
    const coverHref = Inject.attribute(Html.EmptyGif)
    const trackName = Inject.text("")
    const playbackElapsed = Inject.text("00:00")
    const playbackDuration = Inject.text("00:00")
    const updateUserList = Inject.ref<Procedure<ReadonlyArray<User>>>()
    const element = (
        <div className={Html.adoptStyleSheet(css, "player")}>
            <header className={headerClasses}
                    onclick={() => playback.active.ifSome(track => playback.toggle(track))}>
                <img src={coverHref} />
                <div className={stateClasses} />
            </header>
            <div className="info">
                <div className="track">{trackName}</div>
                <UserList populate={updateUserList} users={[]} />
                <PlaybackProgress playback={playback} />
                <div className="time">
                    <span>{playbackElapsed}</span>
                    <span>{playbackDuration}</span>
                </div>
            </div>
        </div>
    )
    playback.subscribe(event => {
        if (event.state === "activate") {
            event.track.match({
                none: () => {
                    coverHref.value = ""
                    trackName.value = ""
                    updateUserList.get()([])
                    playbackElapsed.value = timespanToString(0)
                    playbackDuration.value = timespanToString(0)
                    headerClasses.remove("active")
                },
                some: track => {
                    coverHref.value = `${location.protocol}${track.coverUrl ?? track.snapshotUrl}`
                    trackName.value = track.name
                    updateUserList.get()(track.collaborators)
                    playbackDuration.value = timespanToString(track.duration)
                    headerClasses.add("active")
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