import { int } from "@common/lang.ts"
import { Option } from "@common/option.ts"
import { Html } from "@ui/html.ts"

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
    const value = path[1]
    if (value === undefined) {return Option.None}
    switch (scope) {
        case "artist":
        case "tracks":
            return Option.wrap(`${API_URL}/user/${value}/tracks.json?cover=64&offset=0&limit=500`)
        case "genre":
            return Option.wrap(`${API_URL}/tracks/query.json?cover=128&genre=${value}&offset=0&limit=500`)
        case "album":
            return Option.wrap(`${API_URL}/album/${value}/tracks.json?cover=128&genre=${value}&offset=0&limit=500`)
    }
    return Option.None
}

export type Album = {
    key: string
    name: string
    image: string
}

export const fetchUserAlbumList = async (userKey: string): Promise<ReadonlyArray<Album>> =>
    fetch(`https://api.audiotool.com/browse/user/${userKey}/albums/`)
        .then(x => x.text())
        .then(x => {
            return Array
                .from(new DOMParser().parseFromString(x, "text/xml").documentElement.children)
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
        })

export const fetchTrackList = async (request: RequestInfo): Promise<UserTrackList> =>
    fetch(request)
        .then(x => x.json())
        .then((json: UserTrackList) => {
            const tracks = json.tracks
            tracks.forEach((track: Track, index: int) => {
                track.prev = tracks[index - 1]
                track.next = tracks[index + 1]
                track.collaborators
            })
            return json
        })