import { Section } from '.'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLesson } from '@/api/create-lesson'
import { queryKeys } from '@/lib/react-query'
import { useParams } from 'react-router-dom'
import { VideoFileInput } from './video-file-input'
import { toast } from 'sonner'
import { IModule } from '@/@types'

type CreateLessonSectionProps = {
  onSelectSection: (section: Section) => void
  modules: IModule[]
}

const createLessonFormSchema = z.object({
  name: z.string().min(1, { message: 'Nome da aula obrigatório.' }),
  description: z.string().min(1, { message: 'Descrição obrigatória.' }),
  video: z.object(
    {
      url: z.string(),
      duration: z.number()
    },
    {
      required_error: 'Vídeo da aula obrigatório.'
    }
  ),
  moduleId: z.string().min(1, { message: 'Módulo obrigatório.' })
})

type FormInput = z.infer<typeof createLessonFormSchema>

export function CreateLessonSection({
  onSelectSection,
  modules
}: CreateLessonSectionProps) {
  const params = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const form = useForm<FormInput>({
    resolver: zodResolver(createLessonFormSchema),
    defaultValues: {
      moduleId: '',
      description: '',
      name: '',
      video: undefined
    }
  })

  const createLessonMutation = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.course(params.id ?? '')
      })

      toast.success('Aula criada com sucesso.')

      onSelectSection('lessons')
    }
  })

  async function onSubmit(values: FormInput) {
    await createLessonMutation.mutateAsync({
      module_id: Number(values.moduleId),
      course_id: Number(params.id),
      description: values.description,
      title: values.name,
      video_url: values.video.url,
      duration: values.video.duration
    })
  }

  const formattedModules = modules.map(item => ({
    value: String(item.id),
    label: String(item.title)
  }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Nova Aula</h2>

        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => onSelectSection('lessons')}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <Form {...form}>
        <form
          className="space-y-5 flex flex-col items-end"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome da aula" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Descrição da aula" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="moduleId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Módulo</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? formattedModules.find(
                              module => module.value === field.value
                            )?.label
                          : 'Selecione um capítulo'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Procure um capítulo..."
                        className="h-9"
                      />
                      <CommandEmpty>Nenhum capítulo encontrado.</CommandEmpty>
                      <CommandGroup>
                        {formattedModules.map(module => (
                          <CommandItem
                            value={module.label}
                            key={module.value}
                            onSelect={() => {
                              form.setValue('moduleId', module.value)
                            }}
                          >
                            {module.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                module.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Vídeo</FormLabel>
                <FormControl>
                  <VideoFileInput
                    errorMessage={form.formState.errors.video?.message}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button isLoading={form.formState.isSubmitting} type="submit">
            Salvar
          </Button>
        </form>
      </Form>
    </div>
  )
}
