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
            <div>
                <h4>Mapping to list items:</h4>
                <ul>
                    {
                        // You can also inline child factories
                        [2, 3, 5, 7, 11, 13].map(prime => <li>{prime} is prime</li>)
                    }
                    <li>Even I know you clicked {counterValue}</li>
                </ul>
            </div>
            {false}
        </div>
    )
}