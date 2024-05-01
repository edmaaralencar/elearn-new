import { getCoursesByTeacher } from '@/api/get-courses-by-teacher'
import { CreateCourseModal } from '@/components/create-course-modal'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { Pen, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CoursesTableSkeleton } from './courses-table-skeleton'

export function TeachersCourses() {
  const { data, isLoading } = useQuery({
    queryFn: getCoursesByTeacher,
    queryKey: ['courses']
  })

  return (
    <div className="flex flex-col gap-8 w-full">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <CreateCourseModal />
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Publicado</TableHead>
            <TableHead>Capítulos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data && isLoading && <CoursesTableSkeleton />}

          {data &&
            !isLoading &&
            data.courses.map(course => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>
                  {course.description
                    ? course.description?.slice(0, 30)
                    : 'Sem descrição'}
                </TableCell>
                <TableCell>{course.is_published ? 'Sim' : 'Não'}</TableCell>
                <TableCell>{course.chapters}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link to={`/teachers/courses/${course.id}`}>
                      <Button size="sm" variant="outline">
                        <Pen className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
