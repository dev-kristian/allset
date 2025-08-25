import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is a handover plan?",
    answer:
      "A handover plan is a document that outlines your key responsibilities, active projects, important contacts, and other critical information for the person covering for you while you are away (e.g., on vacation or leave). Its goal is to ensure a smooth transition and minimize disruptions.",
  },
  {
    question: "Who can see my published plans?",
    answer:
      "Only people with the unique, randomly generated public link can view your published plan. The plans are not indexed by search engines. You have full control over who you share the link with.",
  },
  {
    question: "Can I edit a plan after it has been published?",
    answer:
      "No, for data integrity, a plan cannot be edited once it is published. If you need to make changes, we recommend you un-publish it (a feature coming soon), or duplicate the plan, make your edits, and then publish the new version.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data security seriously. Your data is stored securely with Supabase, and we use industry-standard authentication and authorization practices. Only you can access and manage your draft plans.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-screen-md px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about HandoverPlan.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}