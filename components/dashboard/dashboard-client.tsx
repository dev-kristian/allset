"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Plus, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Define a consistent type for the plan object.
type Plan = {
  id: string
  title: string
  start_date: string
  end_date: string
  status: "published" | "draft"
  created_at: string
  updated_at: string
}

type PlanStatus = "active" | "upcoming" | "draft" | "published" | "archived"

// Helper function to determine the plan's current status for display.
function getPlanStatus(plan: Plan): {
  text: string
  variant: "default" | "secondary" | "outline"
  className?: string
  filterKey: PlanStatus
} {
  const today = new Date()
  const startDate = new Date(plan.start_date)
  const endDate = new Date(plan.end_date)

  if (plan.status === "published") {
    if (today >= startDate && today <= endDate) {
      return {
        text: "Active",
        variant: "default",
        className: "bg-green-600 hover:bg-green-700 text-white border-transparent",
        filterKey: "active",
      }
    }
    if (today < startDate) {
      return {
        text: "Upcoming",
        variant: "default",
        className: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
        filterKey: "upcoming",
      }
    }
    if (today > endDate) {
      return { text: "Archived", variant: "outline", filterKey: "archived" }
    }
    return { text: "Published", variant: "outline", filterKey: "published" }
  }
  return { text: "Draft", variant: "secondary", filterKey: "draft" }
}

// A dedicated component for the empty state when no plans are available.
function NoPlansEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-12 text-center">
      <FileText className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-6 text-xl font-semibold">No Matching Plans</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Either you have no plans yet, or none match the current filter.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/plans/new">
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Plan
        </Link>
      </Button>
    </div>
  )
}

// A responsive component to render plans as a table on desktop and a card list on mobile.
function PlansList({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) {
    return <NoPlansEmptyState />
  }

  return (
    <Card>
      {/* Mobile View: A list of cards */}
      <div className="md:hidden">
        <div className="divide-y">
          {plans.map((plan) => {
            const status = getPlanStatus(plan)
            return (
              <Link
                key={plan.id}
                href={`/dashboard/plans/${plan.id}`}
                className="block p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="flex-1 font-semibold">{plan.title}</h4>
                  <Badge
                    variant={status.variant}
                    className={`shrink-0 ${status.className}`}
                  >
                    {status.text}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>
                    {format(new Date(plan.start_date), "MMM d")} -{" "}
                    {format(new Date(plan.end_date), "MMM d, yyyy")}
                  </p>
                  <p>
                    Updated{" "}
                    {formatDistanceToNow(new Date(plan.updated_at || plan.created_at), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Desktop View: A data table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Plan Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Coverage Dates</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const status = getPlanStatus(plan)
              return (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/plans/${plan.id}`}
                      className="hover:underline"
                    >
                      {plan.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className={status.className}>
                      {status.text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(plan.start_date), "MMM d")} -{" "}
                    {format(new Date(plan.end_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(plan.updated_at || plan.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/plans/${plan.id}`}>View Plan</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/plans/${plan.id}/edit`}>Edit Plan</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

interface DashboardClientProps {
  myPlans: Plan[]
  sharedPlans: Plan[]
}

export function DashboardClient({ myPlans, sharedPlans }: DashboardClientProps) {
  const [filter, setFilter] = useState<"all" | PlanStatus>("all")

  const filteredPlans = useMemo(() => {
    if (filter === "all") return myPlans
    return myPlans.filter((plan) => getPlanStatus(plan).filterKey === filter)
  }, [myPlans, filter])

  const filters: { key: "all" | PlanStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "upcoming", label: "Upcoming" },
    { key: "draft", label: "Drafts" },
  ]

  return (
    <Tabs defaultValue="my-plans">
      <TabsList className="grid w-full grid-cols-2 sm:w-fit">
        <TabsTrigger value="my-plans">
          My Plans
          <Badge variant="secondary" className="ml-2">{myPlans.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="shared-with-me" disabled={sharedPlans.length === 0}>
          Shared With Me
          {sharedPlans.length > 0 && <Badge variant="secondary" className="ml-2">{sharedPlans.length}</Badge>}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-plans" className="mt-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filters.map(({ key, label }) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(key)}
              className={cn(
                "shrink-0",
                filter === key && "bg-muted text-primary hover:bg-muted"
              )}
            >
              {label}
            </Button>
          ))}
        </div>
        <PlansList plans={filteredPlans} />
      </TabsContent>

      <TabsContent value="shared-with-me" className="mt-4">
        <PlansList plans={sharedPlans} />
      </TabsContent>
    </Tabs>
  )
}