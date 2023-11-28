import { createFooElement } from "./components"
import { CustomElements } from "./jsx.ts"

(async () => {
    await CustomElements.load()

    document.body.appendChild(createFooElement())
})()