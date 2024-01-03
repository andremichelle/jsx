// noinspection JSUnusedGlobalSymbols

import { Func } from "@common/lang.ts"

export interface Terminable {terminate(): void}

export interface TerminableOwner {
    own<T extends Terminable>(terminable: T): T
    ownAll<T extends Terminable>(...terminables: Array<T>): void
}

// alias
export type Subscription = Terminable

export const Terminable = {
    Empty: { terminate(): void {} },
    many(...terminables: Terminable[]): Terminable {
        return { terminate(): void {while (terminables.length > 0) {terminables.pop()!.terminate()}} }
    }
} as const

export class Terminator implements TerminableOwner, Terminable {
    static readonly #weakRefs = new Array<[WeakRef<WeakKey>, Terminable]>()

    /**
     * Terminates if the key is no longer referenced to.
     * Make sure that the Terminable does not include other references
     * that would prevent the key from being gc collected.
     *
     * That means the key must not appear in the Terminable!
     *
     * @param key WeakKey
     * @param subscribe Sends a WeakRef to be able to be gc collected
     */
    static wrapWeak<K extends WeakKey>(key: K, subscribe: Func<WeakRef<K>, Terminable>): K {
        const weakRef = new WeakRef(key)
        const terminable = subscribe(weakRef)
        this.#weakRefs.push([weakRef, terminable])
        if (this.#weakRefs.length === 1) {
            this.#startWatchWeak()
        }
        return key
    }

    static #startWatchWeak(): void {
        console.debug("start weak watching")
        const id = setInterval(() => {
            let index = this.#weakRefs.length
            while (--index >= 0) {
                const entry = this.#weakRefs[index]
                if (entry[0].deref() === undefined) {
                    entry[1].terminate()
                    this.#weakRefs.splice(index, 1)
                    if (this.#weakRefs.length === 0) {
                        console.debug("stop weak watching")
                        clearInterval(id)
                    }
                }
            }
        }, 1000)
    }

    readonly #terminables: Terminable[] = []

    own<T extends Terminable>(terminable: T): T {
        this.#terminables.push(terminable)
        return terminable
    }

    ownAll<T extends Terminable>(...terminables: Array<T>): void {
        for (const terminable of terminables) {this.#terminables.push(terminable)}
    }

    terminate(): void {while (this.#terminables.length > 0) {this.#terminables.pop()!.terminate()}}
}