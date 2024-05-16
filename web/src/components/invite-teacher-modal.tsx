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
import { registerTeacher } from '@/api/register-teacher'
import { useState } from 'react'

const createCourseFormSchema = z.object({
  name: z.string().min(1, { message: 'Nome do professor obrigatório.' }),
  email: z
    .string()
    .email()
    .min(1, { message: 'Email do professor obrigatório.' })
})

type FormInput = z.infer<typeof createCourseFormSchema>

export function InviteTeacherModal() {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FormInput>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: {
      email: '',
      name: ''
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await registerTeacher({
        email: values.email,
        name: values.name
      })

      toast.success('Convite enviado com sucesso.', {
        description: 'Peça para o usuário visualizar seu email.'
      })

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
          Convide um Professor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convite um professor</DialogTitle>
          <DialogDescription>
            Defina o nome e o email do professor e ele receberá um e-mail para
            prosseguir com o cadastro.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button isLoading={form.formState.isSubmitting} type="submit">
                Convidar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
