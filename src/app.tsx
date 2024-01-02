import { Link, Router } from "@jsx/router.tsx"
import createElement from "@jsx/create-element.ts"
import { MagicPills } from "./MagicPills.tsx"
import { Frag } from "@jsx/utils.ts"
import { IconLibrary } from "./icons.tsx"

const Navigation = (
    <nav style={{ display: "flex", columnGap: "1em" }}>
        <Link href="/">home</Link>
        <Link href="/work">work</Link>
        <Link href="/about">about</Link>
        <Link href="/doesnotexist">404</Link>
        {(() => {
            console.log("render nav")
            return undefined
        })()}
    </nav>)

const magicPills = <MagicPills /> // keeps its state

export const App = () => (
    <Frag>
        <IconLibrary />
        <Navigation />
        <Router routes={[
            { path: "/", render: () => magicPills },
            { path: "/work", render: () => <p>{`Work ${new Date().getMilliseconds()}`}</p> },
            { path: "/about", render: () => <p>about</p> }
        ]} fallback={(path) => <p>{`404 (no route for '${path}')`}</p>}>
        </Router>
    </Frag>
)

document.title = "JSX Launchpad"