import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const faqs = [
  {
    question: "How do I share a plan with my team?",
    answer:
      "On any plan view page, click the 'Share' button in the top right. You can then invite collaborators by email and assign them roles (Editor, Commenter, or Viewer). You can also change the plan's general access level to generate a public, read-only link.",
  },
  {
    question: "What is the difference between 'Restricted' and 'Public' access?",
    answer:
      "'Restricted' (the default) means only people you have explicitly invited as collaborators can access the plan. 'Public' means anyone with the unique, unguessable link can view a read-only version of the plan. Public plans are not indexed by search engines.",
  },
  {
    question: "What can different collaborator roles do?",
    answer:
      "There are three roles: 'Editor' can fully edit the plan, manage collaborators, and change sharing settings. 'Commenter' can view the plan and add comments (feature coming soon). 'Viewer' can only view the plan's content.",
  },
  {
    question: "Can I un-publish a plan or make it a draft again?",
    answer:
      "Yes. To change a 'published' plan back to a 'draft', simply go to the 'Edit Plan' page and save your changes with the 'Save as Draft' button. This will not remove the public link ID, but the plan will no longer be accessible via that link until it is published again.",
  },
  {
    question: "How do I delete a plan permanently?",
    answer:
      "Only the original owner of a plan can delete it. From the plan view page, click the 'Delete' button. This action is irreversible and will remove the plan and all its associated data permanently.",
  },
  {
    question: "I found a bug or have a feature idea. How can I report it?",
    answer:
      "We'd love to hear from you! In the sidebar under 'Help & Support', click on 'Send Feedback'. This will open a form where you can submit bug reports, feature suggestions, or any other feedback you have.",
  },
]

export default async function FAQPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>FAQs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground">
              Find answers to common questions about using HandoverPlan.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </>
  )
}