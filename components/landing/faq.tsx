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
    question: "Who can see my plans?",
    answer:
      "You have full control. Plans can be 'Restricted', meaning only people you explicitly invite as collaborators can access them. Alternatively, you can set a plan to 'Public', which generates a unique, unguessable link that anyone can use to view a read-only version. Public plans are not indexed by search engines.",
  },
  {
    question: "Can I edit a plan after it has been published?",
    answer:
      "Yes! The plan owner and any collaborators with an 'editor' role can modify a plan at any time, even after it's published. All changes are saved and are immediately visible to everyone who has access to the plan.",
  },
  {
    question: "How does team collaboration work?",
    answer:
      "You can invite team members to your plan via email. Each person can be assigned a role: 'Editor' (can fully edit the plan), 'Commenter' (can view and leave comments), or 'Viewer' (can only view the plan). This allows for seamless teamwork to build the perfect handover document.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data security seriously. Your data is stored securely with Supabase, and we use industry-standard authentication and authorization practices. Only you and your invited collaborators can access your plans based on the permissions you set.",
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