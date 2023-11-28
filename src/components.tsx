/** @jsx createElement */
import { createElement, Ref } from "./jsx/create-element.ts"

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

export class BarElement extends HTMLElement {
    constructor(construct: {
        nested: {
            deep: {
                value: number
            }
        }
    }) {
        super()

        console.log("BarElement", construct.nested.deep.value)
    }
}

export const test = () => {
    const ref = Ref.create<BarElement>()
    const element =
        <c-foo index={42} name="abc">
            <c-bar class="someclass" nested={{ deep: { value: 303 } }}>
                <span style={{ color: "red" }} ref={ref}>Hello, world!</span>
            </c-bar>
        </c-foo>
    ref.get().addEventListener("click", () => console.log("click"))
    return { element, ref }
}