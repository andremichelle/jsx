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

type DomElement = HTMLElement | SVGElement

type ComponentFactory = (attributes: Readonly<Record<string, any>>) => DomElement

// noinspection JSUnusedGlobalSymbols
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
            console.log(key, value)
            if (value instanceof Placeholder.NodeValue) {
                value.subscribe(() => {
                    console.log("Changed", element)
                })
            } else if (key === "class") {
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
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
    children.flat().forEach((value: string | DomElement | Placeholder.NodeValue) => {
        if (value instanceof Placeholder.NodeValue) {
            const child: Text = document.createTextNode(String(value.value))
            value.subscribe((value) => child.nodeValue = String(value))
            element.append(child)
        } else {
            element.append(typeof value === "string" ? document.createTextNode(value) : value)
        }
    })
    return element
}