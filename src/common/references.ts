import { int, Procedure } from "./lang.ts"

export class WeakRefSet<T extends WeakKey> {
    readonly #set = new Set<WeakRef<T>>()

    add(value: T): void {this.#set.add(new WeakRef<T>(value))}

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

    countReferences(): int {
        let count = 0
        this.forEach(() => count++)
        return count
    }

    clear(): void {this.#set.clear()}
}