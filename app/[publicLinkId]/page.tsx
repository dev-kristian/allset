import { notFound } from "next/navigation"
import { format } from "date-fns"
import { 
  Calendar, 
  FileText,
  Mail,
  Phone,
  User,
  ExternalLink,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  GalleryVerticalEnd
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/server"

export default async function PublicPlanPage({
  params,
}: {
  params: { publicLinkId: string }
}) {
  const { publicLinkId } = await params
  const supabase = await createClient()

  // Fetch the plan using the public link ID - no auth required for published plans
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select(`
      *,
      plan_items (
        id,
        type,
        content,
        sort_order
      ),
      profiles (
        full_name
      )
    `)
    .eq("public_link_id", publicLinkId)
    .eq("status", "published")
    .single()

  if (planError || !plan) {
    notFound()
  }

  // Separate tasks and contacts
  const tasks = plan.plan_items
    ?.filter((item: any) => item.type === "task")
    ?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
  
  const contacts = plan.plan_items
    ?.filter((item: any) => item.type === "contact")
    ?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []

  const authorName = plan.profiles?.full_name || "Team Member"
  const daysTotal = Math.ceil(
    (new Date(plan.end_date).getTime() - new Date(plan.start_date).getTime()) /
    (1000 * 60 * 60 * 24)
  )

  // Calculate days remaining (if plan is active)
  const today = new Date()
  const startDate = new Date(plan.start_date)
  const endDate = new Date(plan.end_date)
  const isActive = today >= startDate && today <= endDate
  const isUpcoming = today < startDate
  const daysRemaining = isActive 
    ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-lg font-bold">Allset</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              Public View
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Handover Plan by {authorName}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{plan.title}</h1>
          
          {/* Status Indicator */}
          <div className="flex justify-center">
            {isActive && (
              <Badge className="gap-1" variant="default">
                <CheckCircle2 className="h-3 w-3" />
                Active - {daysRemaining} days remaining
              </Badge>
            )}
            {isUpcoming && (
              <Badge className="gap-1" variant="secondary">
                <Clock className="h-3 w-3" />
                Upcoming
              </Badge>
            )}
            {!isActive && !isUpcoming && (
              <Badge className="gap-1" variant="outline">
                <XCircle className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Coverage Period Card */}
        <Card className="mb-8 border-2">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Coverage Period
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="font-semibold">
                  {format(startDate, "MMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(startDate, "EEEE")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">End Date</p>
                <p className="font-semibold">
                  {format(endDate, "MMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(endDate, "EEEE")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold">{daysTotal} days</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        {tasks.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Active Tasks & Projects
              </CardTitle>
              <CardDescription>
                {tasks.length} {tasks.length === 1 ? 'item' : 'items'} requiring attention during this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((item: any, index: number) => (
                  <TaskCard key={item.id} task={item.content} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts Section */}
        {contacts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Important Contacts
              </CardTitle>
              <CardDescription>
                Key people to reach out to for specific issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {contacts.map((item: any) => (
                  <ContactCard key={item.id} contact={item.content} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>This handover plan was created using Allset</p>
          <p className="mt-1">
            Published on {format(new Date(plan.updated_at), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </main>
    </div>
  )
}

// Task Card Component
function TaskCard({ task, index }: { task: any; index: number }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case 'review':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const priorityColors: Record<string, string> = {
    low: "bg-slate-100 text-slate-700 border-slate-300",
    medium: "bg-blue-100 text-blue-700 border-blue-300",
    high: "bg-orange-100 text-orange-700 border-orange-300",
    critical: "bg-red-100 text-red-700 border-red-300",
  }

  return (
    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {index + 1}
          </span>
          <div className="space-y-1 flex-1">
            <h4 className="font-medium text-base">{task.title}</h4>
            {task.notes && (
              <p className="text-sm text-muted-foreground">{task.notes}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex items-center gap-1">
            {getStatusIcon(task.status)}
            <span className="text-xs capitalize">{task.status.replace('-', ' ')}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${priorityColors[task.priority] || priorityColors.medium}`}
          >
            {task.priority} priority
          </Badge>
        </div>
      </div>
      
      {task.link && (
        <div className="mt-3 pt-3 border-t">
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View Related Resource
          </a>
        </div>
      )}
    </div>
  )
}

// Contact Card Component
function ContactCard({ contact }: { contact: any }) {
  return (
    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-base">{contact.name}</h4>
          <p className="text-sm text-muted-foreground">{contact.role}</p>
        </div>
        
        <div className="space-y-2">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              {contact.email}
            </a>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {contact.phone}
            </div>
          )}
        </div>
        
        {contact.notes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">{contact.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}