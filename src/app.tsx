import { Link, Router } from "@jsx/router.tsx"
import createElement from "@jsx/create-element.ts"
import { MagicPills } from "./MagicPills.tsx"
import { Frag } from "@jsx/utils.ts"

const navigation = (
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

const Page = ({ content }: { content: Element }) => {
    return (
        <Frag>
            {navigation}
            {content}
        </Frag>
    )
}

const magicPills = <MagicPills /> // keeps its state

export const App = () => (
    <Router routes={[
        { path: "/", render: () => <Page content={magicPills} /> },
        { path: "/work", render: () => <Page content={<p>{`Work ${new Date().getMilliseconds()}`}</p>} /> },
        { path: "/about", render: () => <Page content={<p>about</p>} /> }
    ]} fallback={(path) => <Page content={<p>{`404 (no route for '${path}')`}</p>} />}>
    </Router>
)

document.title = "JSX Launchpad"