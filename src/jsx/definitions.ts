// noinspection JSUnusedGlobalSymbols

import { BarElement } from "../bar-element"
import { FooElement } from "../foo-element"

export namespace CustomElementRegistry {
    export const Definitions = {
        "c-foo": FooElement,
        "c-bar": BarElement
    } as const

    export const load = async () => Promise.all(Object
        .entries(CustomElementRegistry.Definitions)
        .map(([name, clazz]) => {
            customElements.define(name, clazz)
            return customElements.whenDefined(name)
        }))
}

export interface CustomElement extends HTMLElement {
    connectedCallback(): void
    disconnectedCallback(): void
    adoptedCallback?(): void
}

// These are all utility type to typescript understand usual html and svg elements.
//
type StringTypes =
    | SVGAnimatedLength
    | SVGAnimatedLengthList
    | SVGAnimatedNumber
    | SVGAnimatedRect
    | SVGAnimatedString

type ExtractAttributes<T extends Element> = Partial<{
    [K in keyof T]: T[K] extends Function ? never : T[K] extends StringTypes ? string : Partial<T[K]>
}> & {
    ref?: Ref<T>
} & Record<string, unknown>

type NativeElements =
    & { [K in keyof Omit<SVGElementTagNameMap, "a">]: Omit<ExtractAttributes<SVGElementTagNameMap[K]>, "a"> }
    & { [K in keyof Omit<HTMLElementTagNameMap, "a">]: Omit<ExtractAttributes<HTMLElementTagNameMap[K]>, "a"> }

    // There is something fuzzy about the anchor tag
    // ExtractAttributes fails on href, because there is a strange relation to the declared toString method?
    // And it is in html and svg namespace.
    & {
    "a": {
        href: string,
        target: string
    }
}

type CustomElementDefinitions = typeof CustomElementRegistry.Definitions
type CustomElementAttributes<T> =
    T extends new (...args: any[]) => infer R
        ? R extends CustomElement
            ? ExtractAttributes<R> & ConstructorParameters<T>[0]
            : "class does not produce a CustomElement"
        : "not a class"

type CustomElements = { [K in keyof CustomElementDefinitions]: CustomElementAttributes<CustomElementDefinitions[K]> }

declare global {
    interface Ref<E extends Element> {
        get(): E
    }

    namespace JSX {interface IntrinsicElements extends NativeElements, CustomElements {}}
}

export {}