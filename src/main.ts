import "./main.sass"
import { IconLibrary } from "./icons.tsx"
import { App } from "./audiotool/ui/App.tsx"
import { fetchUserAlbumList } from "./audiotool/api.ts"

(async () => {
    console.log(await fetchUserAlbumList("sandburgen"))

    document.body.appendChild(IconLibrary)
    // document.body.appendChild(ExampleApp())
    document.body.appendChild(App())
})()