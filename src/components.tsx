/** @jsx createElement */

export class FooElement extends HTMLElement {
    constructor(construct: {
        index: number,
        name?: string
    }) {
        super()

        console.log("FooElement", construct.index, construct.name)
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

export const createFooElement = () =>
    <c-foo index={42} name="abc">
        <c-bar nested={{ deep: { value: 303 } }}><span style={{ color: "red" }}>Hello, world!</span></c-bar>
    </c-foo>