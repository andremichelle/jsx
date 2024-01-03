import "./main.sass"
import { App } from "./app.tsx"
import { applyChildren } from "@jsx/create-element.ts"
import { Html } from "@ui/html.ts"

(async () => {
    applyChildren(document.body, App())
    setTimeout(() => Html.empty(document.body), 1000)
})()