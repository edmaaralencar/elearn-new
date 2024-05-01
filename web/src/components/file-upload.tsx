import { generateUploadDropzone } from '@uploadthing/react'

import { toast } from 'sonner'

interface FileUploadProps {
  onChange: (url?: string) => void
  endpoint: 'lessonVideo' | 'courseImage'
}

const UploadDropzone = generateUploadDropzone({
  url: 'http://localhost:3333/api/uploadthing'
})

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      className="py-5 rounded-md border border-border w-full mt-0"
      appearance={{
        button: {
          width: 'auto',
          paddingRight: 8,
          paddingLeft: 8
        }
      }}
      skipPolling
      content={{
        label: 'Escolha um arquivo ou arraste e jogue aqui'
        // button: ({ ready, isUploading }) =>
        //   ready
        //     ? 'Faça o upload'
        //     : isUploading
        //       ? 'Carregando...'
        //       : 'Escolha um arquivo'
        // button: <span>Escolha um arquivo</span>
      }}
      endpoint={endpoint}
      onClientUploadComplete={res => {
        console.log(res)
        onChange(res?.[0].url)
      }}
      onUploadError={error => {
        console.log(JSON.stringify(error))

        toast.error('Ocorreu um erro no upload do arquivo.', {
          description: 'Tente novamente mais tarde.'
        })
      }}
    />
  )
}
