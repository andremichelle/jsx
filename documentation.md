# JSX Launchpad

These are the actions necessary to build this from scratch.

#### run in terminal

* `npx create-vite . --template vanilla-ts`
* `npm install @rollup/plugin-inject --save-dev`
* `npm install @types/node --save-dev`
* Add to `ts-config.compilerOptions`
    * `"jsx": "preserve"`
    * `"jsxFactory": "createElement"`
    * `"baseUrl": "."`
    * `"paths": {"@tsx/*": ["src/tsx/*"]}`
* Create and paste from below `vite.config.ts`
* Start the server `vite`

#### vite.config.ts

```import { defineConfig } from "vite"
import { resolve } from "path"
import inject from "@rollup/plugin-inject"

export default defineConfig({
    base: "./",
    plugins: [inject({ createElement: "@jsx/create-element.ts" })],
    resolve: {
        alias: {
            "@jsx": resolve(__dirname, "./src/jsx")
        }
    },
    esbuild: {
        target: "es2020",
        supported: { bigint: true }
    },
    server: { port: 8081 }
})```