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
}

export type User = {
    key: string
    name: string
    avatar: string
}