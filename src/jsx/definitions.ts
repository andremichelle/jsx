// noinspection JSUnusedGlobalSymbols

import { Inject } from "@jsx/inject.ts"

export type DomElement = HTMLElement | SVGElement

// These are all utility type to let jsx understand usual html and svg elements.
//
type ExtractProperties<T extends Element> = Partial<{
    [K in keyof T]: T[K] extends Function ? never : Partial<T[K]>
}> & { ref?: Inject.Ref<T> } & { className: string } & Record<string, unknown>

type NativeElements =
    & { [K in keyof Omit<SVGElementTagNameMap, "a">]: Omit<ExtractProperties<SVGElementTagNameMap[K]>, "a"> }
    & { [K in keyof Omit<HTMLElementTagNameMap, "a">]: Omit<ExtractProperties<HTMLElementTagNameMap[K]>, "a"> }

    // There is something fuzzy about the anchor tag
    // ExtractAttributes fails on href, because there is a strange relation to the declared toString method?
    // And it is in html and svg namespace.
    & {
    "a": {
        href?: string | object,
        target?: string
        className?: string,
    }
}

declare global {
    namespace JSX {interface IntrinsicElements extends NativeElements {}}
}

export {}