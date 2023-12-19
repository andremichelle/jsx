import { Terminable } from "../common/terminable.ts"
import { int } from "../common/lang.ts"

export namespace Placeholder {
    export class NodeValue<T = unknown> implements Terminable {
        readonly #texts = new Set<WeakRef<Text>>()

        #value: T

        constructor(value: T) {this.#value = value}

        subscribe(text: Text): void {this.#texts.add(new WeakRef<Text>(text))}

        get value(): T {return this.#value}
        set value(value: T) {
            if (this.#value === value) {return}
            this.#value = value
            for (const weakRef of this.#texts) {
                const text = weakRef.deref()
                if (text === undefined) {
                    this.#texts.delete(weakRef)
                } else {
                    text.nodeValue = String(value)
                }
            }
        }

        clean(): void {
            for (const weakRef of this.#texts) {
                if (weakRef.deref() === undefined) {
                    this.#texts.delete(weakRef)
                }
            }
        }

        countObservers(): int {
            return Array.from(this.#texts)
                .reduce((count: int, weakRef) => weakRef.deref() === undefined ? count : count + 1, 0)
        }

        terminate(): void {this.#texts.clear()}
    }
}