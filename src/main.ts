import "./main.sass"
import { IconLibrary } from "./icons.tsx"
import { AudiotoolApp } from "./audiotool/app.tsx"

(async () => {
    document.body.appendChild(IconLibrary)
    // document.body.appendChild(ExampleApp())
    document.body.appendChild(AudiotoolApp())
})()