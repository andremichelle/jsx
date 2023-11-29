import { Ref } from "@jsx/create-element"
import { BarElement } from "./bar-element"

export const test = () => {
    const refBar = Ref.create<BarElement>()
    const refSpan = Ref.create<HTMLSpanElement>()
    const element =
        <c-foo index={42} name="abc">
            <c-bar ref={refBar} class="someclass" nested={{ deep: { value: 303 } }}>
                <span style={{ color: "red" }} ref={refSpan}>Hello, world!</span>
            </c-bar>
        </c-foo>
    refSpan.get().addEventListener("click", () => console.log("click"))
    return { element, refBar, refSpan }
}