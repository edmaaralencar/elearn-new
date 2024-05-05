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
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { createModule } from '@/api/create-module'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const createModuleFormSchema = z.object({
  title: z.string().min(1, { message: 'Título do módulo obrigatório.' }),
  description: z
    .string()
    .min(1, { message: 'Descrição do módulo obrigatório.' }),
  type: z.enum(['module', 'quiz'], {
    required_error: 'Tipo do módulo obrigatório.'
  })
})

type FormInput = z.infer<typeof createModuleFormSchema>

export function CreateModuleModal() {
  const params = useParams<{ id: string }>()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormInput>({
    resolver: zodResolver(createModuleFormSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const createModuleMutation = useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(params.id)]
      })
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await createModuleMutation.mutateAsync({
        title: values.title,
        type: values.type,
        course_id: String(params.id),
        description: values.description
      })

      toast.success('Módulo criado com sucesso.')

      form.reset()
      setIsOpen(false)
    } catch (error) {
      toast.error('Ocorreu um erro.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Novo Módulo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crie um módulo</DialogTitle>
          <DialogDescription>
            Defina o nome, descrição e tipo do módulo e o seu novo módulo será
            criado.
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descrição" />
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
                          <RadioGroupItem value="module" />
                        </FormControl>
                        <FormLabel className="font-normal">Módulo</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="quiz" />
                        </FormControl>
                        <FormLabel className="font-normal">Quiz</FormLabel>
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
