import { Placeholder } from "@jsx/placeholder.ts"
import { Ref } from "@jsx/create-element.ts"

const RemoveButton = ({ target, label }: { target: Ref<DomElement>, label: string }) => (
    <button onclick={() => target.get().remove()}>{label}</button>
)

export const CounterApp = () => {
    const counterValue = new Placeholder.TextContent(0)
    const classList = new Placeholder.ClassList()
    const componentRef = Ref.create()

    return (
        <div ref={componentRef}
             style={{ display: "flex", flexDirection: "column", width: "fit-content", rowGap: "1em" }}>
            <div style={{ display: "flex", columnGap: "0.5em" }}>
                <button onclick={() => {classList.toggle("red")}}>Toggle class red</button>
                <button onclick={() => {counterValue.value++}}>Increase Counter</button>
                <label class={classList}>You clicked me {counterValue} times.</label>
            </div>
            <RemoveButton target={componentRef} label="Remove App" />
        </div>
    )
}