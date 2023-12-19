import { Subscription } from "./terminable.ts"
import { int } from "./lang.ts"

export type Observer<T> = (value: T) => void

export class WeakNotifier<T> {
    readonly #observers = new Set<WeakRef<Observer<T>>>()

    subscribe(observer: Observer<T>): Subscription {
        this.#observers.add(new WeakRef(observer))
        return {
            terminate: () => {
                for (const weakRef of this.#observers) {
                    const active = weakRef.deref()
                    if (active === undefined || active === observer) {
                        this.#observers.delete(weakRef)
                    }
                }
            }
        }
    }

    notify(value: T): void {
        for (const weakRef of this.#observers) {
            const observer = weakRef.deref()
            if (observer === undefined) {
                this.#observers.delete(weakRef)
            } else {
                observer(value)
            }
        }
    }

    clean(): void {
        for (const weakRef of this.#observers) {
            if (weakRef.deref() === undefined) {
                this.#observers.delete(weakRef)
            }
        }
    }

    clear(): void {this.#observers.clear()}

    count(): int {
        return Array.from(this.#observers)
            .reduce((count: int, weakRef) => weakRef.deref() === undefined ? count : count + 1, 0)
    }
}