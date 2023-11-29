import { defineConfig } from "vite"
import { resolve } from "path"
import inject from "@rollup/plugin-inject"

// noinspection JSUnusedGlobalSymbols
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
})