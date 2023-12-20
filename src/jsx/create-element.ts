// noinspection JSUnusedGlobalSymbols

import { SupportedSvgTags } from "@jsx/supported-svg-tags"
import { Inject } from "@jsx/inject.ts"
import { canWrite, safeWrite } from "@common/lang.ts"
import { DomElement } from "@jsx/definitions.ts"

type ComponentFactory = (attributes: Readonly<Record<string, any>>) => DomElement

/**
 * This method must be exposed as the "createElement" method
 * to be passively called on each html element defined in jsx files.
 * This is secured by injection defined in vite.config.ts
 */
export default function(tagOrFactory: string | ComponentFactory,
                        attributes: Readonly<Record<string, any>> | null,
                        ...children: ReadonlyArray<string | DomElement>): DomElement {
    const isFactory = typeof tagOrFactory === "function"
    const element: DomElement = (() => {
        if (isFactory) {
            return tagOrFactory(attributes ?? {})
        } else {
            return SupportedSvgTags.has(tagOrFactory)
                ? document.createElementNS("http://www.w3.org/2000/svg", tagOrFactory)
                : document.createElement(tagOrFactory)
        }
    })()
    if (attributes !== null) {
        Object.entries(attributes).forEach(([key, value]: [string, unknown]) => {
            if (key === "class") {
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
                    safeWrite(element, key, value)
                } else {
                    element.setAttribute(key, String(value))
                }
            }
        })
    }
    children.flat().forEach((value: string | DomElement | Inject.TextValue) => {
        if (value instanceof Inject.TextValue) {
            const text: Text = document.createTextNode(String(value.value))
            value.addTarget(text)
            element.append(text)
        } else {
            element.append(value)
        }
    })
    return element
}