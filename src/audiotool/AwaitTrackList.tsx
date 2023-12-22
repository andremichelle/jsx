import { fetchTrackList, UserTrackList } from "./api.ts"
import { Await } from "@jsx/utils.ts"
import { Playback } from "./playback.ts"
import { TrackList } from "./TrackList.tsx"
import { Html } from "@ui/html.ts"
import css from "./AwaitTrackList.sass?inline"

const className = Html.adoptStyleSheet(css, "await-track-list")

export type AwaitTrackListProps = {
    request: RequestInfo
    playback: Playback
}

export const AwaitTrackList = ({ request, playback }: AwaitTrackListProps) => (
    <div class={className}>
        <Await<UserTrackList>
            promise={() => fetchTrackList(request)}
            loading={() => <div class="loading">loading</div>}
            success={(data) => <TrackList data={data} playback={playback} />}
            failure={({ retry }) => (
                <div class="failure">
                    <p>Could not load tracklist.</p>
                    <button onclick={retry}>Retry</button>
                </div>)} />
    </div>
)