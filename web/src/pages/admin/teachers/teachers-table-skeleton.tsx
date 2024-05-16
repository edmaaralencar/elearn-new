import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function TeachersTableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => {
        return (
          <TableRow key={i}>
            <TableCell className="font-mono text-xs font-medium">
              <Skeleton className="h-4 w-[172px]" />
            </TableCell>

            <TableCell className="text-muted-foreground">
              <Skeleton className="h-4 w-[148px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="h-4 w-[110px]" />
            </TableCell>

            <TableCell className="font-medium">
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>

            <TableCell>
              <div className="flex justify-end gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
