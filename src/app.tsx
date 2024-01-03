import { Link, Router } from "@jsx/router.tsx"
import createElement from "@jsx/create-element.ts"
import { MagicPills } from "./MagicPills.tsx"
import { Frag } from "@jsx/utils.ts"
import { IconLibrary } from "./icons.tsx"

const Navigation = (
    <nav style={{ display: "flex", columnGap: "1em" }}>
        <Link href="/">home</Link>
        <Link href="/work">work</Link>
        <Link href="/work/42/">work/42</Link>
        <Link href="/about">about</Link>
        <Link href="/doesnotexist">404</Link>
        {(() => {
            console.log("render nav")
            return undefined
        })()}
    </nav>)

const magicPills = <MagicPills /> // keeps its state

type PageProps = {
    name: string
    path: string
}

const Page = ({ name, path }: PageProps) => (
    <div>
        <h1>{name}</h1>
        <div>path: <span style={{ color: "white" }}>{path}</span></div>
        <div>last created: <span style={{ color: "white" }}>{new Date().toLocaleTimeString()}</span></div>
    </div>
)

export const App = () => (
    <Frag>
        <IconLibrary />
        <Navigation />
        <Router routes={[
            { path: "/", render: () => magicPills },
            { path: "/work", render: (path: string) => <Page name="work" path={path} /> },
            { path: "/work/*", render: (path) => <Page name={`${path.split("/").slice(1).join("/")}`} path={path} /> },
            { path: "/about", render: (path) => <Page name="about" path={path} /> }
        ]} fallback={(path) => <Page name="404" path={path} />}>
        </Router>
    </Frag>
)

document.title = "JSX Launchpad"