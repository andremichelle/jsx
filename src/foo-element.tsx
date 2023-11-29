export class FooElement extends HTMLElement {
    #children: ReadonlyArray<string | Element> = []

    constructor(construct: {
        index: number,
        name?: string
    }) {
        super()

        console.log("FooElement", construct.index, construct.name)
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