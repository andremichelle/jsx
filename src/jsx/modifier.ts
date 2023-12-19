import { Terminable } from "../common/terminable.ts"
import { WeakRefSet } from "../common/references.ts"

export namespace Modifier {
    export class TextValue<T = unknown> implements Terminable {
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

    export class Attribute implements Terminable {
        readonly #targets: WeakRefSet<Element>
        readonly #keys: WeakMap<Element, string>

        #value: string

        readonly #updateElement: (element: Element) => void = (element: Element) => {
            const key = this.#keys.get(element)
            if (key !== undefined) {
                element.setAttribute(key, this.#value)
            }
        }

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
    }

    export class ClassList implements Terminable {
        readonly #targets: WeakRefSet<Element>
        readonly #classes: Set<string>

        readonly #updateElement: (element: Element) => void =
            (element: Element) => element.className = Array.from(this.#classes).join(" ")

        constructor(...classes: Array<string>) {
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
    }
}