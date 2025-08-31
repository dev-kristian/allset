import { FileText, Users, Share2 } from "lucide-react"

const features = [
  {
    icon: <FileText className="size-8 text-primary" />,
    title: "Structured Plan Builder",
    description:
      "Our intuitive editor helps you create comprehensive handover plans with dedicated sections for tasks, projects, and key contacts. Ensure nothing gets missed.",
  },
  {
    icon: <Users className="size-8 text-primary" />,
    title: "Invite & Collaborate",
    description:
      "Work on plans with your team. Invite colleagues as editors, commenters, or viewers to ensure all information is accurate and up-to-date before you leave.",
  },
  {
    icon: <Share2 className="size-8 text-primary" />,
    title: "Flexible Sharing Controls",
    description:
      "Keep plans private to invited collaborators or generate a unique, shareable link for read-only public access. You control who sees what, and when.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need for a Smooth Handover
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            HandoverPlan provides the tools to document your work, share it securely,
            and empower your team while you&apos;re away.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center rounded-lg border bg-background p-6 text-center"
            >
              <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}