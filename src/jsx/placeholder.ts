import { Subscription, Terminable } from "../common/terminable.ts"
import { Observer } from "../common/observable.ts"

export namespace Placeholder {
    export class NodeValue<T = unknown> implements Terminable {
        readonly #observers: Array<Observer<T>> = []

        #value: T

        constructor(value: T) {this.#value = value}

        subscribe(observer: Observer<T>): Subscription {
            this.#observers.push(observer)
            return {
                terminate: () => {
                    const index = this.#observers.indexOf(observer)
                    if (index !== -1) {this.#observers.splice(index, 1)}
                }
            }
        }

        get value(): T {return this.#value}
        set value(value: T) {
            if (this.#value === value) {return}
            this.#value = value
            for (const observer of this.#observers) {
                observer(value)
            }
        }

        terminate(): void {this.#observers.splice(0, this.#observers.length)}
    }
}