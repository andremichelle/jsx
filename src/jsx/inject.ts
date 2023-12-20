import { Terminable } from "@common/terminable.ts"
import { WeakRefSet } from "@common/weak.ts"
import { Option } from "@common/option.ts"
import { Stringifiable } from "@common/lang.ts"

export namespace Inject {
    export const ref = <T = Element>() => new Ref<T>()
    export const text = <T extends Stringifiable>(initialValue: T) => new TextValue<T>(initialValue)
    export const classes = (...initialClassNames: Array<string>) => new ClassList(initialClassNames)
    export const attribute = (initialAttributeValue: string) => new Attribute(initialAttributeValue)

    interface Injector<T> extends Terminable {
        addTarget(target: T, ...args: Array<unknown>): void
    }

    export class Ref<T = Element> implements Injector<T> {
        #target: Option<T> = Option.None

        get(): T {return this.#target.unwrap("No target provided")}

        addTarget(target: T): void {this.#target = Option.wrap(target)}

        terminate(): void {this.#target = Option.None}
    }

    export class TextValue<T extends Stringifiable = Stringifiable> implements Injector<Text> {
        readonly #targets = new WeakRefSet<Text>()

        #value: T

        constructor(value: T) {this.#value = value}

        get value(): T {return this.#value}
        set value(value: T) {
            if (this.#value === value) {return}
            this.#value = value
            this.#targets.forEach(text => text.nodeValue = String(value))
        }

        addTarget(text: Text): void {this.#targets.add(text)}

        terminate(): void {this.#targets.clear()}
    }

    export class ClassList implements Injector<Element> {
        readonly #targets: WeakRefSet<Element>
        readonly #classes: Set<string>

        constructor(classes: Array<string>) {
            this.#targets = new WeakRefSet<Element>()
            this.#classes = new Set<string>(classes)
        }

        add(className: string): void {
            this.#classes.add(className)
            this.#updateElements()
        }

        remove(className: string): void {
            this.#classes.delete(className)
            this.#updateElements()
        }

        toggle(className: string, force: boolean = false): void {
            if (this.#classes.has(className) && !force) {
                this.#classes.delete(className)
            } else {
                this.#classes.add(className)
            }
            this.#updateElements()
        }

        addTarget(target: Element): void {
            this.#targets.add(target)
            this.#updateElement(target)
        }

        terminate(): void {this.#targets.clear()}

        #updateElements(): void {this.#targets.forEach(this.#updateElement)}

        readonly #updateElement: (element: Element) => void =
            (element: Element) => element.className = Array.from(this.#classes).join(" ")
    }

    export class Attribute implements Injector<Element> {
        readonly #targets: WeakRefSet<Element>
        readonly #keys: WeakMap<Element, string>

        #value: string

        constructor(value: string) {
            this.#targets = new WeakRefSet<Element>()
            this.#keys = new WeakMap<Element, string>()
            this.#value = value
        }

        get value(): string {return this.#value}
        set value(value: string) {
            if (this.#value === value) {return}
            this.#value = value
            this.#updateElements()
        }

        toggle(expected: string, alternative: string): void {
            this.value = this.value === expected ? alternative : expected
        }

        addTarget(target: Element, key: string): void {
            this.#targets.add(target)
            this.#keys.set(target, key)
            this.#updateElement(target)
        }

        terminate(): void {this.#targets.clear()}

        #updateElements(): void {this.#targets.forEach(this.#updateElement)}

        readonly #updateElement: (element: Element) => void = (element: Element) => {
            const key = this.#keys.get(element)
            if (key !== undefined) {
                element.setAttribute(key, this.#value)
            }
        }
    }
}