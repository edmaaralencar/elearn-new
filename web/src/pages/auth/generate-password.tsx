import { finishTeacherRegistration } from '@/api/finish-teacher-registration'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const validateVerificationCodeFormSchema = z.object({
  code: z.string().min(6, { message: 'Código de verificação é obrigatório' }),
  password: z.string().min(6, { message: 'Senha é obrigatória' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Confirmação de senha é obrigatória' })
})

type FormInput = z.infer<typeof validateVerificationCodeFormSchema>

export function GeneratePassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const code = searchParams.get('code')
  const email = searchParams.get('email')

  const form = useForm<FormInput>({
    resolver: zodResolver(validateVerificationCodeFormSchema),
    defaultValues: {
      code: code ?? '',
      confirmPassword: '',
      password: ''
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await finishTeacherRegistration({
        code: Number(values.code),
        email: String(email),
        password: values.password
      })

      toast.success('Cadastro finalizado com sucesso.', {
        description: 'Você será redirecionado para a tela de login.'
      })

      navigate('/sign-in')
    } catch (error) {
      toast.error('Ocorreu um erro.', {
        description: 'Código inválido.'
      })
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Finalize o cadastro como professor
        </h1>
        <p className="text-sm text-muted-foreground">
          Enviamos um código de verificação para você.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmação de Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de verificação</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="w-12 h-12" index={0} />
                        <InputOTPSlot className="w-12 h-12" index={1} />
                        <InputOTPSlot className="w-12 h-12" index={2} />
                        <InputOTPSlot className="w-12 h-12" index={3} />
                        <InputOTPSlot className="w-12 h-12" index={4} />
                        <InputOTPSlot className="w-12 h-12" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Por favor digite o código de verificação enviado a você.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              Finalizar cadastro
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
