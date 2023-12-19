import { SupportedSvgTags } from "@jsx/supported-svg-tags"
import { Placeholder } from "@jsx/placeholder.ts"
import { safeWrite } from "../common/lang.ts"

class _Ref<E extends DomElement> implements Ref<E> {
    element: E | null = null
    get(): E {
        if (this.element === null) {throw new Error("Could not resolve element")}
        return this.element
    }
}

export const Ref = { create: <E extends DomElement>(): Ref<E> => new _Ref<E>() } as const

export type DomElement = HTMLElement | SVGElement

type ComponentFactory = (attributes: Readonly<Record<string, any>>) => DomElement

/**
 * This method must be exposed as the "createElement" method
 * to be passively called on each html element defined in jsx files.
 * This is secured by injection defined in vite.config.ts
 */
export default function(tag: string | ComponentFactory,
                        attributes: Readonly<Record<string, any>> | null,
                        ...children: ReadonlyArray<string | DomElement>): DomElement {
    const isFactory = typeof tag === "function"
    const element: DomElement = (() => {
        if (isFactory) {
            return tag(attributes ?? {})
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
            } else {
                if (key in element) {
                    safeWrite(element, key, value)
                } else {
                    element.setAttribute(key, String(value))
                }
            }
        })
    }
    children.flat().forEach((value: string | DomElement | Placeholder.TextContent) => {
        if (value instanceof Placeholder.TextContent) {
            const text: Text = document.createTextNode(String(value.value))
            value.subscribe(text)
            element.append(text)
        } else {
            element.append(typeof value === "string" ? document.createTextNode(value) : value)
        }
    })
    return element
}