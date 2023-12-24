import { Provider } from "@common/lang.ts"

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

export type Playlist = {
    key: string
    name: string
    image: string
}