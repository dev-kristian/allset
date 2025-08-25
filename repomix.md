# Repository Snapshot: allset

This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by the `repomix.py` script.

- **Purpose**: To provide a comprehensive context for AI systems (like LLMs) for analysis, code review, or other automated processes.
- **Total Files**: 36
- **Sorting**: Files are sorted by their Git change count, with the most frequently changed (and thus likely more important) files appearing at the end.

---

## Directory Structure

```
app/(auth)/actions.ts
app/(auth)/callback/route.ts
app/(auth)/login/page.tsx
app/(main)/dashboard/page.tsx
app/(main)/dashboard/plans/[planId]/edit/page.tsx
app/(main)/dashboard/plans/[planId]/not-found.tsx
app/(main)/dashboard/plans/[planId]/page.tsx
app/(main)/dashboard/plans/new/page.tsx
app/(main)/layout.tsx
app/(main)/plans/actions.ts
app/[publicLinkId]/loading.tsx
app/[publicLinkId]/not-found.tsx
app/[publicLinkId]/page.tsx
app/globals.css
app/layout.tsx
app/manifest.json
app/page.tsx
components/auth/login-form.tsx
components/icons.tsx
components/landing/cta.tsx
components/landing/faq.tsx
components/landing/features.tsx
components/landing/footer.tsx
components/landing/hero.tsx
components/landing/navbar.tsx
components/navigation/app-sidebar.tsx
components/navigation/nav-main.tsx
components/navigation/nav-user.tsx
components/plans/plan-form.tsx
components/plans/share-section.tsx
hooks/use-mobile.ts
lib/supabase/admin.ts
lib/supabase/client.ts
lib/supabase/server.ts
lib/types.ts
lib/utils.ts
```

---

## File Contents

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

### `app/manifest.json`

```json
{
  "name": "Handover Plan",
  "short_name": "HP",
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

### `app/(main)/dashboard/plans/[planId]/not-found.tsx`

```tsx
import Link from "next/link"
import { FileX } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <FileX className="h-16 w-16 text-muted-foreground" />
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Plan not found</h2>
        <p className="text-muted-foreground mt-2">
          The plan you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Link href="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  )
}
```

### `components/auth/login-form.tsx`

```tsx
"use client"

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
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
```

### `components/plans/share-section.tsx`

```tsx
"use client"

import { useState } from "react"
import { Share2, Copy, Check, Mail, MessageSquare } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShareSectionProps {
  publicUrl: string
}

export function ShareSection({ publicUrl }: ShareSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const emailSubject = encodeURIComponent("Handover Plan")
  const emailBody = encodeURIComponent(
    `I've shared my handover plan with you. You can view it here:\n\n${publicUrl}\n\nThis plan contains all the necessary information for my absence period.`
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Share Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this plan</DialogTitle>
          <DialogDescription>
            Anyone with this link can view your published handover plan.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="share">Share Via</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={publicUrl}
                  readOnly
                  className="text-sm"
                />
              </div>
              <Button 
                type="button" 
                size="sm" 
                className="px-3"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link will remain active as long as the plan is published.
            </p>
          </TabsContent>
          
          <TabsContent value="share" className="space-y-3">
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start"
                asChild
              >
                <a
                  href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </a>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start"
                asChild
              >
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my handover plan: ${publicUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share via WhatsApp
                </a>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start"
                asChild
              >
                <a
                  href={`https://teams.microsoft.com/share?href=${encodeURIComponent(publicUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share via Teams
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
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

### `components/navigation/nav-user.tsx`

```tsx
"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import { signOut } from "@/app/(auth)/actions"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
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
    items?: {
      title: string
      url: string
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
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
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
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
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

### `app/(main)/plans/actions.ts`

```ts
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { PlanItem } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"

// Helper function to generate unique public link IDs
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
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Extract form data
  const title = formData.get("title") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const status = formData.get("status") as string
  const itemsJson = formData.get("items") as string
  
  const items = JSON.parse(itemsJson)

  // Generate public link ID if publishing
  let public_link_id = null
  if (status === 'published') {
    public_link_id = generatePublicLinkId()
  }

  // Start a transaction by inserting the plan first
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

  // Insert plan items if there are any
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
      // Consider rolling back the plan creation here
      throw new Error("Failed to create plan items")
    }
  }

  revalidatePath("/dashboard")
  redirect(`/dashboard/plans/${plan.id}`)
}

export async function updatePlan(planId: string, formData: FormData) {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("Unauthorized")
  }

  // Extract form data
  const title = formData.get("title") as string
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const status = formData.get("status") as string
  const itemsJson = formData.get("items") as string
  
  const items = JSON.parse(itemsJson)

  // Generate public link ID if publishing for the first time
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

  // Check if we need to generate a public link
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

  // Update the plan
  const { error: planError } = await supabase
    .from("plans")
    .update(updateData)
    .eq("id", planId)
    .eq("author_id", user.id) // Ensure user owns this plan

  if (planError) {
    console.error("Error updating plan:", planError)
    throw new Error("Failed to update plan")
  }

  // Delete existing items and insert new ones
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

  // Check if already has a public link
  const { data: existingPlan } = await supabase
    .from("plans")
    .select("public_link_id, status")
    .eq("id", planId)
    .single()

  // If already published, just redirect
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
    .eq("author_id", user.id)

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

  const { error } = await supabase
    .from("plans")
    .delete()
    .eq("id", planId)
    .eq("author_id", user.id)

  if (error) {
    console.error("Error deleting plan:", error)
    throw new Error("Failed to delete plan")
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
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

### `components/landing/footer.tsx`

```tsx
import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
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
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
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

### `app/[publicLinkId]/not-found.tsx`

```tsx
import Link from "next/link"
import { FileX, Home, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd } from "lucide-react"

export default function PublicNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="text-lg font-bold">HandoverPlan</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="rounded-full bg-muted p-6">
            <FileX className="h-16 w-16 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Plan Not Found</h1>
            <p className="text-muted-foreground max-w-md">
              This handover plan doesn&apos;t exist or is no longer available. 
              It may have been removed or the link might be incorrect.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/login">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 max-w-md">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> If you&apos;re expecting to see a plan here, 
              please double-check the link or contact the person who shared it with you.
            </p>
          </div>
        </div>
      </main>
    </div>
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
  image: {
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
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Screenshot of the HandoverPlan application dashboard.",
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
          <Image
            src={image.src}
            alt={image.alt}
            width={1024}
            height={576}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  )
}

export { Hero }
```

### `components/navigation/app-sidebar.tsx`

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileText,
  HelpCircle,
  GalleryVerticalEnd,
  LayoutDashboard,
  UserCircle,
} from "lucide-react"

import { NavMain } from "@/components/navigation/nav-main"
import { NavUser } from "@/components/navigation/nav-user"
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

// Define the actual navigation structure for HandoverPlan
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
      title: "Account",
      url: "#",
      icon: UserCircle,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Help & Support",
      url: "#",
      icon: HelpCircle,
      items: [
        {
          title: "Documentation",
          url: "#",
        },
        {
          title: "Contact Support",
          url: "#",
        },
        {
          title: "FAQs",
          url: "#",
        },
      ],
    },
  ],
}

// Define user prop type
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">HandoverPlan</span>
                  <span className="truncate text-xs">Handover Plans</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
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

### `app/[publicLinkId]/page.tsx`

```tsx
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
import { PlanItem, Task, Contact } from "@/lib/types"
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
    ?.filter((item: PlanItem) => item.type === "task")
    ?.sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []
  
  const contacts = plan.plan_items
    ?.filter((item: PlanItem) => item.type === "contact")
    ?.sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []

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
            <span className="text-lg font-bold">HandoverPlan</span>
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
                {tasks.map((item: PlanItem, index: number) => (
                  <TaskCard key={item.id} task={item.content as Task} index={index} />
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
                {contacts.map((item: PlanItem) => (
                  <ContactCard key={item.id} contact={item.content as Contact} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>This handover plan was created using HandoverPlan</p>
          <p className="mt-1">
            Published on {format(new Date(plan.updated_at), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </main>
    </div>
  )
}

// Task Card Component
function TaskCard({ task, index }: { task: Task; index: number }) {
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
function ContactCard({ contact }: { contact: Contact }) {
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

### `app/(auth)/login/page.tsx`

```tsx
import { Suspense } from "react"
import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
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
    .eq("id", params.planId)
    .eq("author_id", user.id)
    .single()

  if (planError || !plan) {
    notFound()
  }

  // Don't allow editing published plans
  if (plan.status === "published") {
    redirect(`/dashboard/plans/${params.planId}`)
  }

  // Transform the data to match the PlanForm component's expected format
  const planData = {
    id: plan.id,
    title: plan.title,
    start_date: plan.start_date,
    end_date: plan.end_date,
    status: plan.status,
    items: plan.plan_items?.sort((a: PlanItem, b: PlanItem) => a.sort_order - b.sort_order) || []
  }

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
                <BreadcrumbLink href={`/dashboard/plans/${params.planId}`}>
                  {plan.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/plans/${params.planId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Plan
                </Button>
              </Link>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Plan</h1>
              <p className="text-muted-foreground">
                Make changes to your handover plan
              </p>
            </div>
          </div>
          
          <PlanForm plan={planData} />
        </div>
      </div>
    </>
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
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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

### `app/(main)/dashboard/plans/[planId]/page.tsx`

```tsx
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

### `app/(main)/dashboard/page.tsx`

```tsx
import { redirect } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { 
  Plus, 
  FileText, 
  Globe, 
  FileArchive,
  Clock,
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

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const userName = user.user_metadata?.full_name ?? user.email ?? "User"

  // Fetch user's plans
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  // Calculate statistics
  const totalPlans = plans?.length || 0
  const publishedPlans = plans?.filter(p => p.status === "published").length || 0
  const draftPlans = plans?.filter(p => p.status === "draft").length || 0
  
  // Get active plans (where current date is between start and end date)
  const today = new Date()
  const activePlans = plans?.filter(p => {
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
      
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Welcome Section */}
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

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Plans
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlans}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedPlans}</div>
              <p className="text-xs text-muted-foreground">
                Publicly shared
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Drafts
              </CardTitle>
              <FileArchive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftPlans}</div>
              <p className="text-xs text-muted-foreground">
                Work in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Now
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePlans}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Plans Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Your Plans</h2>
            {plans && plans.length > 0 && (
              <Badge variant="secondary">{totalPlans} total</Badge>
            )}
          </div>

          {plans && plans.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const startDate = new Date(plan.start_date)
                const endDate = new Date(plan.end_date)
                const isActive = today >= startDate && today <= endDate && plan.status === "published"
                const isUpcoming = today < startDate && plan.status === "published"
                
                return (
                  <Link key={plan.id} href={`/dashboard/plans/${plan.id}`}>
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
                            <CardTitle className="line-clamp-1">
                              {plan.title}
                            </CardTitle>
                            <CardDescription>
                              {format(startDate, "MMM d")} -{" "}
                              {format(endDate, "MMM d, yyyy")}
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
              })}
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
      </div>
    </>
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

### `components/plans/plan-form.tsx`

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2, GripVertical } from "lucide-react"

import { createPlan, updatePlan } from "@/app/(main)/plans/actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
}

export function PlanForm({ plan }: PlanFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form state
  const [title, setTitle] = useState(plan?.title || "")
  const [startDate, setStartDate] = useState<Date | undefined>(
    plan?.start_date ? new Date(plan.start_date) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    plan?.end_date ? new Date(plan.end_date) : undefined
  )

  // Initialize tasks and contacts from plan items if editing
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

  // Task management functions
  const addTask = () => {
    setTasks([
      ...tasks,
      { id: crypto.randomUUID(), title: "", status: "pending", priority: "medium" }
    ])
  }

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  const updateTask = (id: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ))
  }

  // Contact management functions
  const addContact = () => {
    setContacts([
      ...contacts,
      { id: crypto.randomUUID(), name: "", role: "" }
    ])
  }

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(contact => contact.id !== id))
    }
  }

  const updateContact = (id: string, field: keyof Contact, value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ))
  }

  // Form submission
  const handleSubmit = async (action: 'draft' | 'publish') => {
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('start_date', startDate?.toISOString() || '')
      formData.append('end_date', endDate?.toISOString() || '')
      formData.append('status', action === 'publish' ? 'published' : 'draft')
      
      // Add tasks as JSON
      const taskItems = tasks
        .filter(task => task.title) // Only include tasks with titles
        .map((task, index) => ({
          type: 'task',
          content: task,
          sort_order: index
        }))
      
      // Add contacts as JSON
      const contactItems = contacts
        .filter(contact => contact.name) // Only include contacts with names
        .map((contact, index) => ({
          type: 'contact',
          content: contact,
          sort_order: taskItems.length + index
        }))
      
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
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Information</CardTitle>
          <CardDescription>
            Set up the basic details for your handover plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Plan Title</Label>
            <Input
              id="title"
              placeholder="Q1 2024 Handover Plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks/Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks & Projects</CardTitle>
          <CardDescription>
            List all tasks and projects that need attention during your absence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Task {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(task.id)}
                  disabled={tasks.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Project Alpha Migration"
                    value={task.title}
                    onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={task.status}
                    onValueChange={(value) => updateTask(task.id, 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={task.priority}
                    onValueChange={(value) => updateTask(task.id, 'priority', value)}
                  >
                    <SelectTrigger>
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
                
                <div className="space-y-2">
                  <Label>Link/Reference</Label>
                  <Input
                    placeholder="https://..."
                    value={task.link || ""}
                    onChange={(e) => updateTask(task.id, 'link', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Additional details..."
                  value={task.notes || ""}
                  onChange={(e) => updateTask(task.id, 'notes', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addTask}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardContent>
      </Card>

      {/* Contacts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Important Contacts</CardTitle>
          <CardDescription>
            People who should be contacted for specific issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={contact.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Contact {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(contact.id)}
                  disabled={contacts.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={contact.name}
                    onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
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
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={contact.email || ""}
                    onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={contact.phone || ""}
                    onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Best for questions about..."
                  value={contact.notes || ""}
                  onChange={(e) => updateContact(contact.id, 'notes', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addContact}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleSubmit('draft')}
          disabled={isSubmitting || !title || !startDate || !endDate}
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit('publish')}
          disabled={isSubmitting || !title || !startDate || !endDate}
        >
          {isSubmitting ? "Publishing..." : "Publish Plan"}
        </Button>
      </div>
    </div>
  )
}
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

### `components/landing/navbar.tsx`

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { GalleryVerticalEnd, Menu, X } from "lucide-react"

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
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
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


```

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full">
      <head><meta name="apple-mobile-web-app-title" content="Handover" /></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}
      >
        {children}
      </body>
    </html>
  );
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
          image={{
            src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
            alt: "Screenshot of the HandoverPlan application dashboard showing handover plans.",
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

