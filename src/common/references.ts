import { int, Procedure } from "./lang.ts"

export class WeakRefs<T extends WeakKey> {
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