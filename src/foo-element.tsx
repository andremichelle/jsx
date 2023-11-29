import { CustomElement } from "@jsx/definitions.ts"

export class FooElement extends HTMLElement implements CustomElement {
    #children: ReadonlyArray<string | Element> = []

    constructor({ index, name }: {
        index: number,
        name?: string
    }) {
        super()

        console.log("FooElement", index, name)
    }

    append(...children: ReadonlyArray<string | Element>) {
        this.#children = children
    }

    connectedCallback(): void {
        const divElement = document.createElement("div")
        divElement.append(...this.#children)
        this.appendChild(divElement)
    }

    disconnectedCallback(): void {
        // TODO dispose children
    }
}