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