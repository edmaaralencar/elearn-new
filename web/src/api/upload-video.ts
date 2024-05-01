import { api } from '@/lib/axios'
import { Preview } from '@/pages/teachers/edit-course/video-file-input'

type Params = {
  formData: FormData
  onProgressChanged: React.Dispatch<React.SetStateAction<Preview | null>>
}

type Response = {
  url: string
}

export async function uploadVideo({ formData, onProgressChanged }: Params) {
  return api<Response>({
    method: 'POST',
    url: '/attachments/video',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
    onUploadProgress: progressEvent => {
      const progress = (progressEvent.loaded / (progressEvent?.total ?? 0)) * 50

      onProgressChanged(
        prev =>
          prev && {
            ...prev,
            progress
          }
      )
    },
    onDownloadProgress: progressEvent => {
      const progress =
        50 + (progressEvent.loaded / (progressEvent?.total ?? 0)) * 50

      onProgressChanged(
        prev =>
          prev && {
            ...prev,
            progress
          }
      )
    }
  })
}
