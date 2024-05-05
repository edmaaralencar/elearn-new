import { updateCourse } from '@/api/update-course'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const saveGeneralDataFormSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição é obrigatório' })
})

type FormInput = z.infer<typeof saveGeneralDataFormSchema>

type GeneralSectionProps = {
  initialData: {
    id: string
    title: string | null
    description: string | null
  }
}

export function GeneralSection({ initialData }: GeneralSectionProps) {
  const queryClient = useQueryClient()

  const form = useForm<FormInput>({
    resolver: zodResolver(saveGeneralDataFormSchema),
    defaultValues: {
      description: initialData.description ?? '',
      title: initialData.title ?? ''
    }
  })

  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(initialData.id)]
      })

      toast.success('Dados do curso atualizado com sucesso.')
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await updateCourseMutation.mutateAsync({
        id: initialData.id,
        description: values.description,
        title: values.title
      })
    } catch (error) {
      toast.error('Ocorreu um erro.')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-medium">Dados gerais</h2>

      <Form {...form}>
        <form
          className="space-y-5 flex flex-col items-end"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Título do curso" />
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
                  <Input {...field} placeholder="Descrição do curso" />
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
