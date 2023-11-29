import { CustomElement } from "@jsx/definitions.ts"

export class BarElement extends HTMLElement implements CustomElement {
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
    connectedCallback(): void {
    }

    disconnectedCallback(): void {
    }

    foo(): void {
        console.log(this, "foo(0)")
    }
}