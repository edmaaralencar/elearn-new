import { useQuery } from '@tanstack/react-query'
import { Pen, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TeachersTableSkeleton } from './teachers-table-skeleton'
import { getTeachers } from '@/api/get-teachers'
import { InviteTeacherModal } from '@/components/invite-teacher-modal'

export function AdminTeachers() {
  const { data, isLoading } = useQuery({
    queryFn: getTeachers,
    queryKey: ['teachers']
  })

  return (
    <div className="flex flex-col gap-8 w-full">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">Professores</h1>
        <InviteTeacherModal />
      </header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data && isLoading && <TeachersTableSkeleton />}

          {data &&
            !isLoading &&
            data.map(course => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.email}</TableCell>
                <TableCell>{course.created_at}</TableCell>
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
