import { ChevronDown } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

const questions = [
  {
    title: 'Is it acccessible?',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi nihil velit dolore aspernatur, impedit aliquam, sapiente praesentium hic animi laboriosam laudantium quod ea ipsam. Aut aperiam enim hic suscipit molestiae.'
  },
  {
    title: 'Question x?',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi nihil velit dolore aspernatur, impedit aliquam, sapiente praesentium hic animi laboriosam laudantium quod ea ipsam. Aut aperiam enim hic suscipit molestiae.'
  },
  {
    title: 'Question y?',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi nihil velit dolore aspernatur, impedit aliquam, sapiente praesentium hic animi laboriosam laudantium quod ea ipsam. Aut aperiam enim hic suscipit molestiae.'
  },
  {
    title: 'Question z?',
    answer:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi nihil velit dolore aspernatur, impedit aliquam, sapiente praesentium hic animi laboriosam laudantium quod ea ipsam. Aut aperiam enim hic suscipit molestiae.'
  }
]

export function Faq() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-16">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Perguntas e respostas mais frequentes
      </h2>

      <Accordion collapsible type="single">
        {questions.map((question, index) => (
          <AccordionItem key={question.title + index} value={question.title}>
            <AccordionTrigger className="justify-between items-center">
              {question.title}
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="p-4 rounded-b-md">
              {question.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
