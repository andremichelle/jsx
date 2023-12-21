# JSX Launchpad

This is intended to be an MVP for User Interfaces built using JSX. JSX's popularity largely stems from React. However,
in my view, React imposes too many restrictions on the code flow and demands an in-depth understanding of its inner
workings and timings.

JSX Launchpad offers essentially the same ability to integrate HTML and TypeScript. Yet, it avoids overly complex 'black
box' magic and gives you control over when rendering occurs.

## Magic Injects

However, there are four "magic pills" in **JSX Launchpad** that simplify
the development process. These are **not** confined to the scope of a component. You maintain full control over the DOM
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

### Example:

https://github.com/andremichelle/jsx/assets/6459974/4559c8db-4a15-471f-8a08-81aadd1ea419

```tsx
import { Inject } from "@jsx/inject.ts"
import { DomElement } from "@jsx/definitions.ts"
import { Await, Hotspot, HotspotUpdater } from "@jsx/utils.ts"
import { Wait } from "@common/wait.ts"
import { TimeSpan } from "@common/time-span.ts"
import { int } from "@common/lang.ts"

// classic function component
const RemoveButton = ({ target, label }: { target: Inject.Ref<DomElement>, label: string }) => (
    <button onclick={() => target.get().remove()}>{label}</button>
)

export const ExampleApp = () => {
    const componentRef = Inject.ref<HTMLDivElement>()
    const counterValue = Inject.text(0)
    const classList = Inject.classes("")
    const useHRefAttr = Inject.attribute("#checkbox-false")
    const hotSpot = Inject.ref<HotspotUpdater>()
    return (
        <div ref={componentRef}
             style={{ display: "flex", flexDirection: "column", width: "fit-content", rowGap: "1em" }}>
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
                </ul>
            </div>
            <div>
                <Hotspot ref={hotSpot}
                         render={() => <p>{`Hotspot (Last Update: ${new Date().toLocaleString()})`}</p>} />
                <button onclick={() => hotSpot.get().update()}>Update HotSpot</button>
            </div>
            <div>
                <h4>Lovely Numbers</h4>
                <Await promise={Wait.timeSpan<Array<int>>(TimeSpan.seconds(1), [7, 13, 42, 303])}
                       loading={() => <p>loading...</p>}
                       success={(result: Array<int>) => <ul>{result.map(number => <li>{number}</li>)}</ul>}
                       failure={(reason) => <p>failure due to {reason}</p>}
                />
            </div>
        </div>
    )
}
```

### Future Plans

* Collecting feedback and feature requests
* Implement a simple css injection system
