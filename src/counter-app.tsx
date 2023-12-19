import { Placeholder } from "@jsx/placeholder.ts"
import { Ref } from "@jsx/create-element.ts"

export const CounterApp = () => {
    const counterValue = new Placeholder.NodeValue(0)
    const componentRef = Ref.create<HTMLDivElement>()
    console.log("This will never be executed again, unless YOU call it.")

    return (
        <div ref={componentRef}
             style={{ display: "flex", flexDirection: "column", width: "fit-content", rowGap: "1em" }}>
            <div style={{ display: "flex", columnGap: "0.5em" }}>
                <button onclick={() => counterValue.value++}>Increase Counter</button>
                <label>You clicked me {counterValue} times.</label>
            </div>
            <button onclick={() => componentRef.get().remove()}>Remove Component</button>
        </div>
    )
}