import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

// The main server component for the dashboard page.
export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect("/login")
  }

  // Fetch all necessary data on the server
  const { data: myPlansData } = await supabase
    .from("plans")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
  const myPlans = myPlansData || []

  const { data: sharedPlansData } = await supabase
    .from("plan_collaborators")
    .select(`plans (*)`)
    .eq("user_id", user.id)
    .order("created_at", { referencedTable: "plans", ascending: false })

  const sharedPlans =
    sharedPlansData
      ?.map((item) => (Array.isArray(item.plans) ? item.plans[0] : item.plans))
      .filter(Boolean) || []

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 md:px-6">
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

      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard
          </h1>
          <Button asChild size="sm">
            <Link href="/dashboard/plans/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Link>
          </Button>
        </div>

        <DashboardClient myPlans={myPlans} sharedPlans={sharedPlans} />
      </main>
    </>
  )
}