import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function TeachersCourses() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <Link to="/teachers/courses/create">
          <Button>Criar</Button>
        </Link>
      </header>
    </div>
  )
}
