import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PlanItem } from "@/lib/types"
import { PlanForm } from "@/components/plans/plan-form"
import { Button } from "@/components/ui/button"
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
import { createClient } from "@/lib/supabase/server"

export default async function EditPlanPage({
  params,
}: {
  params: { planId: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select(`*, plan_items (id, type, content, sort_order)`)
    .eq("id", params.planId)
    .single()

  if (planError || !plan) {
    notFound()
  }

  const { data: currentUserRole } = await supabase.rpc('get_user_role_on_plan', {
    p_plan_id: params.planId,
    p_user_id: user.id
  })

  if (currentUserRole !== 'editor') {
    notFound()
  }

  const isOwner = plan.author_id === user.id

  const planData = {
    id: plan.id,
    title: plan.title,
    start_date: plan.start_date,
    end_date: plan.end_date,
    status: plan.status,
    items:
      plan.plan_items?.sort(
        (a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order
      ) || [],
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href={`/dashboard/plans/${params.planId}`}>{plan.title}</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Edit</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/plans/${params.planId}`}>
                <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Plan</Button>
              </Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Plan</h1>
              <p className="text-muted-foreground">Make changes to your handover plan</p>
            </div>
          </div>
          <PlanForm plan={planData} isOwner={isOwner} />
        </div>
      </div>
    </>
  )
}