import "./main.sass"
import { App } from "./app.tsx"
import { appendChildren } from "@jsx/create-element.ts"

(async () => {
    appendChildren(document.body, App())
})()