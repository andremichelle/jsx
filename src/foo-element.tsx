export class FooElement extends HTMLElement {
    #children: ReadonlyArray<string | Element> = []

    constructor({ index, name }: {
        index: number,
        name?: string
    }) {
        super()

        console.log("FooElement", index, name)
    }

    append(...elements: ReadonlyArray<string | Element>) {
        this.#children = elements
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