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
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { signIn } from '@/api/sign-in'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

const signInFormSchema = z.object({
  password: z.string().min(6, { message: 'Senha é obrigatório' }),
  email: z.string().min(1, { message: 'E-mail é obrigatório' })
})

type FormInput = z.infer<typeof signInFormSchema>

export function SignIn() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  console.log(params.get('redirect'))

  const form = useForm<FormInput>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await signIn({
        email: values.email,
        password: values.password
      })

      const redirect = params.get('redirect')

      if (redirect === 'checkout') {
        navigate('/checkout')
      } else {
        navigate('/app')
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const message = error.response?.data.message

        if (message === 'Email has not been verified.') {
          return toast.error('E-mail não foi verificado.', {
            description: 'Por favor, cheque seu e-mail.'
          })
        }

        if (message === 'Invalid credentials') {
          return toast.error('Credenciais inválidas.')
        }

        if (message === 'User has not created a password yet.') {
          return toast.error('Você ainda não definiu a senha para sua conta.', {
            description: 'Por favor, cheque seu e-mail.'
          })
        }
      }
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
        <h1 className="text-2xl font-semibold tracking-tight">Entre agora</h1>
        <p className="text-sm text-muted-foreground">
          Escreva suas credenciais para entrar!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
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
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
