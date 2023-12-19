import { Placeholder } from "@jsx/placeholder.ts"

export const CounterApp = () => {
    const counter = new Placeholder.NodeValue(0)
    console.log("This will never be executed again, unless YOU call it.")
    return (
        <div style={{ display: "flex", columnGap: "0.5em" }}>
            <button onclick={() => counter.value++}>Click</button>
            <label>You clicked me {counter} times.</label>
        </div>
    )
}