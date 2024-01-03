import { Lazy } from "@common/decorators.ts"
import { Notifier, Observer } from "@common/observers.ts"
import { Subscription } from "@common/terminable.ts"

export class BrowserLocation {
    @Lazy
    static get(): BrowserLocation {return new BrowserLocation()}

    readonly #notifier: Notifier<BrowserLocation> = new Notifier<BrowserLocation>()

    private constructor() {window.addEventListener("popstate", () => this.#notifier.notify(this))}

    navigateTo(path: string): void {
        if (this.path === path) {return}
        history.pushState(null, "", path)
        this.#notifier.notify(this)
    }

    catchupAndSubscribe(observer: Observer<BrowserLocation>): Subscription {
        observer(this)
        return this.#notifier.subscribe(observer)
    }

    get path(): string {return location.pathname}
}