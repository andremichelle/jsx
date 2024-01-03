import "./main.sass"
import { App } from "./app.tsx"
import { replaceChildren } from "@jsx/create-element.ts"

(async () => replaceChildren(document.body, App()))()