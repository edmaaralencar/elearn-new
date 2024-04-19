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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '@/api/sign-up'
import { toast } from 'sonner'

const signUpFormSchema = z.object({
  password: z.string().min(6, { message: 'Senha é obrigatório' }),
  email: z.string().min(1, { message: 'E-mail é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' })
})

type FormInput = z.infer<typeof signUpFormSchema>

export function SignUp() {
  const navigate = useNavigate()
  const form = useForm<FormInput>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await signUp({
        email: values.email,
        password: values.password,
        name: values.name
      })

      toast.success('Conta criada com sucesso!', {
        description:
          'Você será redirecionado para a tela de verificação do código!'
      })

      setTimeout(() => {
        navigate(`/verification-code?email=${values.email}`)
      }, 600)
    } catch (error) {
      toast.error('Ocorreu um erro.', {
        description: 'Tente novamente mais tarde.'
      })
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <Button asChild>
        <Link to="/sign-up" className="absolute top-6 right-6">
          Cadastrar
        </Link>
      </Button>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Cadastre-se agora
        </h1>
        <p className="text-sm text-muted-foreground">Crie sua conta agora!</p>
      </div>

      <div className="flex flex-col gap-4">
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
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              Criar conta
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
