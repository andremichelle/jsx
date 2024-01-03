import { Terminator } from "@common/terminable.ts"
import { BrowserLocation } from "@ui/location.ts"
import { RouteMatcher } from "@ui/route-matcher.ts"

export const Link = ({ href }: { href: string }) => Terminator.wrapWeak(<a href={href} onclick={(event: Event) => {
    event.preventDefault()
    BrowserLocation.get().navigateTo(href)
}} link />, weakRef => BrowserLocation.get().catchupAndSubscribe(location =>
    weakRef.deref()?.setAttribute("link", RouteMatcher.match(location.path, href) ? "active" : "")))