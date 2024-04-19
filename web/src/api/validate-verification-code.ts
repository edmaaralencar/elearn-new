import { api } from '@/lib/axios'

type ValidateVerificationCodeParams = {
  email: string
  code: number
}

export async function validateVerificationCode({
  email,
  code
}: ValidateVerificationCodeParams) {
  return api.post('/users/validate', {
    email,
    code
  })
}
