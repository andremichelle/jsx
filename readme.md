# JSX Launchpad

This is intended to be an MVP for User Interfaces built using JSX. JSX's popularity largely stems from React. However,
in my view, React imposes too many restrictions on the code flow and demands an in-depth understanding of its inner
workings and timings.

JSX Launchpad offers essentially the same ability to integrate HTML and TypeScript. Yet, it avoids overly complex 'black
box' magic and gives you control over when rendering occurs.

## Better than Blown Up UI-Frameworks

* You want to use DOM manipulation, fine!
* You want to use some magic pills, fine!
* You want to hold references and introduce branches anywhere, fine!
* You want your code to be executed once and test it for yourself, fine!

## Magic Injects

There are four "magic pills" in **JSX Launchpad** that simplify the development process (if you want to). 
These are **not** confined to the scope of a component. You maintain full control over the DOM
and
its state at all times. These magic pills can be injected anywhere in your code, eliminating the need for 'useEffect'
or 'useState'.

### Inject.Ref

Allows getting a reference to a single dom element from any built tsx.

### Inject.TextValue

Allows to easily update text content in a single or multiple dom elements.

### Inject.ClassList

Allows to easily update classes in a single or multiple dom elements.

### Inject.Attributes

Allows to easily update an attribute in a single or multiple dom elements.

## Utils

### Hotspot

A hotspot is a utility component which content can be updated manually.

### Await

A Loader accepts a promise and updates to either a loading state or success or failure state.

### Audiotool Music Browser

I am currently developing a music browser for Audiotool to identify and address common everyday issues. Audiotool offers a public API that can be used without the need for an API key.

[Audiotool Music Browser](https://andremichelle.io/compact/#tracks/kepz)

### Example:

```tsx
import { Inject } from "@jsx/inject.ts"
import { DomElement } from "@jsx/definitions.ts"
import { Await, Hotspot, HotspotUpdater } from "@jsx/Await.tsx"
import { Wait } from "@common/wait.ts"
import { TimeSpan } from "@common/time-span.ts"
import { int } from "@common/lang.ts"
import { Html } from "@ui/html.ts"
import css from "./example-app.sass?inline"

// classic function component
const RemoveButton = ({ target, label }: { target: Inject.Ref<DomElement>, label: string }) => (
    <button onclick={() => target.get().remove()}>{label}</button>
)

// false, null, undefined will not be rendered
const Null = () => null

// App entry point
export const ExampleApp = () => {
    const componentRef = Inject.ref<HTMLElement>()
    const counterValue = Inject.text(0)
    const classList = Inject.classes("")
    const useHRefAttr = Inject.attribute("#checkbox-false")
    const hotSpot = Inject.ref<HotspotUpdater>()
    return (
        <main class={Html.adoptStyleSheet(css, "example-app")}
              ref={componentRef}>
            <h3>Example:</h3>
            <div style={{ display: "flex", columnGap: "0.5em" }}>
                <button onclick={() => {classList.toggle("red")}}>Toggle class red</button>
                <button onclick={() => {counterValue.value++}}>Increase Counter</button>
                <label class={classList}>You clicked me {counterValue} times.</label>
            </div>
            <button
                style={{ display: "flex", alignItems: "center", justifyContent: "center", columnGap: "0.5em" }}
                onclick={() => useHRefAttr.toggle("#checkbox-false", "#checkbox-true")}>
                <svg width={20} height={20}>
                    <use href={useHRefAttr}></use>
                </svg>
                <label>Toggle svg use href attribute</label>
            </button>
            <RemoveButton target={componentRef} label="Remove App" />
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
                    <Null />
                </ul>
            </div>
            <div>
                <Hotspot ref={hotSpot}
                         render={() => <p>{`Hotspot (Last Update: ${new Date().toLocaleString()})`}</p>} />
                <button onclick={() => hotSpot.get().update()}>Update HotSpot</button>
            </div>
            <div>
                <h4>Lovely Numbers</h4>
                <Await<Array<int>> promise={Wait.timeSpan<Array<int>>(TimeSpan.seconds(1), [7, 13, 42, 303])}
                                   loading={() => <p>loading...</p>}
                                   success={(result: Array<int>) => <ul>{result.map(number => <li>{number}</li>)}</ul>}
                                   failure={(reason) => <p>failure due to {reason}</p>}
                />
            </div>
        </main>
    )
}
```

https://github.com/andremichelle/jsx/assets/6459974/52d7b561-fa77-44e2-8386-ff54e3b78019
