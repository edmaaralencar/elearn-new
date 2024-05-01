import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PlusCircle } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { createChapter } from '@/api/create-chapter'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { useState } from 'react'
import { IModule } from '@/@types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'

const createChapterFormSchema = z.object({
  name: z.string().min(1, { message: 'Título do capítulo obrigatório.' }),
  moduleId: z
    .string({ required_error: 'Módulo do capítulo obrigatório.' })
    .min(1, { message: 'Módulo do capítulo obrigatório.' })
})

type FormInput = z.infer<typeof createChapterFormSchema>

type CreateChapterModalProps = {
  modules: IModule[]
}

export function CreateChapterModal({ modules }: CreateChapterModalProps) {
  const params = useParams<{ id: string }>()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FormInput>({
    resolver: zodResolver(createChapterFormSchema),
    defaultValues: {
      name: ''
    }
  })

  const createChapterMutation = useMutation({
    mutationFn: createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(params.id)]
      })
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await createChapterMutation.mutateAsync({
        course_id: Number(params.id),
        name: values.name,
        module_id: Number(values.moduleId)
      })

      toast.success('Capítulo criado com sucesso.')

      form.reset()
      setIsOpen(false)
    } catch (error) {
      toast.error('Ocorreu um erro.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Capítulo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crie um capítulo</DialogTitle>
          <DialogDescription>
            Defina o nome do capítulo e uma descrição.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Título" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um módulo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modules.map(module => (
                        <SelectItem
                          key={module.id}
                          value={module.id.toString()}
                        >
                          {module.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button isLoading={form.formState.isSubmitting} type="submit">
                Criar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
