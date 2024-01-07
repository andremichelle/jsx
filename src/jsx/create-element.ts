// noinspection JSUnusedGlobalSymbols

import { SupportedSvgTags } from "@jsx/supported-svg-tags"
import { Inject } from "@jsx/inject.ts"
import { canWrite } from "@common/lang.ts"
import { DomElement } from "@jsx/definitions.ts"
import { Html } from "@ui/html.ts"

export type JsxValue = null | undefined | boolean | string | number | DomElement | Array<JsxValue>
type Factory = (attributes: Readonly<Record<string, any>>, children?: ReadonlyArray<string | DomElement>) => JsxValue
type TagOrFactoryOrElement = string | Factory | DomElement

const EmptyAttributes = Object.freeze({})

/**
 * This method must be exposed as the "createElement" method
 * to be passively called on each html element defined in jsx files.
 * This is secured by injection defined in vite.config.ts
 */
export default function(tagOrFactoryOrElement: TagOrFactoryOrElement,
                        attributes: Readonly<Record<string, any>> | null,
                        ...children: ReadonlyArray<string | DomElement>): JsxValue {
    if (tagOrFactoryOrElement instanceof HTMLElement || tagOrFactoryOrElement instanceof SVGElement) {
        // already an element > early out
        return tagOrFactoryOrElement
    }
    let element
    if (typeof tagOrFactoryOrElement === "function") {
        element = tagOrFactoryOrElement(attributes ?? EmptyAttributes, children)
        if (element === false
            || element === true
            || element === null
            || element === undefined
            || typeof element === "string"
            || typeof element === "number"
            || Array.isArray(element)) {
            return element
        }
        // factories must have consumed all attributes
        attributes = null
    } else {
        element = SupportedSvgTags.has(tagOrFactoryOrElement)
            ? document.createElementNS("http://www.w3.org/2000/svg", tagOrFactoryOrElement)
            : document.createElement(tagOrFactoryOrElement)
    }
    if (children.length > 0) {
        replaceChildren(element, ...children)
    }
    if (attributes !== null) {
        transferAttributes(element, attributes)
    }
    return element
}

export const replaceChildren = (element: DomElement, ...children: ReadonlyArray<JsxValue>) => {
    Html.empty(element)
    children.forEach((value: JsxValue | Inject.TextValue) => {
        if (value === null || value === undefined || value === false) {return}
        if (Array.isArray(value)) {
            replaceChildren(element, ...value)
        } else if (value instanceof Inject.TextValue) {
            const text: Text = document.createTextNode(String(value.value))
            value.addTarget(text)
            element.append(text)
        } else if (typeof value === "string") {
            element.append(document.createTextNode(value))
        } else if (typeof value === "number") {
            element.append(document.createTextNode(String(value)))
        } else if (value instanceof Node) {
            element.append(value)
        }
    })
}

const transferAttributes = (element: DomElement, attributes: Readonly<Record<string, any>>) => {
    Object.entries(attributes).forEach(([key, value]: [string, unknown]) => {
        if (key === "class" || key === "className") {
            if (value instanceof Inject.ClassList) {
                value.addTarget(element)
            } else {
                element.classList.add(...(<string>value).split(" "))
            }
        } else if (key === "style") {
            Object.assign(element.style, <CSSStyleDeclaration>value)
        } else if (key === "ref") {
            if (value instanceof Inject.Ref) {
                value.addTarget(element)
            } else {
                throw new Error("value of 'ref' must be of type '_Ref'")
            }
        } else if (value instanceof Inject.Attribute) {
            value.addTarget(element, key)
        } else {
            if (canWrite(element, key)) {
                element[key] = value
            } else {
                element.setAttribute(key, String(value))
            }
        }
    })
}