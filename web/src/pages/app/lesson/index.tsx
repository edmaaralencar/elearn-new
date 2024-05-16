import { ModulesSidebar } from './modules-sidebar'
import { Content } from './content'

export function AppLesson() {
  return (
    <div className="-m-8 flex">
      <Content />
      <ModulesSidebar />
    </div>
  )
}
