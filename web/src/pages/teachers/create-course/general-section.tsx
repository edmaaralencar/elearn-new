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
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const saveGeneralDataFormSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição é obrigatório' })
})

type FormInput = z.infer<typeof saveGeneralDataFormSchema>

export function GeneralSection() {
  const form = useForm<FormInput>({
    resolver: zodResolver(saveGeneralDataFormSchema)
  })

  async function onSubmit(values: FormInput) {
    console.log(values)
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
