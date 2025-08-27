import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { 
  Plus, 
  FileText, 
  Globe, 
  FileArchive,
  Clock,
  Users,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"

function PlanCard({ plan }: { plan: any }) {
  const today = new Date()
  const startDate = new Date(plan.start_date)
  const endDate = new Date(plan.end_date)
  const isActive = today >= startDate && today <= endDate && plan.status === "published"
  const isUpcoming = today < startDate && plan.status === "published"

  return (
    <Link href={`/dashboard/plans/${plan.id}`}>
      <Card className="hover:shadow-md transition-all cursor-pointer h-full relative overflow-hidden">
        {isActive && (
          <div className="absolute top-0 right-0 w-24 h-24">
            <div className="absolute transform rotate-45 bg-green-600 text-white text-xs text-center font-semibold py-1 right-[-35px] top-[15px] w-[120px]">
              Active
            </div>
          </div>
        )}
        {isUpcoming && (
          <div className="absolute top-0 right-0 w-24 h-24">
            <div className="absolute transform rotate-45 bg-blue-600 text-white text-xs text-center font-semibold py-1 right-[-35px] top-[15px] w-[120px]">
              Upcoming
            </div>
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="line-clamp-1">{plan.title}</CardTitle>
              <CardDescription>
                {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
              </CardDescription>
            </div>
            {plan.status === "published" ? (
              <Globe className="h-5 w-5 text-green-600" />
            ) : (
              <FileArchive className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant={plan.status === "published" ? "default" : "secondary"}>
              {plan.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(plan.created_at), "MMM d")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect("/login")
  }

  const userName = user.user_metadata?.full_name ?? user.email ?? "User"

  const { data: myPlans } = await supabase
    .from("plans")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const { data: sharedPlansData } = await supabase
    .from("plan_collaborators")
    .select(`
      plans (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { referencedTable: 'plans', ascending: false })
    
  const sharedPlans = sharedPlansData
    ?.map(item => (Array.isArray(item.plans) ? item.plans[0] : item.plans))
    .filter(Boolean) || []

  const totalPlans = myPlans?.length || 0
  const publishedPlans = myPlans?.filter(p => p.status === "published").length || 0
  const draftPlans = myPlans?.filter(p => p.status === "draft").length || 0
  
  const today = new Date()
  const activePlans = myPlans?.filter(p => {
    const start = new Date(p.start_date)
    const end = new Date(p.end_date)
    return today >= start && today <= end && p.status === "published"
  }).length || 0

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {userName.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Manage and share your handover plans
            </p>
          </div>
          <Link href="/dashboard/plans/new">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Plans</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlans}</div>
              <p className="text-xs text-muted-foreground">Created by you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared Plans</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sharedPlans.length}</div>
              <p className="text-xs text-muted-foreground">Shared with you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPlans}</div>
              <p className="text-xs text-muted-foreground">Publicly shared by you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlans}</div>
              <p className="text-xs text-muted-foreground">Your active plans</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Your Plans</h2>
            {myPlans && myPlans.length > 0 && (
              <Badge variant="secondary">{totalPlans} total</Badge>
            )}
          </div>

          {myPlans && myPlans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No plans yet</CardTitle>
              <CardDescription className="mb-4 text-center max-w-sm">
                Create your first handover plan to ensure smooth transitions during your absence
              </CardDescription>
              <Link href="/dashboard/plans/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Plan
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {sharedPlans && sharedPlans.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Shared with Me</h2>
              <Badge variant="secondary">{sharedPlans.length} total</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sharedPlans.map((plan) => plan && <PlanCard key={plan.id} plan={plan} />)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}