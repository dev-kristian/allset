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