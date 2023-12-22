import { IconLibrary } from "./icons.tsx"
import { ExampleApp } from "./example-app.tsx"

(async () => {
    document.body.appendChild(IconLibrary)
    document.body.appendChild(ExampleApp())
    // document.body.appendChild(AudiotoolApp())
})()