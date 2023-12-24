import { Exec, isDefined } from "@common/lang.ts"
import css from "./ListHeader.sass?inline"
import { Html } from "@ui/html.ts"

const className = Html.adoptStyleSheet(css, "list-header")

export type ListHeaderProps = {
    name: string
    button?: {
        label: string
        onClick: Exec
    }
}

export const ListHeader = ({ name, button }: ListHeaderProps) => (
    <header className={className}>
        <h1>{name}</h1>
        {
            isDefined(button)
                ? <button onclick={button.onClick}>
                    {button.label}
                </button>
                : false
        }
    </header>
)