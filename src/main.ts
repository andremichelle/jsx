import { CounterApp } from "./counter-app.tsx"
import { IconLibrary } from "./icons.tsx"

(async () => {
    document.body.appendChild(IconLibrary)
    document.body.appendChild(CounterApp())
})()