import { Step } from '@/components/step'
import { formatMoney } from '@/utils/format-money'
import { useState } from 'react'
import { Resume } from './resume'
import { useProfile } from '@/api/hooks/use-profile'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { useSubscription } from '@/api/hooks/use-subscription'
import { Info } from './info'

export function Checkout() {
  const [step, setStep] = useState(0)
  const { data: profile, isLoading, error } = useProfile()
  const { data: subscription } = useSubscription()
  const [paymentDetails, setPaymentDetails] = useState<{
    clientSecret: string
    subscriptionId: string
  } | null>(null)

  const steps: Record<number, string> = {
    0: 'Resumo',
    1: 'Dados',
    2: 'Pagamento'
  }

  if ((!profile && isLoading) || !subscription) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <Loading className="w-8 h-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <div className="max-w-3xl w-full my-24 mx-auto flex flex-col gap-8 items-center">
          <div className="flex flex-col gap-1 items-center text-center">
            <h1 className="font-semibold">Você não está autenticado.</h1>

            <p className="text-muted-foreground text-sm">
              Para prosseguir com a assinatura, é necessário entrar na
              aplicação.
            </p>
          </div>

          <Button asChild>
            <Link to="/sign-in?redirect=checkout">Entrar</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-5xl w-full flex gap-8 relative items-start py-24">
      <div className="border border-border rounded-md w-full flex flex-col">
        <header className="border-b border-border p-8 flex flex-col gap-4">
          <div className="w-full flex items-center">
            <Step currentStep={step} step={0} />
            <div className="w-full h-[2px] bg-muted"></div>
            <Step currentStep={step} step={1} />
            <div className="w-full h-[2px] bg-muted"></div>
            <Step currentStep={step} step={2} />
          </div>
          <div className="mx-auto font-semibold">Passo: {steps[step]}</div>
        </header>

        <div className="p-8">
          {step === 0 && (
            <Resume
              onNextStep={setStep}
              subscription={{
                description: subscription.description,
                features: subscription.features,
                image: subscription.image,
                name: subscription.name,
                price: subscription.price
              }}
            />
          )}
          {step === 1 && (
            <Info
              subscriptionId={subscription.id}
              onNextStep={setStep}
              setPaymentDetails={setPaymentDetails}
            />
          )}
          {/* {step === 2 && paymentDetails?.clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentDetails.clientSecret,
                appearance: {
                  theme: 'night',

                  variables: {
                    colorPrimary: '#3b82f6',
                    colorBackground: '#1e293b',
                    colorText: 'white',
                    colorDanger: '#df1b41',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '6px',
                    borderRadius: '8px'
                  }
                }
              }}
            >
              <Payment />
            </Elements>
          )} */}
        </div>
      </div>
      <div className="sticky top-4 border border-border rounded-md w-[400px]">
        <header className="border-b border-border p-4">Resumo</header>
        <div className="p-6 flex items-center justify-between">
          <div className="flex w-full items-center justify-between">
            <span className="text-lg">{subscription.name}</span>
            <strong>{formatMoney(subscription.price)}</strong>
          </div>
        </div>
      </div>
    </main>
  )
}
