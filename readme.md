# JSX Launchpad

This is intended to be an MVP for User Interfaces built using JSX. JSX's popularity largely stems from React. However,
in my view, React imposes too many restrictions on the code flow and demands an in-depth understanding of its inner
workings and timings.

JSX Launchpad offers essentially the same ability to integrate HTML and TypeScript. Yet, it avoids overly complex 'black
box' magic and gives you control over when rendering occurs.

### Magic Injects

However, there are four "magic pills" in **JSX Launchpad** that simplify
the development process. These are not confined to the scope of a component. You maintain full control over the DOM and
its state at all times. These magic pills can be injected anywhere in your code, eliminating the need for 'useEffect'
or 'useState'.

### Inject.Ref

Allows to get a reference to a single dom element from any built tsx.

### Inject.TextValue

Allows you to easily update text content in a single or multiple dom elements.

### Inject.ClassList

Allows you to easily update classes in a single or multiple dom elements.

### Inject.Attributes

Allows you to easily update an attribute in a single or multiple dom elements.

### Example:

```tsx
import { Inject } from "@jsx/inject.ts"
import { DomElement } from "@jsx/definitions.ts"

const RemoveButton = ({ target, label }: { target: Inject.Ref<DomElement>, label: string }) => (
    <button onclick={() => target.get().remove()}>{label}</button>
)

export const CounterApp = () => {
    const componentRef = Inject.ref<HTMLDivElement>()
    const counterValue = Inject.text(0)
    const classList = Inject.classes("")
    const useHRefAttr = Inject.attribute("#checkbox-false")
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
        </div>
    )
}
```