import { validateVerificationCode } from '@/api/validate-verification-code'
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
  code: z.string().min(6, { message: 'Código de verificação é obrigatório' })
})

type FormInput = z.infer<typeof validateVerificationCodeFormSchema>

export function VerificationCode() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const email = searchParams.get('email')
  const code = searchParams.get('code')

  const form = useForm<FormInput>({
    resolver: zodResolver(validateVerificationCodeFormSchema),
    defaultValues: {
      code: code ?? ''
    }
  })

  async function onSubmit(values: FormInput) {
    if (!email) {
      return toast.error('Nenhum código válido para esse e-mail.')
    }

    try {
      await validateVerificationCode({
        code: Number(values.code),
        email: email as string
      })

      toast.success('Código validado com sucesso', {
        description: 'Você será redirecionado para a tela de login!'
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
          Verifique o seu e-mail
        </h1>
        <p className="text-sm text-muted-foreground">
          Enviamos um código de verificação para {'oi'}.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de verificação</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
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
            <button
              type="button"
              className="bg-background text-muted-foreground hover:text-foreground transition-colors"
            >
              Reenviar email
            </button>
            <Button
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              Verificar e-mail
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
