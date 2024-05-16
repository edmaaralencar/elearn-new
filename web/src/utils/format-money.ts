export const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    currency: 'BRl',
    style: 'currency'
  }).format(value)
