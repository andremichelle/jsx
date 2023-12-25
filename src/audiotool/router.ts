import { Option } from "@common/option.ts"
import { ApiV1 } from "./api.v1.ts"

export const router = (url: string): Option<ApiV1.Request> => {
    const path: ReadonlyArray<string> = new URL(url).hash.substring(1).split("/")
    const scope = path[0]
    const key = path[1]
    if (key === undefined) {return Option.None}
    switch (scope) {
        case "tracks":
            return Option.wrap({
                scope: "tracks",
                artistKey: key,
                fetch: () => ApiV1.fetchTracks(`${ApiV1.URL}/user/${key}/tracks.json?orderBy=created&cover=64&offset=0&limit=50`)
            })
        case "playlists":
            return Option.wrap({
                scope: "playlists",
                artistKey: key,
                fetch: () => ApiV1.fetchUserPlaylists(key)
            })
        case "playlist":
            return Option.wrap({
                scope: "playlist",
                fetch: () => ApiV1.fetchTracks(`${ApiV1.URL}/album/${key}/tracks.json?cover=128&offset=0&limit=50`)
            })
        case "genre":
            return Option.wrap({
                scope: "genre",
                fetch: () => ApiV1.fetchTracks(`${ApiV1.URL}/tracks/query.json?cover=128&genre=${key}&offset=0&limit=50`)
            })
    }
    return Option.None
}