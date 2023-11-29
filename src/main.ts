import { CustomElementRegistry } from "./jsx/definitions.ts"
import { test } from "./test.tsx"

(async () => {
    await CustomElementRegistry.load()

    const result = test()
    document.body.appendChild(result.element)
    result.refBar.get().foo()
    result.refSpan.get().textContent = "Foo"
})()