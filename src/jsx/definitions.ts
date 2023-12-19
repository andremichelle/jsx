// noinspection JSUnusedGlobalSymbols

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

declare global {
    interface Ref<E extends Element> {
        get(): E
    }

    type DomElement = HTMLElement | SVGElement

    namespace JSX {interface IntrinsicElements extends NativeElements {}}
}

export {}