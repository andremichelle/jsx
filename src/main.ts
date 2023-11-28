import { createFooElement } from "./components"
import { CustomElements } from "./jsx/definitions.ts"

(async () => {
    await CustomElements.load()

    document.body.appendChild(createFooElement())
})()