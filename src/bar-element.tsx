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