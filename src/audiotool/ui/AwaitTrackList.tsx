import { fetchTrackList, UserTrackList } from "../api.ts"
import { Await } from "@jsx/utils.ts"
import { Playback } from "../playback.ts"
import { TrackList } from "./TrackList.tsx"
import { Html } from "@ui/html.ts"
import css from "./AwaitTrackList.sass?inline"

const className = Html.adoptStyleSheet(css, "await-track-list")

export type AwaitTrackListProps = {
    request: RequestInfo
    playback: Playback
}

export const AwaitTrackList = ({ request, playback }: AwaitTrackListProps) => (
    <div className={className}>
        <Await<UserTrackList>
            promise={() => fetchTrackList(request)}
            loading={() => <div className="loading">loading</div>}
            success={(data) => <TrackList list={data} playback={playback} />}
            failure={({ retry }) => (
                <div className="failure">
                    <p>Could not load tracklist.</p>
                    <button onclick={retry}>Retry</button>
                </div>)} />
    </div>
)