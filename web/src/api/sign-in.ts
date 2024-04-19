import { api } from '@/lib/axios'

type SignInParams = {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInParams) {
  return api.post('/users/authenticate', {
    email,
    password
  })
}
