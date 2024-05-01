import { UserMenu } from './user-menu'

export function Header() {
  return (
    <header className="border-b border-muted h-20 px-8 flex justify-between items-center">
      <h1 className="text-3xl">Logo</h1>

      <div className="flex gap-4">
        <UserMenu />
      </div>
    </header>
  )
}
