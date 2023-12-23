import { Option } from "@common/option.ts"
import { Track } from "./api.ts"
import { Notifier } from "@common/observers.ts"
import { isDefined, Procedure, unitValue } from "@common/lang.ts"
import { Subscription } from "@common/terminable.ts"

export type PlaybackEvent = {
    state: "activate"
    track: Option<Track>
} | {
    state: "buffering"
} | {
    state: "playing"
} | {
    state: "progress"
    progress: unitValue
    elapsedInSeconds: number
    durationInSeconds: number
} | {
    state: "paused"
} | {
    state: "error"
    reason: string
}

export class Playback {
    readonly #audio: HTMLAudioElement
    readonly #notifier: Notifier<PlaybackEvent>

    #active: Option<Track> = Option.None

    constructor() {
        this.#audio = new Audio()
        this.#audio.crossOrigin = "true"
        this.#notifier = new Notifier<PlaybackEvent>()
    }

    toggle(track: Track): void {
        if (this.#active.contains(track)) {
            if (this.#audio.paused) {
                this.#notify({ state: "playing" })
                this.#audio.play().catch(() => {})
            } else {
                this.#audio.pause()
            }
            return
        }
        this.eject()
        this.active = Option.wrap(track)
        this.#notify({ state: "buffering" })
        this.#playAudio(track)
    }

    playTrackFrom(track: Track, position: unitValue): void {
        if (this.#active.contains(track)) {
            this.#notify({ state: "buffering" })
            this.#audio.currentTime = (track.duration / 1000) * position
            if (this.#audio.paused) {
                this.#audio.play().catch()
            }
            return
        }
        this.eject()
        this.active = Option.wrap(track)
        this.#notify({ state: "buffering" })
        this.#playAudio(track)
        this.#audio.currentTime = (track.duration / 1000) * position
    }

    eject(): void {
        this.active = Option.None
        this.#audio.onended = null
        this.#audio.onplay = null
        this.#audio.onpause = null
        this.#audio.onerror = null
        this.#audio.onstalled = null
        this.#audio.ontimeupdate = null
    }

    subscribe(observer: Procedure<PlaybackEvent>): Subscription {return this.#notifier.subscribe(observer)}

    get active(): Option<Track> {return this.#active}
    set active(track: Option<Track>) {
        this.#active = track
        this.#notify({ state: "activate", track })
    }

    #playAudio(track: Track): void {
        this.#audio.onended = () => this.active.ifSome(track => {if (isDefined(track.next)) {this.toggle(track.next)}})
        this.#audio.oncanplay = () => this.#notify({ state: "playing" })
        this.#audio.onpause = () => this.#notify({ state: "paused" })
        this.#audio.onerror = (event, _source, _lineno, _colno, error) => this.#notify({
            state: "error",
            reason: error?.message ?? event instanceof Event ? "Unknown" : event
        })
        this.#audio.onstalled = () => this.#notify({ state: "buffering" })
        this.#audio.ontimeupdate = () => {
            const durationInSeconds = track.duration / 1000
            const elapsedInSeconds = this.#audio.currentTime
            this.#notify({
                state: "progress",
                progress: elapsedInSeconds / durationInSeconds,
                elapsedInSeconds,
                durationInSeconds
            })
        }
        this.#notify({ state: "buffering" })
        this.#audio.src = `https://api.audiotool.com/track/${track.key}/play.mp3`
        this.#audio.play().catch(() => {})
    }

    #notify(event: PlaybackEvent) {this.#notifier.notify(event)}
}