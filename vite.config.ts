import { defineConfig } from "vite"
import { resolve } from "path"
import inject from "@rollup/plugin-inject"
import * as path from "node:path"
import * as fs from "fs"
import { isDefined } from "./src/common/lang"

export default defineConfig({
    base: "./",
    plugins: [
        inject({ createElement: "@jsx/create-element.ts" }),
        {
            name: "spa",
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const url: string | undefined = req.url
                    if (isDefined(url) && url.indexOf(".") === -1 && !url.startsWith("/@vite/")) {
                        const indexPath = path.resolve(__dirname, "index.html")
                        res.end(fs.readFileSync(indexPath))
                    } else {
                        next()
                    }
                })
            }
        }
    ],
    resolve: {
        alias: {
            "@jsx": resolve(__dirname, "./src/jsx"),
            "@common": resolve(__dirname, "./src/common"),
            "@ui": resolve(__dirname, "./src/ui")
        }
    },
    esbuild: {
        target: "esNext",
        supported: { bigint: true }
    },
    server: {
        port: 8081
    }
})