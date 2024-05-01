import { api } from '@/lib/axios'

export async function deleteModule(module_id: string) {
  await api.delete(`/modules/${module_id}`)
}
