import { api } from '@/lib/axios'

export async function signOut() {
  return api.post('/users/sign-out')
}
