# JSX Launchpad (In Development)

This is intended to be an MVP for User Interfaces built using JSX. JSX's popularity largely stems from React. However,
in my view, React imposes too many restrictions on the code flow and demands an in-depth understanding of its inner
workings and timings.

JSX Launchpad offers essentially the same ability to integrate HTML and TypeScript. Yet, it avoids overly complex 'black
box' magic and gives you control over when rendering occurs.

## No More Blown-Up UI-Frameworks

* You want to use DOM manipulation, fine!
* You like to write Vanilla Typescript, fine!
* You want to hold references and introduce branches anywhere, fine!
* You want your code to be executed once and test it for yourself, fine!
* You want to control the rendering pipeline, fine!
* You want to use some black-box magic pills, fine!

### Audiotool Music Browser

I am currently developing a music browser for Audiotool to identify and address common everyday issues.
Audiotool offers a public API that can be used without the need for an API key.

[Audiotool Music Browser](https://andremichelle.io/compact/#tracks/kepz)

![screenshot.png](https://github.com/andremichelle/compact/blob/main/screenshot.png?raw=true)

## Magic Pills

There are four "magic pills" (Inject) in **JSX Launchpad** that simplify the development process (if you want to).
These are **not** confined to the scope of a component. You maintain full control over the DOM
and its state at all times. These magic pills can be injected anywhere in your code, eliminating the need for '
useEffect'
or 'useState'.

### Inject.Ref

Allows getting a reference to a single dom element from any built tsx.

### Inject.TextValue

Allows to easily update text content in a single or multiple dom elements. This is basically the same as the
overhyped [signals](https://github.com/preactjs/signals) library.

### Inject.ClassList

Allows to easily update classes in a single or multiple dom elements.

### Inject.Attributes

Allows to easily update an attribute in a single or multiple dom elements.

## Utils

### Hotspot

A hotspot is a utility component which content can be updated manually.

### Await

A Loader accepts a promise and updates to either a loading state or success or failure state.

### Router

A simple Router that allows showing different content for different URLs in a SPA.

```tsx
import { Router } from "@jsx/common/Router.tsx"
import { LocalLink } from "@jsx/common/LocalLink.tsx"
import { MagicPills } from "./MagicPills.tsx"
import { Frag } from "@jsx/common/Frag.tsx"
import { IconLibrary } from "./IconLibrary.tsx"

const Navigation = () => (
    <nav style={{ display: "flex", columnGap: "1em" }}>
        <LocalLink href="/">home</LocalLink>
        <LocalLink href="/work">work</LocalLink>
        <LocalLink href="/work/42/">work/42</LocalLink>
        <LocalLink href="/about">about</LocalLink>
        <LocalLink href="/doesnotexist">404</LocalLink>
    </nav>)

const Page = ({ name, path }: {
    name: string
    path: string
}) => (
    <div>
        <h1>{name}</h1>
        <div>path: <span style={{ color: "white" }}>{path}</span></div>
        <div>last created: <span style={{ color: "white" }}>{new Date().toLocaleTimeString()}</span></div>
    </div>
)

export const App = () => {
    const magicPills = <MagicPills />
    return (
        <Frag>
            <IconLibrary />
            <Navigation />
            <Router routes={[
                { path: "/", render: () => magicPills },
                { path: "/work", render: (path: string) => <Page name="work" path={path} /> },
                { path: "/work/*", render: (path) => <Page name={`${path.split("/").join("/")}`} path={path} /> },
                { path: "/about", render: (path) => <Page name="about" path={path} /> }
            ]} fallback={(path) => <Page name="404" path={path} />}>
            </Router>
        </Frag>
    )
}
```

### Magic Pills Example:

```tsx
import { Inject } from "@jsx/inject.ts"
import { Html } from "@ui/html.ts"
import { int } from "@common/lang.ts"
import { Wait } from "@common/wait.ts"
import { TimeSpan } from "@common/time-span.ts"
import css from "./MagicPills.sass?inline"
import { Hotspot, HotspotUpdater } from "@jsx/common/Hotspot.tsx"
import { Frag } from "@jsx/common/Frag.tsx"
import { Await } from "@jsx/common/Await.tsx"
import { Promises } from "@common/promises.ts"

export const MagicPills = () => {
    const componentRef = Inject.ref<HTMLElement>()
    const counterValue = Inject.text(0)
    const classList = Inject.classes("")
    const useHRefAttr = Inject.attribute("#checkbox-false")
    const hotSpot = Inject.ref<HotspotUpdater>()
    return (
        <main className={Html.adoptStyleSheet(css, "example-app")}
              ref={componentRef}>
            <h3>Example:</h3>
            <div style={{ display: "flex", columnGap: "0.5em", alignItems: "center" }}>
                <button onclick={() => {classList.toggle("red")}}>Toggle class red</button>
                <button onclick={() => {counterValue.value++}}>Increase Counter</button>
                <label className={classList}>You clicked me {counterValue} times.</label>
            </div>
            <button
                style={{ display: "flex", alignItems: "center", justifyContent: "center", columnGap: "0.5em" }}
                onclick={() => useHRefAttr.toggle("#checkbox-false", "#checkbox-true")}>
                <svg width={20} height={20}>
                    <use href={useHRefAttr}></use>
                </svg>
                <label>Toggle svg use href attribute</label>
            </button>
            <div>
                <h4>Mapping to list items:</h4>
                <ul>
                    {
                        // You can also inline child factories
                        [2, 3, 5, 7, 11, 13].map(prime => <li>{prime} is prime</li>)
                    }
                    <li>Even I know you clicked {counterValue}</li>
                    {/* The following values will not be rendered */}
                    {false}
                    {null}
                    {undefined}
                </ul>
            </div>
            <div>
                <Hotspot ref={hotSpot}
                         render={() => (
                             <Frag>
                                 <p>{`Hotspot (Last Update: ${new Date().toLocaleString()})`}</p>
                                 <p>and another child</p>
                             </Frag>
                         )} />
                <button onclick={() => hotSpot.get().update()}>Update HotSpot</button>
            </div>
            <div>
                <h4>Lovely Numbers</h4>
                <Await<Array<int>>
                    factory={Promises.fail(
                        TimeSpan.seconds(2), () => Wait.timeSpan<Array<int>>(TimeSpan.seconds(1), [7, 13, 42, 303]))}
                    loading={() => <p>loading...</p>}
                    success={(result: Array<int>) => <ul>{result.map(number => <li>{number}</li>)}</ul>}
                    failure={({ reason, retry }) => (
                        <Frag>
                            <p>failure due to {reason}</p>
                            <button onclick={retry}>Retry</button>
                        </Frag>
                    )}
                />
            </div>
        </main>
    )
}
```
