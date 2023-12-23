import "./main.sass"
import { IconLibrary } from "./icons.tsx"
import { App } from "./audiotool/ui/App.tsx"

(async () => {
    document.body.appendChild(IconLibrary)
    // document.body.appendChild(ExampleApp())
    document.body.appendChild(App())
})()