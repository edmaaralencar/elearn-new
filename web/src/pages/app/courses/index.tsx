import { useCourses } from '@/api/hooks/use-courses'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loading } from '@/components/ui/loading'
import { techonologies } from '@/utils/technologies'
import { Link, useSearchParams } from 'react-router-dom'

export function AppCourses() {
  const [searchParams, setSearchParams] = useSearchParams()

  const type = (searchParams.get('type') ?? 'all') as
    | 'mini-course'
    | 'all'
    | 'formation'
  const technology = searchParams.get('technology') ?? 'all'

  const { data } = useCourses({
    type,
    technology
  })

  function handleAddTypeFilter(value: string) {
    if (type === value) {
      setSearchParams(params => {
        params.delete('type')
        return params
      })
    } else {
      setSearchParams(params => {
        params.set('type', value)
        return params
      })
    }
  }

  function handleAddTechFilter(value: string) {
    if (technology === value) {
      setSearchParams(params => {
        params.delete('technology')
        return params
      })
    } else {
      setSearchParams(params => {
        params.set('technology', value)
        return params
      })
    }
  }

  const typeFilters = [
    {
      value: 'mini-course',
      label: 'Curso'
    },
    {
      value: 'formation',
      label: 'Formação'
    }
  ]

  const technlogyFilters = [
    {
      value: 'react-native',
      label: 'React Native'
    },
    {
      value: 'react',
      label: 'React'
    },
    {
      value: 'node.js',
      label: 'Node.js'
    }
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <span className="text-sm text-muted-foreground">
          Visualize todos os cursos e formações disponíveis na plataforma.
        </span>
      </div>

      <div className="grid grid-cols-[3fr_1fr] items-start gap-6">
        <div className="grid grid-cols-2 items-stretch gap-6">
          {!data ? (
            <Loading />
          ) : (
            <>
              {data.courses.map(item => (
                <div
                  className="flex flex-col rounded-md overflow-hidden h-full"
                  key={item.id}
                >
                  <img
                    src="data:image/jpeg;base64,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"
                    alt=""
                    className="h-44 w-full"
                  />
                  <div className="flex flex-col gap-4 border border-border p-3 flex-1 justify-between">
                    <div className="flex flex-col gap-1">
                      <strong className="text-lg font-bold">
                        {item.title}
                      </strong>
                      <span className="text-muted-foreground text-sm">
                        {item.description}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="block py-1 px-2 rounded-full bg-primary/30 text-xs w-fit">
                        {techonologies[item.technology]}
                      </span>

                      <Button asChild>
                        <Link to={`/app/courses/${item.id}`}>Acessar</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-center">
            Filtre os cursos
          </h2>

          <div className="flex flex-col gap-3">
            <strong className="text-lg">Tipo</strong>

            <div className="flex flex-col gap-2">
              {typeFilters.map(item => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={() => handleAddTypeFilter(item.value)}
                    checked={type === item.value}
                    id={item.value}
                  />
                  <label
                    htmlFor={item.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <strong className="text-lg">Tecnologia</strong>

            <div className="flex flex-col gap-2">
              {technlogyFilters.map(item => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={() => handleAddTechFilter(item.value)}
                    checked={technology === item.value}
                    id={item.value}
                  />
                  <label
                    htmlFor={item.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
