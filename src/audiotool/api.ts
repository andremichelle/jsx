import { int, Provider } from "@common/lang.ts"
import { Option } from "@common/option.ts"
import { Html } from "@ui/html.ts"

export type TrackListResponse = {
    name: string
    tracks: ReadonlyArray<Track>
    next?: string
}

export type PlaylistsResponse = {
    name: string
    playlists: ReadonlyArray<Playlist>
}

export type Track = {
    key: string
    id: number
    name: string
    created: number
    modified: number
    user: User
    template: boolean
    published: boolean
    snapshotUrl: string
    pksUrl: string
    coverUrl: string
    collaborators: ReadonlyArray<User>
    bpm: number
    genreKey: string
    genreName: string
    duration: number
    isNextTrack: boolean
    joinPolicy: number
    license: number
} & {
    prev?: Track
    next?: Track
}

export type User = {
    key: string
    name: string
    avatar: string
}

export type ApiRequest = ApiTrackListRequest | ApiPlayListsRequest

export type ApiTrackListRequest = {
    scope: "tracks"
    artistKey: string
    fetch: Provider<Promise<TrackListResponse>>
} | {
    scope: "playlist"
    fetch: Provider<Promise<TrackListResponse>>
} | {
    scope: "genre"
    fetch: Provider<Promise<TrackListResponse>>
}

export type ApiPlayListsRequest = {
    scope: "playlists"
    artistKey: string
    fetch: Provider<Promise<PlaylistsResponse>>
}

// orderBy=[favs,created]
// so=[relevance]

const API_URL = `https://api.audiotool.com`

export const router = (url: string): Option<ApiRequest> => {
    const path: ReadonlyArray<string> = new URL(url).hash.substring(1).split("/")
    const scope = path[0]
    const key = path[1]
    if (key === undefined) {return Option.None}
    switch (scope) {
        case "tracks":
            return Option.wrap({
                scope: "tracks",
                artistKey: key,
                fetch: () => fetchTracks(`${API_URL}/user/${key}/tracks.json?orderBy=created&cover=64&offset=0&limit=50`)
            })
        case "playlists":
            return Option.wrap({
                scope: "playlists",
                artistKey: key,
                fetch: () => fetchUserPlaylists(key)
            })
        case "playlist":
            return Option.wrap({
                scope: "playlist",
                fetch: () => fetchTracks(`${API_URL}/album/${key}/tracks.json?cover=128&genre=${key}&offset=0&limit=50`)
            })
        case "genre":
            return Option.wrap({
                scope: "genre",
                fetch: () => fetchTracks(`${API_URL}/tracks/query.json?cover=128&genre=${key}&offset=0&limit=50`)
            })
    }
    return Option.None
}

export type Playlist = {
    key: string
    name: string
    image: string
}

export const fetchUsers = async (...keys: ReadonlyArray<string>): Promise<ReadonlyArray<User>> =>
    Promise.all(keys.map(key => fetch(`${API_URL}/user/${key}.json`).then(x => x.json())))

export const fetchTracks = async (info: RequestInfo, lastTrack?: Track): Promise<TrackListResponse> =>
    fetch(info)
        .then(x => x.json())
        .then((json: TrackListResponse) => {
            const tracks = json.tracks
            tracks.forEach((track: Track, index: int) => {
                track.prev = tracks[index - 1]
                track.next = tracks[index + 1]
                track.collaborators
            })
            if (lastTrack !== undefined) {
                tracks[0].prev = lastTrack
                lastTrack.next = tracks[0]
            }
            return json
        })

export const fetchUserPlaylists = async (userKey: string): Promise<PlaylistsResponse> =>
    fetch(`${API_URL}/browse/user/${userKey}/albums/`)
        .then(x => x.text())
        .then(x => {
            const documentElement = new DOMParser().parseFromString(x, "text/xml").documentElement
            const artistName = documentElement.getAttribute("subtitle") ?? "Untitled"
            return {
                name: `${artistName}'s Playlists`,
                playlists: Array.from(documentElement.children)
                    .map((element: Element) => {
                        let uri = element.getAttribute("uri")!
                        uri = uri.slice(0, -1)
                        uri = uri.slice(uri.lastIndexOf("/") + 1)
                        const image = element.getAttribute("image")
                        return ({
                            key: uri,
                            name: element.getAttribute("title") ?? "Untitled",
                            image: image === null ? Html.EmptyGif : `${location.protocol}${image}`
                        })
                    })
            }
        })