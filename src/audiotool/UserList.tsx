import { Inject } from "@jsx/inject.ts"
import { Procedure } from "@common/lang.ts"
import { User } from "./api.ts"
import { Html } from "@ui/html.ts"
import css from "./UserList.sass?inline"

const className = Html.adoptStyleSheet(css, "user-list")

export type UserListProps = {
    populate?: Inject.Ref<Procedure<ReadonlyArray<User>>>
    users: ReadonlyArray<User>
}

export const UserList = ({ users, populate }: UserListProps) => {
    const render = (users: ReadonlyArray<User>) => users.map(user => <a href={`#tracks/${user.key}`}>{user.name}</a>)
    const ref = Inject.ref<HTMLDivElement>()
    populate?.addTarget(users => {
        const element = ref.get()
        Html.empty(element)
        element.append(...render(users))
    })
    return <div className={className} ref={ref}>{render(users)}</div>
}