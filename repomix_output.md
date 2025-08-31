# Repository Snapshot: allset

This file is a merged representation of a subset of the codebase...

- **Total Files**: 54

---

## Directory Structure

```
.gitignore
app/(auth)/actions.ts
app/(auth)/callback/route.ts
app/(auth)/login/page.tsx
app/(main)/dashboard/page.tsx
app/(main)/dashboard/plans/[planId]/edit/page.tsx
app/(main)/dashboard/plans/[planId]/not-found.tsx
app/(main)/dashboard/plans/[planId]/page.tsx
app/(main)/dashboard/plans/new/page.tsx
app/(main)/feedback/actions.ts
app/(main)/layout.tsx
app/(main)/notifications/actions.ts
app/(main)/plans/actions.ts
app/(main)/plans/comment-actions.ts
app/(main)/plans/sharing-actions.ts
app/[publicLinkId]/loading.tsx
app/[publicLinkId]/not-found.tsx
app/[publicLinkId]/page.tsx
app/globals.css
app/layout.tsx
app/manifest.json
app/page.tsx
app/robots.ts
app/sitemap.ts
components.json
components/auth/login-form.tsx
components/dashboard/dashboard-client.tsx
components/feedback/feedback-form.tsx
components/icons.tsx
components/landing/cta.tsx
components/landing/faq.tsx
components/landing/features.tsx
components/landing/footer.tsx
components/landing/hero.tsx
components/landing/navbar.tsx
components/logo.tsx
components/navigation/app-sidebar.tsx
components/navigation/nav-main.tsx
components/navigation/nav-user.tsx
components/plans/plan-form.tsx
components/plans/share-section.tsx
eslint.config.mjs
hooks/use-mobile.ts
lib/supabase/admin.ts
lib/supabase/client.ts
lib/supabase/server.ts
lib/types.ts
lib/utils.ts
middleware.ts
next.config.ts
package.json
postcss.config.mjs
test.py
tsconfig.json
```

---

## File Contents

### `components/dashboard/dashboard-client.tsx`

```tsx
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
```

### `.gitignore`

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

### `app/(auth)/actions.ts`

```ts
"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${error.message}`)
  }

  revalidatePath("/", "layout")
  return redirect("/dashboard")
}

export async function signInWithOAuth(provider: "google" | "apple") {
  const origin = (await headers()).get("origin")
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/callback`,
    },
  })

  if (error) {
    return redirect(`/login?error=${error.message}`)
  }

  if (data.url) {
    return redirect(data.url)
  }

  return redirect("/login?error=Could not authenticate with provider")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  return redirect("/")
}
```

### `app/(auth)/callback/route.ts`

```ts
import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=Could not authenticate user`
  )
}
```

### `app/(main)/dashboard/plans/new/page.tsx`

```tsx
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
import { PlanForm } from "@/components/plans/plan-form"

export default async function NewPlanPage() {
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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Plans</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>New Plan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Create New Plan</h1>
            <p className="text-muted-foreground">
              Set up a comprehensive handover plan for your absence
            </p>
          </div>
          
          <PlanForm />
        </div>
      </div>
    </>
  )
}
```

### `app/(main)/layout.tsx`

```tsx
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/navigation/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const userData = {
    name: user.user_metadata?.full_name ?? user.email ?? "User",
    email: user.email!,
    avatar: user.user_metadata?.avatar_url ?? "",
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### `app/(main)/notifications/actions.ts`

```ts
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("recipient_id", user.id)

  revalidatePath("/")
}
export async function markAllNotificationsAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false)
    .eq("recipient_id", user.id)

  revalidatePath("/")
}
```

### `app/(main)/plans/comment-actions.ts`

```ts
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

interface FormState {
  message?: string
  error?: string
}

export async function createComment(
  planId: string,
  formData: FormData
): Promise<FormState> {
  const content = formData.get("content") as string
  if (!content || content.trim().length < 1) {
    return { error: "Comment cannot be empty." }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to comment." }
  }

  const { error } = await supabase.from("comments").insert({
    plan_id: planId,
    content: content.trim(),
    author_id: user.id,
  })

  if (error) {
    console.error("Error creating comment:", error)
    return { error: "Failed to post comment. You may not have permission." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  return { message: "Comment posted." }
}
```

### `app/(main)/plans/sharing-actions.ts`

```ts
// File: app/(main)/plans/sharing-actions.ts

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

type CollaboratorRole = "viewer" | "commenter" | "editor"

interface FormState {
  message?: string
  error?: string
}

async function isOwner(userId: string, planId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("plans")
    .select("author_id")
    .eq("id", planId)
    .single()
  
  if (error || !data) {
    console.error("Error checking plan ownership:", error)
    return false
  }
  return data.author_id === userId
}

async function getProfileByEmail(email: string) {
  const supabaseAdmin = createAdminClient()
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name")
    .eq("email", email)
    .single()
  return profile
}

export async function addCollaborator(
  planId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!(await isOwner(user.id, planId))) {
    return { error: "Only the plan owner can add collaborators." }
  }

  const email = formData.get("email") as string
  const role = formData.get("role") as CollaboratorRole
  const notify = formData.get("notify") === "on"

  if (!email || !role) {
    return { error: "Email and role are required." }
  }
  
  const profileToAdd = await getProfileByEmail(email)
  
  if (!profileToAdd) {
    return { error: `Could not add collaborator. Please check the email address and try again.` }
  }

  if (profileToAdd.id === user.id) {
    return { error: "You cannot add yourself as a collaborator." }
  }

  const { error: upsertError } = await supabase.from("plan_collaborators").upsert({
    plan_id: planId,
    user_id: profileToAdd.id,
    role: role,
  })

  if (upsertError) {
    console.error("Error adding collaborator:", upsertError)
    return { error: "Failed to add collaborator." }
  }

  if (notify) {
    await supabase.from("notifications").insert({
      recipient_id: profileToAdd.id,
      actor_id: user.id,
      type: "PLAN_ACCESS_GRANTED",
      resource_id: planId,
    })
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  return { message: `${profileToAdd.full_name || email} was added as a ${role}.` }
}

export async function updateCollaboratorRole(
  planId: string,
  userIdToUpdate: string,
  newRole: CollaboratorRole
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!(await isOwner(user.id, planId))) {
    return { error: "Only the plan owner can update roles." }
  }

  const { error } = await supabase
    .from("plan_collaborators")
    .update({ role: newRole })
    .eq("plan_id", planId)
    .eq("user_id", userIdToUpdate)

  if (error) {
    console.error("Error updating role:", error)
    return { error: "Failed to update role." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  return { message: "Collaborator role updated." }
}

export async function removeCollaborator(planId: string, userIdToRemove: string): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const isRequestingUserOwner = await isOwner(user.id, planId)
  const isSelfRemoval = user.id === userIdToRemove

  if (!isRequestingUserOwner && !isSelfRemoval) {
    return { error: "You do not have permission to remove this collaborator." }
  }

  const { error } = await supabase
    .from("plan_collaborators")
    .delete()
    .eq("plan_id", planId)
    .eq("user_id", userIdToRemove)

  if (error) {
    console.error("Error removing collaborator:", error)
    return { error: "Failed to remove collaborator." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  if (isSelfRemoval) {
    return { message: "You have left the plan." }
  }
  return { message: "Collaborator removed." }
}

export async function updatePlanAccessLevel(
  planId: string,
  accessLevel: "restricted" | "public"
): Promise<FormState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!(await isOwner(user.id, planId))) {
    return { error: "Only the plan owner can change the access level." }
  }

  const { error } = await supabase
    .from("plans")
    .update({ access_level: accessLevel })
    .eq("id", planId)

  if (error) {
    console.error("Error updating plan access level:", error)
    return { error: "Failed to update sharing settings." }
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  revalidatePath(`/${planId}`)
  return { message: `Access level set to "${accessLevel}".` }
}

export async function leavePlan(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  if (await isOwner(user.id, planId)) {
    throw new Error("Owners cannot leave their own plan. Please delete it instead.")
  }

  const { error } = await supabase
    .from("plan_collaborators")
    .delete()
    .eq("plan_id", planId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error leaving plan:", error)
    throw new Error("Failed to leave the plan.")
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
```

### `app/manifest.json`

```json
{
  "name": "Handover Plan",
  "short_name": "Handover",
  "icons": [
    {
      "src": "/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

### `app/robots.ts`

```ts
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/sitemap.xml'],
      disallow: ['/dashboard/', '/login/', '/callback/'],
    },
    sitemap: 'https://handoverplan.com/sitemap.xml',
  }
}
```

### `components/icons.tsx`

```tsx
import { type LucideProps } from "lucide-react"

export const Icons = {
  google: (props: LucideProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  ),
}
```

### `components/landing/cta.tsx`

```tsx
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Cta() {
  return (
    <section id="cta" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="rounded-lg border bg-background p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready for a Stress-Free Handover?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Stop worrying about leaving work behind. Create your first handover
            plan today and ensure your team is all set for success.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg">Get Started for Free</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### `components/landing/faq.tsx`

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is a handover plan?",
    answer:
      "A handover plan is a document that outlines your key responsibilities, active projects, important contacts, and other critical information for the person covering for you while you are away (e.g., on vacation or leave). Its goal is to ensure a smooth transition and minimize disruptions.",
  },
  {
    question: "Who can see my published plans?",
    answer:
      "Only people with the unique, randomly generated public link can view your published plan. The plans are not indexed by search engines. You have full control over who you share the link with.",
  },
  {
    question: "Can I edit a plan after it has been published?",
    answer:
      "No, for data integrity, a plan cannot be edited once it is published. If you need to make changes, we recommend you un-publish it (a feature coming soon), or duplicate the plan, make your edits, and then publish the new version.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data security seriously. Your data is stored securely with Supabase, and we use industry-standard authentication and authorization practices. Only you can access and manage your draft plans.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-screen-md px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find answers to common questions about HandoverPlan.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
```

### `components/landing/features.tsx`

```tsx
import { FilePlus2, ListChecks, Share2 } from "lucide-react"

const features = [
  {
    icon: <FilePlus2 className="size-8 text-primary" />,
    title: "Easy Plan Creation",
    description:
      "Our intuitive form builder allows you to create comprehensive handover plans in minutes, with dedicated sections for tasks, projects, and important contacts.",
  },
  {
    icon: <Share2 className="size-8 text-primary" />,
    title: "Seamless Public Sharing",
    description:
      "Generate a unique, shareable link for your plan with a single click. Anyone with the link can view a clean, read-only version of your plan, no login required.",
  },
  {
    icon: <ListChecks className="size-8 text-primary" />,
    title: "Structured & Clear",
    description:
      "Ensure nothing gets missed. Our structured format for tasks and contacts provides clarity and ensures a smooth transition for your team during your absence.",
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
```

### `components/navigation/nav-main.tsx`

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    onClick?: (e: React.MouseEvent) => void
    items?: {
      title: string
      url: string
      onClick?: (e: React.MouseEvent) => void
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || 
            (item.items && item.items.some(subItem => pathname === subItem.url))

          if (!item.items) {
            // Simple menu item without sub-items
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  isActive={isActive}
                  asChild
                >
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="w-full text-left"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </button>
                  ) : (
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Menu item with sub-items
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    className={cn(isActive && "bg-sidebar-accent")}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton 
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          {subItem.onClick ? (
                            <button
                              onClick={subItem.onClick}
                              className="w-full text-left"
                            >
                              <span>{subItem.title}</span>
                            </button>
                          ) : (
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
```

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### `eslint.config.mjs`

```mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;

```

### `hooks/use-mobile.ts`

```ts
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

### `lib/supabase/admin.ts`

```ts
import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client is for server-side use only and should not be exposed to the browser.
// It uses the service role key, which has full admin privileges.
export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
```

### `lib/supabase/client.ts`

```ts
"use client"

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `lib/utils.ts`

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

### `postcss.config.mjs`

```mjs
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;

```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

### `app/(main)/dashboard/page.tsx`

```tsx
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
```

### `app/(main)/dashboard/plans/[planId]/not-found.tsx`

```tsx
import Link from "next/link"
import { ArrowLeft, FileX } from "lucide-react"

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

export default function NotFound() {
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
                <BreadcrumbPage>Not Found</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <FileX className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Plan not found</h1>
          <p className="mt-2 text-muted-foreground">
            The plan you're looking for doesn't exist or you
            don't have access to it.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </main>
    </>
  )
}
```

### `app/(main)/feedback/actions.ts`

```ts
"use server"

import { createClient } from "@/lib/supabase/server"

interface FormState {
  message?: string
  error?: string
}

export async function submitFeedback(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to submit feedback." }
  }

  const content = formData.get("content") as string
  const type = formData.get("type") as string

  if (!content || content.trim().length < 10) {
    return { error: "Feedback must be at least 10 characters long." }
  }

  if (!type) {
    return { error: "Please select a feedback type." }
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: user.id,
    content: content.trim(),
    type,
  })

  if (error) {
    console.error("Error submitting feedback:", error)
    return { error: "Failed to submit feedback. Please try again." }
  }

  return { message: "Thank you! Your feedback has been submitted." }
}
```

### `app/[publicLinkId]/loading.tsx`

```tsx
import { GalleryVerticalEnd } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function PublicPlanLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-lg font-bold">HandoverPlan</span>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="mb-8 text-center space-y-4">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-10 w-96 mx-auto" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </div>

        {/* Coverage Period Card Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-4 w-20 mx-auto" />
                  <Skeleton className="h-5 w-24 mx-auto" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
```

### `app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.65rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.623 0.214 259.815);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.623 0.214 259.815);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.623 0.214 259.815);
  --sidebar-primary-foreground: oklch(0.97 0.014 254.604);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.623 0.214 259.815);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.546 0.245 262.881);
  --primary-foreground: oklch(0.379 0.146 265.522);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.488 0.243 264.376);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.546 0.245 262.881);
  --sidebar-primary-foreground: oklch(0.379 0.146 265.522);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.488 0.243 264.376);
}


@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

.truncate-select .select-trigger {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

```

### `app/sitemap.ts`

```ts
// File: app/sitemap.ts

import { MetadataRoute } from 'next'

const APP_URL = "https://handoverplan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: APP_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
```

### `components/feedback/feedback-form.tsx`

```tsx
"use client"
import { useEffect, useRef, useActionState } from "react" 
import { useFormStatus } from "react-dom"
import { MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"

import { submitFeedback } from "@/app/(main)/feedback/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const initialState = {
  message: undefined,
  error: undefined,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        "Submitting..."
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Submit Feedback
        </>
      )}
    </Button>
  )
}

interface FeedbackFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  
  const [state, formAction] = useActionState(submitFeedback, initialState)

  useEffect(() => {
    if (state.message) {
      toast.success(state.message)
      onOpenChange(false)
      formRef.current?.reset()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submit Feedback
          </DialogTitle>
          <DialogDescription>
            Have a bug to report or a feature to suggest? We&apos;d love to hear
            from you!
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="type">Feedback Type</Label>
            <Select name="type" required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select a type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Details</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Please provide as much detail as possible..."
              rows={5}
              required
              minLength={10}
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### `components/landing/footer.tsx`

```tsx
import Link from "next/link"
import { Logo } from "@/components/logo"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="size-8" />
              <span className="text-lg font-bold">HandoverPlan</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Create and share clear handover plans to ensure smooth transitions
              while you&apos;re away.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-start-4">
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-3 text-sm">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 HandoverPlan. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

### `components/landing/hero.tsx`

```tsx
import Image from "next/image"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ButtonConfig {
  text: string
  url: string
  icon?: React.ReactNode
}

interface HeroProps {
  badge?: string
  heading: string
  description: string
  buttons?: {
    primary?: ButtonConfig
    secondary?: ButtonConfig
  }
  image?: {
    src: string
    alt: string
  }
}

const Hero = ({
  badge = "Now in Public Beta ✨",
  heading = "Ensure a Seamless Handover, Every Time.",
  description = "HandoverPlan helps you create clear, comprehensive, and shareable handover plans, so you can take time off with peace of mind and your team can stay productive.",
  buttons = {
    primary: {
      text: "Create Your First Plan",
      url: "/login",
    },
    secondary: {
      text: "Learn More",
      url: "#features",
      icon: <ArrowRight className="ml-2 size-4" />,
    },
  },
  image = {
    src: "/hero.png",
    alt: "Screenshot of a sample handover plan.",
  },
}: HeroProps) => {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <a href="#features" className="group">
                <Badge variant="outline">
                  {badge}
                  <ArrowUpRight className="ml-2 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Badge>
              </a>
            )}
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url} className="inline-flex items-center">
                    {buttons.primary.text}
                    {buttons.primary.icon}
                  </a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url} className="inline-flex items-center">
                    {buttons.secondary.text}
                    {buttons.secondary.icon}
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-lg">
            <Image
              src={image.src}
              alt={image.alt}
              width={1024}
              height={576}
              className="max-h-96 w-full rounded-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
```

### `components/landing/navbar.tsx`

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { Menu, X } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Features", href: "#features" },
  { name: "FAQ", href: "#faq" },
]

export function Navbar({ user }: { user: User | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Logo className="size-8" />
          <span className="text-lg font-bold">HandoverPlan</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <nav className="flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="size-4" />
          ) : (
            <Menu className="size-4" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-border px-4 pb-6 pt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
```

### `components/logo.tsx`

```tsx
import { cn } from "@/lib/utils"

/**
 * A reusable component for the app logo.
 * It uses a standard <img> tag, perfect for SVGs.
 * @param {string} className
 */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="HandoverPlan Logo"
      className={cn(className)}
      loading="eager"
      width="32" 
      height="32"
    />
  )
}
```

### `components/plans/share-section.tsx`

```tsx
// File: components/plans/share-section.tsx

"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Globe,
  Link as LinkIcon,
  Loader2,
  Lock,
  Plus,
  Send,
  X,
} from "lucide-react"

import {
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  updatePlanAccessLevel,
} from "@/app/(main)/plans/sharing-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Collaborator } from "@/lib/types"

interface ShareDialogProps {
  planId: string
  planTitle: string
  publicUrl: string | null
  accessLevel: "restricted" | "public"
  collaborators: Collaborator[]
  currentUserId: string
  owner: {
    id: string
    name: string | null
    email: string | null
    avatar: string | null
  }
}

const initialState = { message: "", error: "" }

export function ShareDialog({
  planId,
  planTitle,
  publicUrl,
  accessLevel,
  collaborators,
  currentUserId,
  owner,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const addCollaboratorFormRef = useRef<HTMLFormElement>(null)
  const isCurrentUserOwner = currentUserId === owner.id

  const [addState, addCollaboratorAction, isAddPending] = useActionState(
    addCollaborator.bind(null, planId),
    initialState
  )

  useEffect(() => {
    if (addState.message) {
      toast.success(addState.message)
      addCollaboratorFormRef.current?.reset()
    }
    if (addState.error) toast.error(addState.error)
  }, [addState])

  const handleCopy = () => {
    if (!publicUrl) return
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleAccessLevelChange = (value: "restricted" | "public") => {
    toast.promise(updatePlanAccessLevel(planId, value), {
        loading: "Updating access level...",
        success: (res) => res.message || "Access level updated!",
        error: (err) => (err as Error).message || "Failed to update.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share &quot;{planTitle}&quot;</DialogTitle>
          <DialogDescription>
            Manage collaborators or change the general access level.
          </DialogDescription>
        </DialogHeader>

        {isCurrentUserOwner && (
          <div className="space-y-2 pt-2">
            <Label>Add people and groups</Label>
            <form
              ref={addCollaboratorFormRef}
              action={addCollaboratorAction}
              className="flex items-center gap-2"
            >
              <Input name="email" type="email" placeholder="Enter email address" required />
              <Select name="role" defaultValue="viewer" required>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="commenter">Commenter</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="icon" disabled={isAddPending}>
                {isAddPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-medium">People with access</h3>
          <div className="max-h-48 space-y-3 overflow-y-auto">
            <CollaboratorRow
              avatar={owner.avatar}
              name={owner.name}
              email={owner.email}
              role="Owner"
            />
            {collaborators.map((c) => (
              <CollaboratorRow
                key={c.user_id}
                planId={planId}
                userId={c.user_id}
                avatar={c.profile?.avatar_url}
                name={c.profile?.full_name}
                email={c.profile?.email}
                role={c.role}
                canManage={isCurrentUserOwner}
              />
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className={`rounded-full border p-2 ${accessLevel === "public" ? "bg-blue-100 dark:bg-blue-900" : "bg-muted"}`}>
              {accessLevel === "public" ? <Globe className="h-6 w-6 text-blue-600 dark:text-blue-300" /> : <Lock className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <Label className="font-semibold">General access</Label>
              <Select 
                value={accessLevel} 
                onValueChange={handleAccessLevelChange}
                disabled={!isCurrentUserOwner}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="public">Anyone with the link</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">
                {accessLevel === "public" ? "Anyone on the internet with the link can view." : "Only people with access can open with the link."}
                {!isCurrentUserOwner && " Only the owner can change this."}
              </p>
            </div>
          </div>
          
          {publicUrl && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={copied}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CollaboratorRow({
  planId,
  userId,
  avatar,
  name,
  email,
  role,
  canManage,
}: {
  planId?: string
  userId?: string
  avatar: string | null | undefined
  name: string | null | undefined
  email: string | null | undefined
  role: string
  canManage?: boolean
}) {
  const [isRemoving, setIsRemoving] = useState(false)
  const isOwner = role === "Owner"

  const handleRoleChange = (newRole: "viewer" | "commenter" | "editor") => {
    if (!planId || !userId) return
    toast.promise(updateCollaboratorRole(planId, userId, newRole), {
      loading: "Updating role...",
      success: (res) => res.message || "Role updated!",
      error: (err) => (err as Error).message || "Failed to update role.",
    })
  }

  const handleRemove = async () => {
    if (!planId || !userId) return
    setIsRemoving(true)
    const result = await removeCollaborator(planId, userId)
    if (result.error) toast.error(result.error)
    if (result.message) toast.success(result.message)
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar ?? ""} alt={name ?? ""} />
        <AvatarFallback>{name?.[0] ?? email?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium">{name ?? email}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
      {isOwner ? (
        <span className="text-sm text-muted-foreground">Owner</span>
      ) : canManage ? (
        <div className="flex items-center gap-2">
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[120px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="commenter">Commenter</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemove} disabled={isRemoving}>
            {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground capitalize">{role}</span>
      )}
    </div>
  )
}
```

### `lib/supabase/server.ts`

```ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // The new `getAll` method reads all cookies
        getAll() {
          return cookieStore.getAll()
        },
        // The new `setAll` method writes multiple cookies
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### `middleware.ts`

```ts
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // The new `getAll` method reads cookies from the incoming request
        getAll() {
          return request.cookies.getAll()
        },
        // The new `setAll` method sets cookies on both the request and response
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
```

### `test.py`

```py
#!/usr/bin/env python3

import os
import sys
import subprocess
import argparse
import fnmatch
from collections import Counter
import glob

# --- GUI Imports (Standard Library) ---
import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# --- Configuration ---
DEFAULT_IGNORE_PATTERNS = [
    # Directories
    ".git/", ".next/", ".venv/", "venv/", "__pycache__/", "node_modules/", "build/", "dist/",
    # Files
    ".DS_Store", "*.pyc", "*.pyo", "*.o", "*.so", "*.a", "*.dll", "*.exe", "*.md",
    "*.db", "*.sqlite", "*.sqlite3",
    "*.lock", "poetry.lock", "pnpm-lock.yaml", "package-lock.json", "yarn.lock",
    "*.swp", "*.swo", "*.swn",
    "*.egg-info/", "*.dist-info/",
    # Media and large files
    "*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.tiff", "*.ico",
    "*.mp3", "*.wav", "*.flac",
    "*.mp4", "*.avi", "*.mov", "*.mkv",
    "*.zip", "*.tar", "*.gz", "*.rar", "*.7z",
    "*.pdf", "*.doc", "*.docx", "*.xls", "*.xlsx", "*.ppt", "*.pptx",
    "*.iso", "*.img", "*.bin", "*.svg"
]
MAX_FILE_SIZE = 1 * 1024 * 1024  # 1 MB

# --- Helper Functions ---
def is_binary(filepath):
    """Heuristic to check if a file is binary."""
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(1024)
        if not chunk: return False
        if b'\0' in chunk: return True
        text_chars = bytearray({7, 8, 9, 10, 12, 13, 27} | set(range(0x20, 0x100)) - {0x7f})
        non_text_ratio = sum(1 for byte in chunk if byte not in text_chars) / len(chunk)
        return non_text_ratio > 0.3
    except IOError:
        return True

def get_git_root():
    """Finds the root directory of the Git repository."""
    try:
        return subprocess.check_output(
            ['git', 'rev-parse', '--show-toplevel'],
            stderr=subprocess.PIPE, text=True
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return os.getcwd()

def get_git_change_counts(repo_path):
    """Uses Git history to count file changes."""
    counts = Counter()
    try:
        all_git_files = subprocess.check_output(['git', 'ls-files'], cwd=repo_path, text=True).strip().split('\n')
        log_output = subprocess.check_output(['git', 'log', '--pretty=format:', '--name-only'], cwd=repo_path, text=True)
        counts.update(log_output.strip().split('\n'))
        for f in all_git_files:
            if f not in counts: counts[f] = 0
    except (subprocess.CalledProcessError, FileNotFoundError):
        return {}
    return counts

def parse_gitignore(root_dir):
    """Parses all .gitignore files and returns a list of patterns."""
    patterns = []
    for dirpath, _, filenames in os.walk(root_dir):
        if '.gitignore' in filenames:
            gitignore_path = os.path.join(dirpath, '.gitignore')
            relative_dir = os.path.relpath(dirpath, root_dir)
            if relative_dir == '.': relative_dir = ''
            with open(gitignore_path, 'r', errors='ignore') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        patterns.append(os.path.join(relative_dir, line).replace(os.sep, '/'))
    return patterns

def find_files_to_include(paths, ignore_patterns, git_root):
    """Walks directories to find files, pruning ignored directories. Used by CLI."""
    all_files = set()
    dir_ignore_patterns = [p for p in ignore_patterns if p.endswith('/')]
    file_ignore_patterns = [p for p in ignore_patterns if not p.endswith('/')]

    for path in paths:
        abs_path = os.path.abspath(path)
        if not os.path.exists(abs_path): continue

        if os.path.isfile(abs_path):
            relative_filepath = os.path.relpath(abs_path, git_root).replace(os.sep, '/')
            if not any(fnmatch.fnmatch(relative_filepath, p) for p in file_ignore_patterns):
                 all_files.add(abs_path)
            continue
        
        if os.path.isdir(abs_path):
            for dirpath, dirnames, filenames in os.walk(abs_path, topdown=True):
                relative_dirpath = os.path.relpath(dirpath, git_root).replace(os.sep, '/') + '/'
                if relative_dirpath == './': relative_dirpath = ''
                
                dirnames[:] = [d for d in dirnames if not any(fnmatch.fnmatch(relative_dirpath + d + '/', pattern) for pattern in dir_ignore_patterns)]
                
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    relative_filepath = os.path.relpath(filepath, git_root).replace(os.sep, '/')
                    if not any(fnmatch.fnmatch(relative_filepath, pattern) for pattern in file_ignore_patterns):
                        all_files.add(filepath)
    return list(all_files)

# --- Core Logic ---
def generate_markdown_from_paths(paths, output_file, custom_ignore_patterns, max_size, pre_scanned=False):
    """
    The core logic of the script.
    If pre_scanned is True, `paths` is treated as the final list of files.
    If pre_scanned is False, `paths` are directories/files to be scanned.
    """
    git_root = get_git_root()
    initial_dir = os.getcwd()
    os.chdir(git_root)

    change_counts = get_git_change_counts(git_root)

    if pre_scanned:
        # GUI path: The files are already selected and vetted.
        all_found_files = paths
    else:
        # CLI path: Scan the provided paths and apply ignore patterns.
        gitignore_patterns = parse_gitignore(git_root)
        all_ignore_patterns = DEFAULT_IGNORE_PATTERNS + gitignore_patterns + custom_ignore_patterns
        all_found_files = find_files_to_include(paths, all_ignore_patterns, git_root)

    included_files = []
    for filepath in all_found_files:
        relative_path = os.path.relpath(filepath, git_root).replace(os.sep, '/')
        try:
            if os.path.getsize(filepath) > max_size: continue
        except OSError: continue
        if is_binary(filepath): continue
        included_files.append(relative_path)

    included_files.sort(key=lambda f: change_counts.get(f, 0))

    output_content = [
        f"# Repository Snapshot: {os.path.basename(git_root)}\n\n"
        "This file is a merged representation of a subset of the codebase...\n\n"
        f"- **Total Files**: {len(included_files)}\n\n---\n\n"
        "## Directory Structure\n\n```\n"
    ]
    output_content.extend(f"{path}\n" for path in sorted(included_files))
    output_content.append("```\n\n---\n\n## File Contents\n\n")

    for filepath in included_files:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            extension = os.path.splitext(filepath)[1].lstrip('.')
            output_content.append(f"### `{filepath}`\n\n```{extension}\n{content}\n```\n\n")
        except Exception: pass

    final_output = "".join(output_content)
    os.chdir(initial_dir)

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_output)
        return f"Successfully created '{output_file}' with {len(included_files)} files."
    except IOError as e:
        return f"Error writing to file {output_file}: {e}"

# --- Tkinter GUI Application ---
class RepoMixApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("RepoMix GUI")
        self.geometry("900x700")
        self.project_root = get_git_root()

        style = ttk.Style(self)
        style.configure("Treeview", rowheight=25)
        style.configure('.', font=('Helvetica', 10))
        style.configure('TButton', padding=5)
        style.configure('TLabelframe.Label', font=('Helvetica', 11, 'bold'))
        # Configure a tag for graying out unchecked items
        self.tag_unchecked = 'unchecked'
        
        self.STATE_UNCHECKED, self.STATE_CHECKED, self.STATE_TRISTATE = 0, 1, 2
        self.checkbox_chars = ('[ ] ', '[x] ', '[-] ')
        self.icons = {'folder': '📁', 'file': '📄'}
        
        self.item_states = {}
        self.create_widgets()
        self.tree.tag_configure(self.tag_unchecked, foreground='gray70') # Lighter gray
        self.refresh_tree_view()
        self.tree.bind('<Button-1>', self.on_item_click, True)

    def _get_combined_ignore_patterns(self):
        gitignore_patterns = parse_gitignore(self.project_root)
        custom_ignore = self.ignore_text.get("1.0", "end-1c").strip().split('\n')
        return DEFAULT_IGNORE_PATTERNS + gitignore_patterns + [p for p in custom_ignore if p]

    def create_widgets(self):
        header_frame = ttk.Frame(self, padding=(10, 10, 10, 0))
        header_frame.pack(fill=tk.X)
        ttk.Label(header_frame, text="Project Root:", font=('Helvetica', 10, 'bold')).pack(side=tk.LEFT)
        ttk.Label(header_frame, text=self.project_root).pack(side=tk.LEFT, padx=5)

        paned_window = ttk.PanedWindow(self, orient=tk.HORIZONTAL)
        paned_window.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        tree_frame = ttk.Labelframe(paned_window, text="Select Files and Folders", padding=5)
        paned_window.add(tree_frame, weight=2)
        tree_frame.grid_rowconfigure(0, weight=1)
        tree_frame.grid_columnconfigure(0, weight=1)

        self.tree = ttk.Treeview(tree_frame, selectmode='none')
        self.tree.grid(row=0, column=0, sticky="nsew")
        ysb = ttk.Scrollbar(tree_frame, orient='vertical', command=self.tree.yview)
        xsb = ttk.Scrollbar(tree_frame, orient='horizontal', command=self.tree.xview)
        self.tree.configure(yscroll=ysb.set, xscroll=xsb.set)
        ysb.grid(row=0, column=1, sticky='ns')
        xsb.grid(row=1, column=0, sticky='ew')

        options_frame = ttk.Frame(paned_window, padding=5)
        paned_window.add(options_frame, weight=1)
        options_frame.grid_columnconfigure(0, weight=1)
        
        output_frame = ttk.Labelframe(options_frame, text="Output File", padding=10)
        output_frame.grid(row=0, column=0, sticky="ew", pady=(0, 10))
        output_frame.grid_columnconfigure(0, weight=1)
        self.output_path_var = tk.StringVar(value="repomix_output.md")
        output_entry = ttk.Entry(output_frame, textvariable=self.output_path_var)
        output_entry.grid(row=0, column=0, sticky="ew", padx=(0, 5))
        browse_button = ttk.Button(output_frame, text="Browse...", command=self.browse_output_file)
        browse_button.grid(row=0, column=1, sticky="e")

        ignore_frame = ttk.Labelframe(options_frame, text="Ignore Patterns", padding=10)
        ignore_frame.grid(row=1, column=0, sticky="nsew")
        ignore_frame.grid_rowconfigure(0, weight=1)
        ignore_frame.grid_columnconfigure(0, weight=1)
        self.ignore_text = tk.Text(ignore_frame, height=10, width=40, relief=tk.SOLID, borderwidth=1)
        self.ignore_text.grid(row=0, column=0, sticky="nsew")
        self.ignore_text.insert("1.0", "\n".join(DEFAULT_IGNORE_PATTERNS))
        ignore_scroll = ttk.Scrollbar(ignore_frame, orient='vertical', command=self.ignore_text.yview)
        self.ignore_text.configure(yscrollcommand=ignore_scroll.set)
        ignore_scroll.grid(row=0, column=1, sticky='ns')

        control_frame = ttk.Frame(self, padding=(10, 0, 10, 10))
        control_frame.pack(fill=tk.X)
        self.status_var = tk.StringVar(value="Ready.")
        status_label = ttk.Label(control_frame, textvariable=self.status_var, anchor="w")
        status_label.pack(side=tk.LEFT, fill=tk.X, expand=True)
        refresh_button = ttk.Button(control_frame, text="Refresh Tree", command=self.refresh_tree_view)
        refresh_button.pack(side=tk.LEFT, padx=(0, 10))
        generate_button = ttk.Button(control_frame, text="Generate Markdown", command=self.run_generation)
        generate_button.pack(side=tk.RIGHT)

    def refresh_tree_view(self):
        self.tree.delete(*self.tree.get_children())
        self.item_states.clear()
        ignore_patterns = self._get_combined_ignore_patterns()
        self.populate_tree(parent="", path=self.project_root, ignore_patterns=ignore_patterns)

    def populate_tree(self, parent, path, ignore_patterns):
        dir_ignore = [p for p in ignore_patterns if p.endswith('/')]
        file_ignore = [p for p in ignore_patterns if not p.endswith('/')]
        try:
            for item in sorted(os.listdir(path)):
                full_path = os.path.join(path, item)
                rel_path = os.path.relpath(full_path, self.project_root).replace(os.sep, '/')
                
                is_dir = os.path.isdir(full_path)
                if (is_dir and any(fnmatch.fnmatch(rel_path + '/', p) for p in dir_ignore)) or \
                   (not is_dir and any(fnmatch.fnmatch(rel_path, p) for p in file_ignore)):
                    continue
                
                icon = self.icons['folder'] if is_dir else self.icons['file']
                node_text = f"{self.checkbox_chars[self.STATE_CHECKED]}{icon} {item}"
                node = self.tree.insert(parent, 'end', iid=full_path, text=node_text, open=False, values=[item, icon])
                self.item_states[full_path] = self.STATE_CHECKED
                if is_dir: self.populate_tree(node, full_path, ignore_patterns)
        except (IOError, OSError): pass

    def on_item_click(self, event):
        item_id = self.tree.identify_row(event.y)
        if not item_id or self.tree.identify_column(event.x) != '#0': return
        current_state = self.item_states.get(item_id, self.STATE_UNCHECKED)
        new_state = self.STATE_UNCHECKED if current_state != self.STATE_UNCHECKED else self.STATE_CHECKED
        self._change_item_state(item_id, new_state)
        self._propagate_down(item_id, new_state)
        self._propagate_up(item_id)

    def _change_item_state(self, item_id, state):
        self.item_states[item_id] = state
        original_name, icon = self.tree.item(item_id, 'values')
        self.tree.item(item_id, text=f"{self.checkbox_chars[state]}{icon} {original_name}")
        # Apply or remove the visual tag for being unchecked
        if state == self.STATE_UNCHECKED:
            self.tree.item(item_id, tags=(self.tag_unchecked,))
        else:
            self.tree.item(item_id, tags=())

    def _propagate_down(self, item_id, state):
        if state == self.STATE_TRISTATE: return
        for child_id in self.tree.get_children(item_id):
            self._change_item_state(child_id, state)
            self._propagate_down(child_id, state)

    def _propagate_up(self, item_id):
        parent_id = self.tree.parent(item_id)
        if not parent_id: return
        children_ids = self.tree.get_children(parent_id)
        if not children_ids: return
        child_states = {self.item_states.get(cid) for cid in children_ids}
        new_parent_state = self.STATE_TRISTATE if len(child_states) > 1 else child_states.pop()
        if self.item_states.get(parent_id) != new_parent_state:
            self._change_item_state(parent_id, new_parent_state)
            self._propagate_up(parent_id)

    def browse_output_file(self):
        filename = filedialog.asksaveasfilename(
            title="Save Output As", initialfile="repomix_output.md",
            defaultextension=".md", filetypes=[("Markdown files", "*.md"), ("All files", "*.*")]
        )
        if filename: self.output_path_var.set(filename)

    def run_generation(self):
        # **BUG FIX**: Compile a definitive list of ONLY files that are checked.
        final_file_list = []
        for path, state in self.item_states.items():
            if state == self.STATE_CHECKED and os.path.isfile(path):
                final_file_list.append(path)

        if not final_file_list:
            messagebox.showwarning("No Files Selected", "Please select at least one file to include.")
            return

        output_file = self.output_path_var.get()
        if not output_file:
            messagebox.showwarning("No Output File", "Please specify an output file name.")
            return

        self.status_var.set("Processing... this may take a moment.")
        self.update_idletasks()

        try:
            # Call the core logic with the exact file list and the pre_scanned flag
            status = generate_markdown_from_paths(
                paths=final_file_list, output_file=output_file,
                custom_ignore_patterns=[], max_size=MAX_FILE_SIZE,
                pre_scanned=True
            )
            self.status_var.set(status)
            messagebox.showinfo("Success", status)
        except Exception as e:
            error_msg = f"An unexpected error occurred: {e}"
            self.status_var.set(error_msg)
            messagebox.showerror("Error", error_msg)

# --- Main Execution Logic ---
def main_cli():
    """The original command-line interface function."""
    parser = argparse.ArgumentParser(
        description="Packs a repository's source code into a single Markdown file for LLM consumption.",
        epilog="Example: python repomix_gui.py . -o context.md -i 'tests/'"
    )
    parser.add_argument("paths", nargs='+', help="Paths to process (files, dirs, globs).")
    parser.add_argument("-o", "--output", default="repomix.md", help="Output file name.")
    parser.add_argument("-i", "--ignore", action="append", default=[], help="Add ignore glob pattern.")
    parser.add_argument("--max-size", type=int, default=MAX_FILE_SIZE, help=f"Max file size (bytes).")
    args = parser.parse_args()

    status = generate_markdown_from_paths(
        paths=args.paths, output_file=args.output,
        custom_ignore_patterns=args.ignore, max_size=args.max_size,
        pre_scanned=False # CLI always scans
    )
    print(status, file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main_cli()
    else:
        app = RepoMixApp()
        app.mainloop()
```

### `app/(auth)/login/page.tsx`

```tsx
import { Suspense } from "react"
import Link from "next/link"

import { Logo } from "@/components/logo"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo className="size-6" />
          HandoverPlan
        </Link>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
```

### `app/(main)/plans/actions.ts`

```ts
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PlanItem } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"

async function isEditor(userId: string, planId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_user_role_on_plan', {
    p_plan_id: planId,
    p_user_id: userId
  })
  if (error) {
    console.error("Error checking user role:", error)
    return false
  }
  return data === 'editor'
}

function generatePublicLinkId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function createPlan(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const status = formData.get("status") as string
  const itemsJson = formData.get("items") as string
  
  const items = JSON.parse(itemsJson)

  let public_link_id = null
  if (status === 'published') {
    public_link_id = generatePublicLinkId()
  }

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .insert({
      author_id: user.id,
      title,
      start_date: new Date(start_date).toISOString().split('T')[0],
      end_date: new Date(end_date).toISOString().split('T')[0],
      status,
      public_link_id,
    })
    .select()
    .single()

  if (planError) {
    console.error("Error creating plan:", planError)
    throw new Error("Failed to create plan")
  }

  if (items.length > 0) {
    const planItems = items.map((item: PlanItem) => ({
      plan_id: plan.id,
      type: item.type,
      content: item.content,
      sort_order: item.sort_order,
    }))

    const { error: itemsError } = await supabase
      .from("plan_items")
      .insert(planItems)

    if (itemsError) {
      console.error("Error creating plan items:", itemsError)
      throw new Error("Failed to create plan items")
    }
  }

  revalidatePath("/dashboard")
  redirect(`/dashboard/plans/${plan.id}`)
}

export async function updatePlan(planId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  if (!(await isEditor(user.id, planId))) {
    throw new Error("You do not have permission to edit this plan.")
  }

  const title = formData.get("title") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const status = formData.get("status") as string
  const itemsJson = formData.get("items") as string
  
  const items = JSON.parse(itemsJson)

  const updateData: {
    title: string;
    start_date: string;
    end_date: string;
    status: string;
    updated_at: string;
    public_link_id?: string;
  } = {
    title,
    start_date: new Date(start_date).toISOString().split('T')[0],
    end_date: new Date(end_date).toISOString().split('T')[0],
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'published') {
    const { data: existingPlan } = await supabase
      .from("plans")
      .select("public_link_id")
      .eq("id", planId)
      .single()
    
    if (!existingPlan?.public_link_id) {
      updateData.public_link_id = generatePublicLinkId()
    }
  }

  const { error: planError } = await supabase
    .from("plans")
    .update(updateData)
    .eq("id", planId)

  if (planError) {
    console.error("Error updating plan:", planError)
    throw new Error("Failed to update plan")
  }

  await supabase
    .from("plan_items")
    .delete()
    .eq("plan_id", planId)

  if (items.length > 0) {
    const planItems = items.map((item: PlanItem) => ({
      plan_id: planId,
      type: item.type,
      content: item.content,
      sort_order: item.sort_order,
    }))

    const { error: itemsError } = await supabase
      .from("plan_items")
      .insert(planItems)

    if (itemsError) {
      console.error("Error updating plan items:", itemsError)
      throw new Error("Failed to update plan items")
    }
  }

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/plans/${planId}`)
  redirect(`/dashboard/plans/${planId}`)
}

export async function publishPlan(planId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  if (!(await isEditor(user.id, planId))) {
    throw new Error("You do not have permission to publish this plan.")
  }

  const { data: existingPlan } = await supabase
    .from("plans")
    .select("public_link_id, status")
    .eq("id", planId)
    .single()

  if (existingPlan?.status === 'published' && existingPlan?.public_link_id) {
    revalidatePath(`/dashboard/plans/${planId}`)
    return
  }

  const public_link_id = generatePublicLinkId()

  const { error } = await supabase
    .from("plans")
    .update({ 
      status: 'published',
      public_link_id,
      updated_at: new Date().toISOString()
    })
    .eq("id", planId)

  if (error) {
    console.error("Error publishing plan:", error)
    throw new Error("Failed to publish plan")
  }

  revalidatePath(`/dashboard/plans/${planId}`)
  revalidatePath('/dashboard')
}

export async function deletePlan(planId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  const { data: plan } = await supabase
    .from("plans")
    .select("author_id")
    .eq("id", planId)
    .single()

  if (!plan || plan.author_id !== user.id) {
    throw new Error("You do not have permission to delete this plan.")
  }

  const { error } = await supabase
    .from("plans")
    .delete()
    .eq("id", planId)

  if (error) {
    console.error("Error deleting plan:", error)
    throw new Error("Failed to delete plan")
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
```

### `app/[publicLinkId]/not-found.tsx`

```tsx
// File: app/[publicLinkId]/not-found.tsx

import Link from "next/link"
import { ArrowLeft, LogIn, LayoutDashboard } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function PublicNotFound() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8" />
            <span className="text-lg font-bold">HandoverPlan</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Plan Not Found</h1>
            <p className="text-muted-foreground max-w-md">
              This handover plan doesn&apos;t exist, is no longer available, or you don&apos;t have permission to view it.
            </p>
          </div>
          
          <div className="flex gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Button>
                </Link>
                <Link href="/login">
                  <Button>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 max-w-md">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> If you&apos;re expecting to see a plan here, please double-check the link or contact the person who shared it with you to ensure you have been granted access.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
```

### `app/page.tsx`

```tsx
import { Cta } from "@/components/landing/cta"
import { Faq } from "@/components/landing/faq"
import { Features } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"
import { Hero } from "@/components/landing/hero"
import { Navbar } from "@/components/landing/navbar"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <Hero
          badge="Now in Public Beta ✨"
          heading="Ensure a Seamless Handover, Every Time."
          description="HandoverPlan helps you create clear, comprehensive, and shareable handover plans, so you can take time off with peace of mind and your team can stay productive."
          buttons={{
            primary: {
              text: "Create Your First Plan",
              url: "/login",
            },
            secondary: {
              text: "Learn More",
              url: "#features",
            },
          }}
        />
        <Features />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
```

### `components/auth/login-form.tsx`

```tsx
"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { signInWithEmail, signInWithOAuth } from "@/app/(auth)/actions"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <form action={() => signInWithOAuth("google")}>
              <Button variant="outline" className="w-full">
                <Icons.google className="mr-2 size-4" />
                Login with Google
              </Button>
            </form>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            {error && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-2 text-center text-sm">
                {error}
              </div>
            )}
            <form action={signInWithEmail} className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  )
}
```

### `components/navigation/nav-user.tsx`

```tsx
"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import { signOut } from "@/app/(auth)/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={signOut} className="w-full">
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start p-0"
                    type="submit"
                  >
                    <LogOut />
                    Log out
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
```

### `components/plans/plan-form.tsx`

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"

import { createPlan, updatePlan } from "@/app/(main)/plans/actions"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Interfaces remain the same as they define the data structure
interface Task {
  id: string
  title: string
  status: string
  link?: string
  priority: string
  notes?: string
}

interface Contact {
  id: string
  name: string
  role: string
  email?: string
  phone?: string
  notes?: string
}

interface PlanFormProps {
  plan?: {
    id: string
    title: string
    start_date: string
    end_date: string
    status: string
    items?: Array<{
      type: string
      content: Task | Contact
      sort_order: number
    }>
  }
  isOwner?: boolean
}

export function PlanForm({ plan, isOwner = true }: PlanFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMobile = useIsMobile()
  
  const [title, setTitle] = useState(plan?.title || "")
  const [date, setDate] = useState<DateRange | undefined>({
    from: plan?.start_date ? new Date(plan.start_date) : undefined,
    to: plan?.end_date ? new Date(plan.end_date) : undefined,
  })

  const initialTasks: Task[] =
    plan?.items
      ?.filter((item): item is { type: 'task'; content: Task, sort_order: number } => item.type === 'task')
      .map(item => ({
        id: crypto.randomUUID(),
        title: item.content.title || '',
        status: item.content.status || 'pending',
        link: item.content.link || '',
        priority: item.content.priority || 'medium',
        notes: item.content.notes || '',
      })) || []

  const initialContacts: Contact[] =
    plan?.items
      ?.filter((item): item is { type: 'contact'; content: Contact, sort_order: number } => item.type === 'contact')
      .map(item => ({
        id: crypto.randomUUID(),
        name: item.content.name || '',
        role: item.content.role || '',
        email: item.content.email || '',
        phone: item.content.phone || '',
        notes: item.content.notes || '',
      })) || []

  const [tasks, setTasks] = useState<Task[]>(
    initialTasks.length > 0 ? initialTasks : [
      { id: crypto.randomUUID(), title: "", status: "pending", priority: "medium" }
    ]
  )

  const [contacts, setContacts] = useState<Contact[]>(
    initialContacts.length > 0 ? initialContacts : [
      { id: crypto.randomUUID(), name: "", role: "" }
    ]
  )

  const addTask = () => setTasks([...tasks, { id: crypto.randomUUID(), title: "", status: "pending", priority: "medium" }])
  const removeTask = (id: string) => tasks.length > 1 && setTasks(tasks.filter(task => task.id !== id))
  const updateTask = (id: string, field: keyof Task, value: string) => setTasks(tasks.map(task => task.id === id ? { ...task, [field]: value } : task))

  const addContact = () => setContacts([...contacts, { id: crypto.randomUUID(), name: "", role: "" }])
  const removeContact = (id: string) => contacts.length > 1 && setContacts(contacts.filter(contact => contact.id !== id))
  const updateContact = (id: string, field: keyof Contact, value: string) => setContacts(contacts.map(contact => contact.id === id ? { ...contact, [field]: value } : contact))

  const handleSubmit = async (action: 'draft' | 'publish') => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('start_date', date?.from?.toISOString() || '')
      formData.append('end_date', date?.to?.toISOString() || '')
      formData.append('status', action === 'publish' ? 'published' : 'draft')
      
      const taskItems = tasks.filter(task => task.title).map((task, index) => ({ type: 'task', content: task, sort_order: index }))
      const contactItems = contacts.filter(contact => contact.name).map((contact, index) => ({ type: 'contact', content: contact, sort_order: taskItems.length + index }))
      
      formData.append('items', JSON.stringify([...taskItems, ...contactItems]))
      
      if (plan?.id) {
        await updatePlan(plan.id, formData)
      } else {
        await createPlan(formData)
      }
      
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error saving plan:', error)
      // TODO: Show an error toast to the user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative">
      <div className="space-y-4 sm:space-y-8 pb-20 sm:pb-28">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b p-3 sm:p-6">
            <h2 className="text-lg font-semibold leading-none tracking-tight">Plan Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Basic information about your handover plan</p>
          </div>
          <div className="p-3 sm:p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="title" className="font-medium">
                  Plan Title <span className="text-destructive">*</span>
                </Label>
              </div>
              <Input
                id="title"
                placeholder="e.g., Q3 Marketing Campaign Handover"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">A clear and descriptive title for the plan.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="font-medium">
                  Coverage Period <span className="text-destructive">*</span>
                </Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal py-4 sm:py-6 text-base",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span className="text-muted-foreground">Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                The start and end date for the handover coverage.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold leading-none tracking-tight">Tasks & Projects</h2>
                  <p className="mt-1 text-sm text-muted-foreground">List all ongoing tasks and projects that require attention.</p>
                </div>
                <Button type="button" variant="outline" onClick={addTask} className="gap-2 w-full sm:w-auto hidden sm:flex">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
            <div className="p-3 sm:p-6 space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <div key={task.id} className="rounded-lg border bg-card p-3 sm:p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                        <h3 className="font-medium">Task</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} disabled={tasks.length === 1}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Task</span>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Project Alpha Migration"
                          value={task.title}
                          onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                          className="text-base"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div className="space-y-2 sm:col-span-1">
                          <Label>Status</Label>
                          <Select
                            value={task.status}
                            onValueChange={(value) =>
                              updateTask(task.id, "status", value)
                            }
                          >
                            <SelectTrigger className="w-full truncate-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-1">
                          <Label>Priority</Label>
                          <Select
                            value={task.priority}
                            onValueChange={(value) =>
                              updateTask(task.id, "priority", value)
                            }
                          >
                            <SelectTrigger className="w-full truncate-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Link/Reference (Optional)</Label>
                          <Input
                            placeholder="https://..."
                            value={task.link || ""}
                            onChange={(e) =>
                              updateTask(task.id, "link", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          placeholder="Additional details..."
                          value={task.notes || ""}
                          onChange={(e) => updateTask(task.id, 'notes', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No tasks added yet</p>
                </div>
              )}
            </div>
            <div className="p-3 sm:p-6 sm:hidden">
              <Button type="button" variant="outline" onClick={addTask} className="gap-2 w-full">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold leading-none tracking-tight">Important Contacts</h2>
                  <p className="mt-1 text-sm text-muted-foreground">List key people who can be contacted for specific issues.</p>
                </div>
                <Button type="button" variant="outline" onClick={addContact} className="gap-2 w-full sm:w-auto hidden sm:flex">
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            </div>
            <div className="p-3 sm:p-6 space-y-4">
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <div key={contact.id} className="rounded-lg border bg-card p-3 sm:p-5 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                        <h3 className="font-medium">Contact</h3>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeContact(contact.id)} disabled={contacts.length === 1}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Contact</span>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            placeholder="John Doe"
                            value={contact.name}
                            onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                            className="text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role/Department</Label>
                          <Input
                            placeholder="Engineering Lead"
                            value={contact.role}
                            onChange={(e) => updateContact(contact.id, 'role', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email (Optional)</Label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            value={contact.email || ""}
                            onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone (Optional)</Label>
                          <Input
                            placeholder="+1 (555) 123-4567"
                            value={contact.phone || ""}
                            onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes (Optional)</Label>
                        <Textarea
                          placeholder="Best for questions about..."
                          value={contact.notes || ""}
                          onChange={(e) => updateContact(contact.id, 'notes', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No contacts added yet</p>
                </div>
              )}
            </div>
            <div className="p-3 sm:p-6 sm:hidden">
              <Button type="button" variant="outline" onClick={addContact} className="gap-2 w-full">
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-background/95 backdrop-blur py-2 sm:py-4 mt-2">
        <div className="mx-auto flex w-full  flex-col sm:flex-row items-center justify-end gap-2 px-3">
          {!isMobile && (
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting} className="w-full sm:w-auto">
              Cancel
            </Button>
          )}
          {isOwner && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting || !title || !date?.from || !date?.to}
              className="w-full sm:w-auto px-4 sm:px-6"
            >
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </Button>
          )}
          <Button
            type="button"
            onClick={() => handleSubmit('publish')}
            disabled={isSubmitting || !title || !date?.from || !date?.to}
            className="w-full sm:w-auto px-4 sm:px-6"
          >
            {isSubmitting ? "Publishing..." : (plan?.id ? "Publish Changes" : "Publish Plan")}
          </Button>
        </div>
      </div>
    </form>
  )
}
```

### `lib/types.ts`

```ts
export interface Task {
  title: string
  notes?: string
  status: string
  priority: string
  link?: string
}

export interface Contact {
  name: string
  role?: string
  email?: string
  phone?: string
  notes?: string
}

export interface PlanItem {
  id: string
  type: "task" | "contact"
  content: Task | Contact
  sort_order: number
}
export interface PlanWithProfiles {
  id: string
  title: string
  start_date: string
  end_date: string
  status: string
  public_link_id: string
  created_at: string
  updated_at: string
  plan_items?: PlanItem[]
  profiles: { full_name: string }[] | null
}

export interface Collaborator {
  user_id: string
  role: 'viewer' | 'commenter' | 'editor'
  profile: {
    full_name: string | null
    avatar_url: string | null
    email: string | null
  } | null
}
```

### `app/(main)/dashboard/plans/[planId]/edit/page.tsx`

```tsx
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
```

### `app/(main)/dashboard/plans/[planId]/page.tsx`

```tsx
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
```

### `app/[publicLinkId]/page.tsx`

```tsx
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
```

### `app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Handover Plan";
const APP_DESCRIPTION =
  "Create, manage, and share clear handover plans to ensure smooth transitions while you're away. Take time off with peace of mind.";
const APP_URL = "https://handoverplan.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "Handover Plan Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["/web-app-manifest-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        {children}
        <Toaster richColors />
        <Analytics/>
      </body>
    </html>
  );
}
```

### `components/navigation/app-sidebar.tsx`

```tsx
"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  FileText,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react"

import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
import { Logo } from "@/components/logo"
import { FeedbackForm } from "@/components/feedback/feedback-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Plans",
      url: "/dashboard",
      icon: FileText,
      items: [
        {
          title: "All Plans",
          url: "/dashboard",
        },
        {
          title: "Create New Plan",
          url: "/dashboard/plans/new",
        },
      ],
    },
    {
      title: "Help & Support",
      url: "#",
      icon: HelpCircle,
      items: [
        {
          title: "Send Feedback",
          url: "/feedback",
        },
        {
          title: "FAQs",
          url: "#",
        },
      ],
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  
  // Update the navData to use the modal for Send Feedback
  const updatedNavData = {
    ...navData,
    navMain: navData.navMain.map(item => {
      if (item.title === "Help & Support") {
        return {
          ...item,
          items: item.items?.map(subItem => {
            if (subItem.title === "Send Feedback") {
              return {
                ...subItem,
                url: "#", // Use # instead of /feedback since we're opening a modal
                onClick: (e: React.MouseEvent) => {
                  e.preventDefault()
                  setFeedbackOpen(true)
                }
              }
            }
            return subItem
          })
        }
      }
      return item
    })
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <Logo className="size-8" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Handover Plan</span>
                  <span className="truncate text-xs">Handover Plans</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={updatedNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
      <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </Sidebar>
  )
}
```

### `package.json`

```json
{
  "name": "handoverplan",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@supabase/ssr": "^0.7.0",
    "@supabase/supabase-js": "^2.56.0",
    "@vercel/analytics": "^1.5.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.541.0",
    "next": "15.5.0",
    "react": "19.1.0",
    "react-day-picker": "^9.9.0",
    "react-dom": "19.1.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.0",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.7",
    "typescript": "^5"
  }
}

```

