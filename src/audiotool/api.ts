import { int } from "@common/lang.ts"

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