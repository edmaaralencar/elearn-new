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
import { createCourse } from '@/api/create-course'
import { useNavigate } from 'react-router-dom'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

const createCourseFormSchema = z.object({
  title: z.string().min(1, { message: 'Título do curso obrigatório.' }),
  type: z.enum(['mini-course', 'formation'], {
    required_error: 'Tipo do curso obrigatório.'
  })
})

type FormInput = z.infer<typeof createCourseFormSchema>

export function CreateCourseModal() {
  const navigate = useNavigate()
  const form = useForm<FormInput>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: {
      title: ''
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      const { data } = await createCourse({
        title: values.title,
        type: values.type
      })

      toast.success('Curso criado com sucesso.', {
        description: 'Você será redirecionado para a tela de edição.'
      })

      navigate(`/teachers/courses/${data.id}`)
      form.reset()
    } catch (error) {
      toast.error('Ocorreu um erro.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Curso
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crie um curso</DialogTitle>
          <DialogDescription>
            Defina o nome e o tipo do curso e você será redirecionado para uma
            tela para finalizar a criação do curso.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
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
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo do Curso</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-8"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="formation" />
                        </FormControl>
                        <FormLabel className="font-normal">Formação</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="mini-course" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Mini curso
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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
