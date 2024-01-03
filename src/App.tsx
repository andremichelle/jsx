import { Router } from "@jsx/common/Router.tsx"
import { LocalLink } from "@jsx/common/LocalLink.tsx"
import { MagicPills } from "./MagicPills.tsx"
import { Frag } from "@jsx/common/Frag.tsx"
import { IconLibrary } from "./IconLibrary.tsx"

const Navigation = () => (
    <nav style={{ display: "flex", columnGap: "1em" }}>
        <LocalLink href="/">home</LocalLink>
        <LocalLink href="/work">work</LocalLink>
        <LocalLink href="/work/42/">work/42</LocalLink>
        <LocalLink href="/about">about</LocalLink>
        <LocalLink href="/doesnotexist">404</LocalLink>
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