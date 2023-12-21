// noinspection JSUnusedGlobalSymbols

import { TimeSpan } from "@common/time-span.ts"
import { Exec } from "@common/lang.ts"

export namespace Await {
    export const frame = (): Promise<void> => new Promise(resolve => requestAnimationFrame(() => resolve()))
    export const frames = (numFrames: number): Promise<void> => new Promise(resolve => {
        let count = numFrames
        const callback = () => {if (--count <= 0) {resolve()} else {requestAnimationFrame(callback)}}
        requestAnimationFrame(callback)
    })
    export const timeSpan = <T = undefined>(time: TimeSpan, result?: T): Promise<T | undefined> =>
        new Promise(resolve => setTimeout(() => resolve(result), time.millis()))
    export const event = (target: EventTarget, type: string): Promise<void> =>
        new Promise<void>(resolve => target.addEventListener(type, resolve as Exec, { once: true }))
}