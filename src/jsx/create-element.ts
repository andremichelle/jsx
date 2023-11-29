import { SupportedSvgTags } from "./supported-svg-tags"

type DomElement = HTMLElement | SVGElement

class _Ref<E extends DomElement> implements Ref<E> {
    element: E | null = null
    get(): E {
        if (this.element === null) {throw new Error("Could not resolve element")}
        return this.element
    }
}

export const Ref = { create: <E extends DomElement>(): Ref<E> => new _Ref<E>() } as const

// noinspection JSUnusedGlobalSymbols
/**
 * This method must be exposed as the "createElement" method
 * to be passively called on each html element defined in jsx files.
 * This is secured by injection defined in vite.config.ts
 */
export default function(tag: string,
                        attributes: Record<string, any> | null,
                        ...children: ReadonlyArray<string | DomElement>): DomElement {
    const isCustomElement = tag.includes("-")
    const element: DomElement = (() => {
        if (isCustomElement) {
            const constructor = customElements.get(tag)
            if (constructor === undefined) {throw new Error(`Undefined custom-element '${tag}'`)}
            return new constructor(attributes)
        } else {
            return SupportedSvgTags.has(tag)
                ? document.createElementNS("http://www.w3.org/2000/svg", tag)
                : document.createElement(tag)
        }
    })()
    if (attributes !== null) {
        Object.entries(attributes).forEach(([key, value]: [string, unknown]) => {
            if (key === "class") {
                element.classList.add(...(<string>value).split(" "))
            } else if (key === "style") {
                Object.assign(element.style, <CSSStyleDeclaration>value)
            } else if (key === "ref") {
                if (value instanceof _Ref) {
                    value.element = element
                } else {
                    throw new Error("value of 'ref' must be of type '_Ref'")
                }
            } else if (!isCustomElement) {
                if (typeof value === "string") {
                    element.setAttribute(key, value)
                } else {
                    element.setAttribute(key, String(value))
                }
            }
        })
    }
    if (isCustomElement && "content" in element) {
        element.content = children
    } else {
        children.flat().forEach((value) => element.append(value))
    }
    return element
}