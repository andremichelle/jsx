import { BarElement, FooElement } from "./components.tsx"

export namespace CustomElements {
    export const Definitions = {
        "c-foo": FooElement,
        "c-bar": BarElement
    } as const

    export const load = async () => Promise.all(Object
        .entries(CustomElements.Definitions)
        .map(([name, clazz]) => {
            customElements.define(name, clazz)
            return customElements.whenDefined("c-foo")
        }))
}

// These are all utility type to typescript understand usual html and svg elements.
//
type StringTypes =
    | SVGAnimatedLength
    | SVGAnimatedLengthList
    | SVGAnimatedNumber
    | SVGAnimatedRect
    | SVGAnimatedString

type ExtractAttributes<T extends Element & GlobalEventHandlers> = Partial<{
    [K in keyof T]: T[K] extends Function ? never : T[K] extends StringTypes ? string : Partial<T[K]>
}> & { ref?: Ref<T> } & Record<string, unknown>

type Elements =
    & { [K in keyof Omit<SVGElementTagNameMap, "a">]: Omit<ExtractAttributes<SVGElementTagNameMap[K]>, "a"> }
    & { [K in keyof Omit<HTMLElementTagNameMap, "a">]: Omit<ExtractAttributes<HTMLElementTagNameMap[K]>, "a"> }
    // There is something fuzzy about the anchor tag
    // ExtractAttributes fails on href, because there is a strange relation to the declared toString method?
    // And it is in html and svg namespace.
    & {
    "a": { href: string, target: string }
}

type CustomJSXElements = {
    [K in keyof typeof CustomElements.Definitions]: ConstructorParameters<typeof CustomElements.Definitions[K]>[0]
}

declare global {
    interface Ref<E extends Element> {get(): E}

    namespace JSX {
        // noinspection JSUnusedGlobalSymbols
        interface IntrinsicElements extends Elements, CustomJSXElements {}
    }
}

export {}