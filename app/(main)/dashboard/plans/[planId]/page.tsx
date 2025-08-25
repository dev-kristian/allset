import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { 
  Calendar, 
  Edit, 
  Globe, 
  ArrowLeft, 
  ExternalLink,
  Mail,
  Phone,
  User,
  FileText,
  Trash2
} from "lucide-react"

import { PlanItem, Task, Contact } from "@/lib/types"
import { publishPlan, deletePlan } from "@/app/(main)/plans/actions"
import { ShareSection } from "@/components/plans/share-section"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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

export default async function PlanViewPage(
  { params }: { params: { planId: string } }
) {
  const { planId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  // Fetch the plan with its items
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select(`
      *,
      plan_items (
        id,
        type,
        content,
        sort_order
      )
    `)
    .eq("id", planId)
    .eq("author_id", user.id)
    .single()

  if (planError || !plan) {
    notFound()
  }

  // Separate tasks and contacts
  const tasks = plan.plan_items
    ?.filter((item: PlanItem) => item.type === "task")
    ?.sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []
  
  const contacts = plan.plan_items
    ?.filter((item: PlanItem) => item.type === "contact")
    ?.sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []

  const publicUrl = plan.public_link_id 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${plan.public_link_id}`
    : null

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
                <BreadcrumbPage>{plan.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header with actions */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={plan.status === "published" ? "default" : "secondary"}>
                    {plan.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {format(new Date(plan.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {plan.status === "draft" ? (
                  <>
                    <Link href={`/dashboard/plans/${plan.id}/edit`}>
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <form action={publishPlan.bind(null, plan.id)}>
                      <Button type="submit">
                        <Globe className="mr-2 h-4 w-4" />
                        Publish
                      </Button>
                    </form>
                    <form action={deletePlan.bind(null, plan.id)}>
                      <Button type="submit" variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </form>
                  </>
                ) : (
                  <ShareSection publicUrl={publicUrl!} />
                )}
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Coverage Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {format(new Date(plan.start_date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-12" />
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {format(new Date(plan.end_date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-12" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {Math.ceil(
                      (new Date(plan.end_date).getTime() - new Date(plan.start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          {tasks.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tasks & Projects ({tasks.length})
                </CardTitle>
                <CardDescription>
                  Active tasks and projects requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((item: PlanItem, index: number) => {
                  const task = item.content as Task
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">
                            {index + 1}. {task.title}
                          </h4>
                          {task.notes && (
                            <p className="text-sm text-muted-foreground">
                              {task.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <StatusBadge status={task.status} />
                          <PriorityBadge priority={task.priority} />
                        </div>
                      </div>
                      
                      {task.link && (
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Resource
                        </a>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* Contacts Section */}
          {contacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Important Contacts ({contacts.length})
                </CardTitle>
                <CardDescription>
                  Key people to contact for specific issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.map((item: PlanItem) => {
                  const contact = item.content as Contact
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {contact.role}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </span>
                        )}
                      </div>
                      
                      {contact.notes && (
                        <p className="text-sm text-muted-foreground">
                          {contact.notes}
                        </p>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

// Helper components for badges
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    pending: "secondary",
    "in-progress": "default",
    review: "outline",
    completed: "default",
  }
  
  return (
    <Badge variant={variants[status] || "secondary"} className="text-xs">
      {status.replace("-", " ")}
    </Badge>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: "bg-slate-100 text-slate-700 border-slate-200",
    medium: "bg-blue-100 text-blue-700 border-blue-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-red-100 text-red-700 border-red-200",
  }
  
  return (
    <Badge className={`text-xs border ${colors[priority] || colors.medium}`}>
      {priority}
    </Badge>
  )
}