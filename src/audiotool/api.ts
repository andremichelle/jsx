import { int } from "@common/lang.ts"
import { Option } from "@common/option.ts"

export type UserTrackList = {
    name: string
    tracks: Track[]
    next: string
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
    collaborators: User[]
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

export const router = (url: string): Option<RequestInfo> => {
    const API_URL = `https://api.audiotool.com`
    const path: ReadonlyArray<string> = new URL(url).hash.substring(1).split("/")
    const scope = path[0]
    switch (scope) {
        case "tracks":
            return Option.wrap(`${API_URL}/user/${path[1]}/tracks.json?cover=64&offset=0&limit=500`)
        case "genre":
            return Option.wrap(`${API_URL}/tracks/query.json?cover=128&genre=${path[1]}&offset=0&limit=500`)
    }
    return Option.None
}

export const fetchTrackList = async (request: RequestInfo): Promise<UserTrackList> => {
    return fetch(request).then(x => x.json()).then((json: UserTrackList) => {
        const tracks = json.tracks
        tracks.forEach((track: Track, index: int) => {
            track.prev = tracks[index - 1]
            track.next = tracks[index + 1]
        })
        return json
    })
}