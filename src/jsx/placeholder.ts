import { Subscription, Terminable } from "../common/terminable.ts"
import { Observer, WeakNotifier } from "../common/observable.ts"
import { int } from "../common/lang.ts"

export namespace Placeholder {
    export class NodeValue<T = unknown> implements Terminable {
        readonly #notifier = new WeakNotifier<T>()

        #value: T

        constructor(value: T) {this.#value = value}

        subscribe(observer: Observer<T>): Subscription {return this.#notifier.subscribe(observer)}

        get value(): T {return this.#value}
        set value(value: T) {
            if (this.#value === value) {return}
            this.#value = value
            this.#notifier.notify(value)
        }

        countObservers(): int {return this.#notifier.count()}

        terminate(): void {this.#notifier.clear()}
    }
}