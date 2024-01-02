import "./main.sass"
import { App } from "./app.tsx"
import { IconLibrary } from "./icons.tsx"

(async () => {
    document.body.appendChild(IconLibrary)
    document.body.appendChild(App())
})()