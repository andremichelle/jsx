import css from "./Footer.sass?inline"
import { Html } from "@ui/html.ts"

export const Footer = () => (
    <footer className={Html.adoptStyleSheet(css, "footer")}>
        <section></section>
    </footer>
)