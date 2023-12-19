import { Terminable } from "../common/terminable.ts"
import { int } from "../common/lang.ts"
import { WeakRefs } from "../common/references.ts"

export namespace Placeholder {
    export class TextContent<T = unknown> implements Terminable {
        readonly #element = new WeakRefs<Text>()

        #value: T

        constructor(value: T) {this.#value = value}

        addElement(text: Text): void {this.#element.subscribe(text)}

        get value(): T {return this.#value}
        set value(value: T) {
            if (this.#value === value) {return}
            this.#value = value
            this.#element.forEach(text => text.nodeValue = String(value))
        }

        countObservers(): int {return this.#element.count()}

        terminate(): void {this.#element.clear()}
    }

    export class ClassList implements Terminable {
        readonly #elements: WeakRefs<Element>
        readonly #classes: Set<string>

        readonly #updateElement: (element: Element) => string =
            (element: Element) => element.className = Array.from(this.#classes).join(" ")

        constructor(...classes: Array<string>) {
            this.#elements = new WeakRefs<Element>()
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

        addElement(element: Element): void {
            this.#elements.subscribe(element)
            this.#updateElement(element)
        }

        countObservers(): int {return this.#elements.count()}

        terminate(): void {this.#elements.clear()}

        #updateElements(): void {this.#elements.forEach(this.#updateElement)}
    }
}