import { IconLibrary } from "./icons.tsx"
import { AudiotoolApp } from "./audiotool/app.tsx"
import "./main.sass"

(async () => {
    document.body.appendChild(IconLibrary)
    // document.body.appendChild(ExampleApp())
    document.body.appendChild(AudiotoolApp())
})()