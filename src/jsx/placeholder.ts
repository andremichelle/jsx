import { Terminable } from "../common/terminable.ts"
import { int, Procedure } from "../common/lang.ts"

class WeakRefs<T extends WeakKey> {
    readonly #set = new Set<WeakRef<T>>()

    subscribe(value: T): void {this.#set.add(new WeakRef<T>(value))}

    forEach(callback: Procedure<T>): void {
        for (const weakRef of this.#set) {
            const value = weakRef.deref()
            if (value === undefined) {
                this.#set.delete(weakRef)
            } else {
                callback(value)
            }
        }
    }

    count(): int {
        return Array.from(this.#set)
            .reduce((count: int, weakRef) => weakRef.deref() === undefined ? count : count + 1, 0)
    }

    clear(): void {this.#set.clear()}
}

export namespace Placeholder {
    export class TextContent<T = unknown> implements Terminable {
        readonly #texts = new WeakRefs<Text>()

        #value: T

        constructor(value: T) {this.#value = value}

        subscribe(text: Text): void {this.#texts.subscribe(text)}

        get value(): T {return this.#value}
        set value(value: T) {
            if (this.#value === value) {return}
            this.#value = value
            this.#texts.forEach(text => text.nodeValue = String(value))
        }

        countObservers(): int {return this.#texts.count()}

        terminate(): void {this.#texts.clear()}
    }
}