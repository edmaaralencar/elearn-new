import { Button } from '@/components/ui/button'
import { formatMoney } from '@/utils/format-money'
// import Image from 'next/image'
// import Stripe from 'stripe'

type ResumeProps = {
  // subscription: Stripe.Price & { product: Stripe.Product }
  subscription: {
    name: string
    description: string
    image: string
    features: string[]
    price: number
  }
  onNextStep: (value: number) => void
}

export function Resume({ onNextStep, subscription }: ResumeProps) {
  return (
    <div className="flex flex-col gap-8 items-end">
      <div className="flex items-start gap-6 w-full">
        <img
          src={subscription.image}
          alt={subscription.name}
          className="w-20 h-20"
        />

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{subscription.name}</h2>
            <span className="text-muted-foreground text-sm">
              {subscription.description}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              Assina e tenha acesso a:
            </span>

            <ul className="list-disc ml-3">
              {subscription.features.map(feature => (
                <li className="text-sm text-muted-foreground" key={feature}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-1">
            <span>Preço:</span>
            <strong>{formatMoney(subscription.price)}</strong>
          </div>
        </div>
      </div>

      <Button onClick={() => onNextStep(1)}>Avançar</Button>
    </div>
  )
}
