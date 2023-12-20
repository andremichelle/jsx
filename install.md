# JSX Launchpad

These are the actions necessary to build this from scratch. However, if you checked this repository out, you probably
are fine with: `npm install` and `vite`

### run

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

### vite.config.ts

```typescript
import { defineConfig } from "vite"
import { resolve } from "path"
import inject from "@rollup/plugin-inject"

export default defineConfig({
    base: "./",
    plugins: [inject({ createElement: "@jsx/create-element.ts" })],
    resolve: {
        alias: {
            "@jsx": resolve(__dirname, "./src/jsx"),
            "@common": resolve(__dirname, "./src/common")
        }
    },
    esbuild: {
        target: "esNext",
        supported: { bigint: true }
    },
    server: { port: 8081 }
})
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": [
      "ESNext",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "preserve",
    "jsxFactory": "createElement",
    "baseUrl": ".",
    "paths": {
      "@jsx/*": [
        "src/jsx/*"
      ],
      "@common/*": [
        "src/common/*"
      ]
    }
  },
  "include": [
    "src"
  ]
}
```