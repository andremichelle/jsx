import { Router } from "@jsx/common/Router.tsx"
import { Link } from "@jsx/common/Link.tsx"
import { MagicPills } from "./MagicPills.tsx"
import { Frag } from "@jsx/common/Frag.tsx"
import { IconLibrary } from "./icons.tsx"

const Navigation = () => (
    <nav style={{ display: "flex", columnGap: "1em" }}>
        <Link href="/">home</Link>
        <Link href="/work">work</Link>
        <Link href="/work/42/">work/42</Link>
        <Link href="/about">about</Link>
        <Link href="/doesnotexist">404</Link>
        {(() => {
            console.log("render nav")
            const remove: Element = <Link href="/oink">This gets removed</Link>
            setTimeout(() => remove.remove(), 1000)
            return remove
        })()}
    </nav>)

// keeps its state
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

export const App = () => {
    const magicPills = <MagicPills />
    return (
        <Frag>
            <IconLibrary />
            <Navigation />
            <Router routes={[
                {
                    path: "/",
                    render: () => magicPills
                },
                {
                    path: "/work",
                    render: (path: string) => <Page name="work" path={path} />
                },
                {
                    path: "/work/*",
                    render: (path) => <Page name={`${path.split("/").slice(1).join("/")}`} path={path} />
                },
                {
                    path: "/about",
                    render: (path) => <Page name="about" path={path} />
                }
            ]} fallback={(path) => <Page name="404" path={path} />}>
            </Router>
        </Frag>
    )
}

document.title = "JSX Launchpad"