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
    const coverHref = Inject.attribute(Html.EmptyGif)
    const trackName = Inject.text("")
    const playbackElapsed = Inject.text("00:00")
    const playbackDuration = Inject.text("00:00")
    const updateUserList = Inject.ref<Procedure<ReadonlyArray<User>>>()
    const element = <div className={Html.adoptStyleSheet(css, "player")}>
        <header className="cover" onclick={() => playback.active.ifSome(track => playback.toggle(track))}>
            <img src={coverHref} />
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
    playback.subscribe(event => {
        if (event.state === "activate") {
            event.track.match({
                none: () => {
                    coverHref.value = ""
                    trackName.value = ""
                    updateUserList.get()([])
                    playbackElapsed.value = timespanToString(0)
                    playbackDuration.value = timespanToString(0)
                },
                some: track => {
                    coverHref.value = `${location.protocol}${track.coverUrl ?? track.snapshotUrl}`
                    trackName.value = track.name
                    updateUserList.get()(track.collaborators)
                    playbackDuration.value = timespanToString(track.duration)
                }
            })
        } else if (event.state === "progress") {
            playbackElapsed.value = timespanToString(event.elapsedInSeconds * 1000)
        }
    })
    return element
}