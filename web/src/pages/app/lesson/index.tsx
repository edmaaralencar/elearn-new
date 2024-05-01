import { ChaptersSidebar } from './chapters-sidebar'
import { Content } from './content'

export function AppLesson() {
  return (
    <div className="-m-8 relative">
      <Content />
      <ChaptersSidebar />
    </div>
  )
}
