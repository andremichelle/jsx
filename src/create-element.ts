const factory = (tag: string, attributes: Record<string, any>): Element => {
    if (tag.includes("-")) {
        const constructor = customElements.get(tag)
        if (constructor === undefined) {
            throw new Error(`Undefined custom-element '${tag}'`)
        }
        return new constructor(attributes)
    } else {
        return document.createElement(tag)
    }
}

/**
 * This method must be exposed as the "createElement" method
 * to be passively called on each html element defined in jsx files.
 */
export default function createElement(tag: string,
                                      attributes: Record<string, any>,
                                      ...children: ReadonlyArray<string | Element>): Element {
    console.log(`tag: ${tag}`)
    const element: Element = factory(tag, attributes)
    for (const child of children) {
        element.append(child)
    }
    return element
}