// noinspection JSUnusedGlobalSymbols
/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any */

import { asDefined, panic } from "@common/lang"

const findMethodType = (descriptor: PropertyDescriptor): "get" | "set" | "value" => {
    if (descriptor.value !== undefined) return "value"
    if (descriptor.get !== undefined) return "get"
    return panic(`Cannot resolve method key of ${descriptor}`)
}

export const Lazy = (_: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    const methodType = findMethodType(descriptor)
    const element = asDefined(descriptor[methodType])
    return {
        [methodType]: function(...args: []): any {
            if (args.length > 0) {
                return panic("lazy accessory must not have any construction parameters")
            }
            const value = element.apply(this)
            Object.defineProperty(this, propertyKey, {
                value: methodType === "get" ? value : () => value,
                configurable: false,
                writable: false,
                enumerable: false
            })
            return value
        }
    }
}

export const Once = (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
    const methodType = findMethodType(descriptor)
    const element = asDefined(descriptor[methodType])
    return {
        [methodType]: function(...args: []): any {
            if (args.length > 0) {
                return panic("once accessory must not have any construction parameters")
            }
            element.apply(this)
            const name = this === target ? this.name : this.constructor.name
            Object.defineProperty(this, propertyKey, {
                value: methodType === "get" ? undefined : () => {
                    console.warn(`Function ${name}:${propertyKey} should only be called once.`)
                    return undefined
                },
                configurable: false,
                writable: false,
                enumerable: false
            })
            return undefined
        }
    }
}