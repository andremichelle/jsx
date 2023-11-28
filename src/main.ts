import { test } from "./components"
import { CustomElements } from "./jsx/definitions.ts"

(async () => {
    await CustomElements.load()

    const result = test()
    document.body.appendChild(result.element)
    result.ref.get().textContent = "Foo"
})()