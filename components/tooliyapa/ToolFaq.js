'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function ToolFaq({ faq = [], title = 'FAQ' }) {
  if (!faq?.length) return null

  return (
    <section className="mt-10" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">
        {title}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faq.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-sm sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
