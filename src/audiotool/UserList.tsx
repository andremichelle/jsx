import { Inject } from "@jsx/inject.ts"
import { Procedure } from "@common/lang.ts"
import { User } from "./api.ts"
import { Html } from "@ui/html.ts"
import css from "./UserList.sass?inline"

const className = Html.adoptStyleSheet(css, "user-list")

export type UserListProps = {
    ref?: Inject.Ref<Procedure<ReadonlyArray<User>>>
    users: ReadonlyArray<User>
}

export const UserList = ({ users, ref }: UserListProps) => {
    const render = (users: ReadonlyArray<User>) => users.map(user => <a href={`#tracks/${user.key}`}>{user.name}</a>)
    const inject = Inject.ref<HTMLDivElement>()
    ref?.addTarget(users => inject.get().append(...render(users)))
    return <div className={className} ref={inject}>{render(users)}</div>
}