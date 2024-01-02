import "./main.sass"
import { IconLibrary } from "./icons.tsx"
import { App } from "./app.tsx"

(async () => {
    document.body.appendChild(IconLibrary)
    document.body.appendChild(App())
})()