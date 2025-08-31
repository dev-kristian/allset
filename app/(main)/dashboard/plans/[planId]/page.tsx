import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { format, differenceInCalendarDays } from "date-fns"
import {
  CalendarDays,
  CheckSquare,
  Clock,
  Contact2,
  Edit,
  ExternalLink,
  Info,
  LogOut,
  Mail,
  Phone,
  Timer,
  Trash2,
} from "lucide-react"

import { PlanItem, Task, Contact, Collaborator } from "@/lib/types"
import { deletePlan } from "@/app/(main)/plans/actions"
import { leavePlan } from "@/app/(main)/plans/sharing-actions"
import { ShareDialog } from "@/components/plans/share-section"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { createClient } from "@/lib/supabase/server"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default async function PlanViewPage({
  params,
}: {
  params: { planId: string }
}) {
  const { planId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return redirect("/login")
  }

  const { data: currentUserRole } = await supabase.rpc("get_user_role_on_plan", {
    p_plan_id: planId,
    p_user_id: user.id,
  })

  if (!currentUserRole) {
    notFound()
  }

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select(`*, plan_items (id, type, content, sort_order)`)
    .eq("id", planId)
    .single()

  if (planError || !plan) {
    notFound()
  }

  const isCurrentUserOwner = user.id === plan.author_id

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", plan.author_id)
    .single()

  const { data: collaboratorsData } = await supabase
    .from("plan_collaborators")
    .select(`user_id, role, profile:profiles (full_name, avatar_url, email)`)
    .eq("plan_id", planId)

  const collaborators: Collaborator[] = (collaboratorsData || []).map((c) => ({
    ...c,
    profile: Array.isArray(c.profile) ? c.profile[0] : c.profile,
  }))

  const tasks =
    plan.plan_items
      ?.filter((i: PlanItem) => i.type === "task")
      .sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []
  const contacts =
    plan.plan_items
      ?.filter((i: PlanItem) => i.type === "contact")
      .sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []
  const publicUrl = plan.public_link_id
    ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${
        plan.public_link_id
      }`
    : null

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background border-b px-2 sm:px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb className="flex-1">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate max-w-60">{plan.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <main className="flex-1 p-2 pt-0 sm:p-6">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 text-center sm:text-left">
            <div className="space-y-2 mx-auto sm:mx-0">
              <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Badge
                  variant={
                    plan.status === "published" ? "default" : "secondary"
                  }
                >
                  {plan.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {format(new Date(plan.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end gap-2">
              {currentUserRole === "editor" && (
                <Link href={`/dashboard/plans/${plan.id}/edit`}>
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              )}
              <ShareDialog
                planId={plan.id}
                planTitle={plan.title}
                publicUrl={publicUrl}
                accessLevel={plan.access_level as "restricted" | "public"}
                collaborators={collaborators}
                currentUserId={user.id}
                owner={{
                  id: plan.author_id,
                  name: ownerProfile?.full_name ?? "Owner",
                  email: ownerProfile?.email ?? "",
                  avatar: ownerProfile?.avatar_url ?? null,
                }}
              />
              {isCurrentUserOwner ? (
                <form action={deletePlan.bind(null, plan.id)}>
                  <Button type="submit" variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </form>
              ) : (
                <form action={leavePlan.bind(null, plan.id)}>
                  <Button type="submit" variant="outline" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Leave Plan
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Left Column: Tasks */}
          <div className="lg:col-span-2">
            <section className="space-y-4 sm:space-y-6">
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
                  <p className="text-muted-foreground">
                    No tasks were added to this plan.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Info & Contacts */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 sm:space-y-8">
              {/* Coverage Period Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <CalendarDays className="size-5 text-primary" />
                    Coverage Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">Start Date</span>
                    </div>
                    <span className="font-medium">
                      {format(new Date(plan.start_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-muted-foreground">End Date</span>
                    </div>
                    <span className="font-medium">
                      {format(new Date(plan.end_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Duration</span>
                    </div>
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
                  <CardContent className="space-y-3 sm:space-y-4">
                    {contacts.map((item: PlanItem) => (
                      <ContactItem
                        key={item.id}
                        contact={item.content as Contact}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}

function TaskItem({ task }: { task: Task }) {
  const statusConfig =
    {
      pending: { label: "Pending", icon: Clock, color: "text-slate-500" },
      "in-progress": {
        label: "In Progress",
        icon: Timer,
        color: "text-blue-500",
      },
      review: { label: "Review", icon: Clock, color: "text-amber-500" },
      completed: {
        label: "Completed",
        icon: CheckSquare,
        color: "text-green-500",
      },
    }[task.status] || {
      label: "Pending",
      icon: Clock,
      color: "text-slate-500",
    }

  const priorityConfig =
    {
      low: {
        label: "Low",
        color:
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      },
      medium: {
        label: "Medium",
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      },
      high: {
        label: "High",
        color:
          "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
      },
      critical: {
        label: "Critical",
        color:
          "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
      },
    }[task.priority] || {
      label: "Medium",
      color: "bg-blue-100 text-blue-700",
    }

  const StatusIcon = statusConfig.icon

  return (
    <Card className="transition-shadow hover:shadow-md overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight">{task.title}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                  statusConfig.color,
                  "bg-opacity-10"
                )}
              >
                <StatusIcon className="size-3.5" />
                <span>{statusConfig.label}</span>
              </div>
              <Badge
                variant="secondary"
                className={cn("capitalize text-xs font-medium", priorityConfig.color)}
              >
                {priorityConfig.label}
              </Badge>
            </div>
          </div>
          
          {task.notes && (
            <p className="text-muted-foreground text-sm sm:text-base">{task.notes}</p>
          )}
          
          {task.link && (
            <div className="pt-2">
              <a
                href={task.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="size-4" />
                View Resource
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ContactItem({ contact }: { contact: Contact }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-base">{contact.name}</h4>
            <p className="text-sm text-muted-foreground">{contact.role}</p>
          </div>

          <div className="space-y-2 mx-auto sm:mx-0">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="size-4 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </a>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 flex-shrink-0" />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>

          {contact.notes && (
            <div className="pt-2 border-t border-border">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="size-3.5 mt-0.5 flex-shrink-0" />
                <p>{contact.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}