import css from "./Player.sass?inline"
import { Html } from "@ui/html.ts"
import { Playback } from "./playback.ts"
import { Inject } from "@jsx/inject.ts"
import { Procedure } from "@common/lang.ts"
import { User } from "./api.ts"
import { UserList } from "./UserList.tsx"

export type PlayerProps = {
    playback: Playback
}

export const Player = ({ playback }: PlayerProps) => {
    const coverHref = Inject.attribute(Html.EmptyGif)
    const trackName = Inject.text("")
    const updateUserList = Inject.ref<Procedure<ReadonlyArray<User>>>()
    const element = <div className={Html.adoptStyleSheet(css, "player")}>
        <header className="cover">
            <img src={coverHref} />
        </header>
        <div className="names">
            <div className="track">{trackName}</div>
            <UserList ref={updateUserList} users={[]} />
        </div>
    </div>
    playback.subscribe(event => {
        if (event.state === "activate") {
            event.track.match({
                none: () => {
                    coverHref.value = ""
                    trackName.value = ""
                    updateUserList.get()([])
                },
                some: track => {
                    coverHref.value = `${location.protocol}${track.coverUrl}`
                    trackName.value = track.name
                    updateUserList.get()(track.collaborators)
                }
            })

        }
    })
    return element
}