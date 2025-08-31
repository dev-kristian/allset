// File: app/[publicLinkId]/page.tsx

import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { format, differenceInCalendarDays } from "date-fns"
import {
  CalendarDays,
  CheckSquare,
  Clock,
  Contact2,
  ExternalLink,
  Globe,
  Info,
  Lock,
  Mail,
  Phone,
  Timer,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlanItem, Task, Contact } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: { publicLinkId: string }
}): Promise<Metadata> {
  const { publicLinkId } = params
  const supabase = await createClient()

  const { data: plan } = await supabase
    .from("plans")
    .select(`title, access_level`)
    .eq("public_link_id", publicLinkId)
    .eq("status", "published")
    .single()

  if (!plan) {
    return { title: "Plan Not Found" }
  }

  const robots = "noindex, nofollow"

  if (plan.access_level === "restricted") {
    return {
      title: "Restricted Plan",
      robots,
    }
  }

  const title = `${plan.title} | Handover Plan`
  const description = `View the handover plan: "${plan.title}".`

  return {
    title,
    description,
    robots,
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  }
}

export default async function PublicPlanPage({
  params,
}: {
  params: { publicLinkId: string }
}) {
  const { publicLinkId } = await params
  const supabase = await createClient()

  const { data: planMeta } = await supabase
    .from("plans")
    .select("id, access_level")
    .eq("public_link_id", publicLinkId)
    .eq("status", "published")
    .single()

  if (!planMeta) {
    notFound()
  }

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select(`*, plan_items(id, type, content, sort_order)`)
    .eq("id", planMeta.id)
    .single()

  if (planError || !plan) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return redirect(`/login?next=/${publicLinkId}`)
    }
    notFound()
  }

  const tasks =
    plan.plan_items
      ?.filter((i: PlanItem) => i.type === "task")
      .sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []
  const contacts =
    plan.plan_items
      ?.filter((i: PlanItem) => i.type === "contact")
      .sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-7" />
            <span className="text-lg font-semibold">HandoverPlan</span>
          </Link>
          <Badge
            variant={plan.access_level === "public" ? "secondary" : "outline"}
            className="flex items-center gap-2"
          >
            {plan.access_level === "public" ? (
              <Globe className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span>
              {plan.access_level === "public"
                ? "Public Plan"
                : "Restricted Access"}
            </span>
          </Badge>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl p-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <p className="font-semibold text-primary">Handover Plan</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            {plan.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive overview of tasks and contacts for a seamless transition.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Left Column: Tasks */}
          <div className="lg:col-span-2">
            <section className="space-y-6">
              <h2 className="flex items-center gap-3 text-2xl font-semibold">
                <CheckSquare className="size-6 text-primary" />
                Tasks & Projects
              </h2>
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((item: PlanItem) => (
                    <TaskItem key={item.id} task={item.content as Task} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">No tasks were added to this plan.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Info & Contacts */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Coverage Period Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CalendarDays className="size-5" />
                    Coverage Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">
                      {format(new Date(plan.start_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-medium">
                      {format(new Date(plan.end_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {differenceInCalendarDays(
                        new Date(plan.end_date),
                        new Date(plan.start_date)
                      ) + 1}{" "}
                      days
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Contacts Card */}
              {contacts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Contact2 className="size-5" />
                      Key Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contacts.map((item: PlanItem) => (
                      <ContactItem key={item.id} contact={item.content as Contact} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-12 border-t">
        <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
            Powered by <Logo className="size-5" /> <strong>HandoverPlan</strong>
          </Link>
        </div>
      </footer>
    </div>
  )
}

function TaskItem({ task }: { task: Task }) {
  const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "text-slate-500" },
    "in-progress": { label: "In Progress", icon: Timer, color: "text-blue-500" },
    review: { label: "Review", icon: Clock, color: "text-amber-500" },
    completed: { label: "Completed", icon: CheckSquare, color: "text-green-500" },
  }[task.status] || { label: "Pending", icon: Clock, color: "text-slate-500" };

  const priorityConfig = {
    low: { label: "Low", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
    medium: { label: "Medium", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
    high: { label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300" },
    critical: { label: "Critical", color: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
  }[task.priority] || { label: "Medium", color: "bg-blue-100 text-blue-700" };

  const StatusIcon = statusConfig.icon;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <h3 className="text-lg font-semibold flex-1">{task.title}</h3>
          <div className="flex items-center flex-shrink-0 gap-4">
            <div className={cn("flex items-center gap-2 text-sm font-medium", statusConfig.color)}>
              <StatusIcon className="size-4" />
              <span>{statusConfig.label}</span>
            </div>
            <Badge variant="secondary" className={cn("capitalize", priorityConfig.color)}>
              {priorityConfig.label}
            </Badge>
          </div>
        </div>
        {task.notes && (
          <p className="mt-3 text-muted-foreground">{task.notes}</p>
        )}
        {task.link && (
          <>
            <Separator className="my-4" />
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              View Resource
            </a>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ContactItem({ contact }: { contact: Contact }) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div>
        <h4 className="font-semibold">{contact.name}</h4>
        <p className="text-sm text-muted-foreground">{contact.role}</p>
      </div>

      <div className="space-y-2 text-sm">
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <Mail className="size-4" />
            <span className="truncate">{contact.email}</span>
          </a>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>

      {contact.notes && (
        <div className="flex items-start gap-2 pt-2 text-xs text-muted-foreground border-t mt-3">
          <Info className="size-3.5 mt-0.5 flex-shrink-0" />
          <p>{contact.notes}</p>
        </div>
      )}
    </div>
  );
}