import { Modifier } from "@jsx/modifier.ts"
import { Ref } from "@jsx/create-element.ts"

const RemoveButton = ({ target, label }: { target: Ref<DomElement>, label: string }) => (
    <button onclick={() => target.get().remove()}>{label}</button>
)

export const CounterApp = () => {
    const counterValue = new Modifier.TextValue(0)
    const classList = new Modifier.ClassList("red")
    const useHRefAttr = new Modifier.Attribute("#checkbox-false")
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
            <div>
                <svg width={32} height={32}>
                    <use href={useHRefAttr}></use>
                </svg>
            </div>
            <button onclick={() => useHRefAttr.toggle("#checkbox-false", "#checkbox-true")}>Toggle Checkbox Icon
            </button>
        </div>
    )
}