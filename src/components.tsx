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

    foo(): void {
        console.log(this, "foo(0)")
    }
}

export const test = () => {
    const refBar = Ref.create<BarElement>()
    const refSpan = Ref.create<HTMLSpanElement>()
    const element =
        <c-foo index={42} name="abc">
            <c-bar ref={refBar} class="someclass" nested={{ deep: { value: 303 } }}>
                <span style={{ color: "red" }} ref={refSpan}>Hello, world!</span>
            </c-bar>
        </c-foo>
    refSpan.get().addEventListener("click", () => console.log("click"))
    return { element, refBar, refSpan }
}