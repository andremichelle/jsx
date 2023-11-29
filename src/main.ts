import { CustomElementRegistry } from "@jsx/definitions"
import { test } from "./test"

(async () => {
    await CustomElementRegistry.load()

    const result = test()
    document.body.appendChild(result.element)
    result.refBar.get().foo()
    result.refSpan.get().textContent = "Foo"
})()