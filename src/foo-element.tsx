export class FooElement extends HTMLElement {
    #content: ReadonlyArray<string | Element> = []

    constructor(construct: {
        index: number,
        name?: string
    }) {
        super()

        console.log("FooElement", construct.index, construct.name)
    }

    append(...nodes: ReadonlyArray<string | Element>) {
        this.#content = nodes
    }

    connectedCallback(): void {
        const divElement = document.createElement("div")
        divElement.append(...this.#content)
        this.appendChild(divElement)
    }

    disconnectedCallback(): void {
        // TODO dispose children
    }
}

