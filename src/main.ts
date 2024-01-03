import "./main.sass"
import { App } from "./app.tsx"
import { applyChildren } from "@jsx/create-element.ts"

(async () => applyChildren(document.body, App()))()