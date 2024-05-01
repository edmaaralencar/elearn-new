import { uploadVideo } from '@/api/upload-video'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getVideoDuration } from '@/utils/get-video-duration'
import { Trash, Upload, Video } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

type FileInputProps = {
  onChange: (values: { url: string; duration: number }) => void
  errorMessage?: string
}

export interface Preview {
  name: string
  size: number
  fileUrl: string | null
  progress: number
  duration: number
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function VideoFileInput({ errorMessage, onChange }: FileInputProps) {
  const [preview, setPreview] = useState<Preview | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      toast.error('Ocorreu um erro.')
      return
    }

    const formData = new FormData()

    formData.set('file', event.target.files[0])

    try {
      const duration = (await getVideoDuration(event.target.files[0])) as number

      setPreview({
        name: event.target.files[0].name,
        size: event.target.files[0].size,
        progress: 0,
        fileUrl: null,
        duration
      })

      const { data } = await uploadVideo({
        formData,
        onProgressChanged: setPreview
      })

      setPreview(
        prev =>
          prev && {
            ...prev,
            fileUrl: data.url
          }
      )

      onChange({
        duration,
        url: data.url
      })
    } catch (error) {
      toast.error('Ocorreu um erro.', {
        description: 'Tente novamente mais tarde.'
      })
    }
  }

  return (
    <div className={cn('flex flex-col gap-6')}>
      <div
        className={cn(
          'relative flex py-8 px-4 cursor-pointer border-dashed flex-col items-center justify-center gap-3 rounded-xl border bg-base-white',
          errorMessage ? 'border-error-400' : 'border-border'
        )}
      >
        <input
          onChange={handleFileChange}
          id="upload"
          type="file"
          className="sr-only"
        />
        <label htmlFor="upload" className="absolute inset-0" />

        <Upload className="w-9 h-9" />

        <div className="flex flex-col items-center text-center gap-1">
          <span className="text-sm">
            <strong
              className={cn(
                'mr-2 text-base',
                errorMessage ? 'text-error-400' : 'text-'
              )}
            >
              Clique ou arraste para fazer upload
            </strong>
            de seus documentos
          </span>

          <span className="text-xs text-muted-foreground">
            MP3, MP4 ou QuickVideo (max. 1gb)
          </span>
        </div>
      </div>

      {preview && (
        <div className={cn('flex w-full flex-col gap-6')}>
          <div
            key={preview.name}
            className="flex w-full flex-row items-start gap-4 rounded-xl border border-primary-600 p-4"
          >
            <Video className="w-9 h-9" />
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="flex items-start justify-between gap-1">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{preview.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatBytes(preview.size)} - {preview.duration.toFixed(2)}{' '}
                    segundos
                  </span>
                </div>

                <Button size="xs" variant="ghost" type="button">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-2 w-full rounded-[4px] bg-gray-200">
                  <div
                    className="absolute bottom-0 left-0 top-0 h-full rounded-[4px] bg-primary"
                    style={{
                      width: `${preview.progress}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{preview.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
