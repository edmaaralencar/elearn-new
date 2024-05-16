import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'

type StepProps = {
  step: number
  currentStep: number
}

export function Step({ step, currentStep }: StepProps) {
  return (
    <div
      className={cn(
        'grid h-10 min-w-[40px] bg-primary place-items-center rounded-full',
        currentStep >= step && 'bg-primary',
        currentStep < step && 'bg-muted'
      )}
    >
      {currentStep > step && <CheckIcon className="h-6 w-6 text-white" />}
    </div>
  )
}
