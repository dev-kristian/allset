"use client"

import * as React from "react"
import Link from "next/link"
import {
  Home,
  FileText,
  Plus,
  Settings,
  HelpCircle,
  GalleryVerticalEnd,
  LayoutDashboard,
  UserCircle,
  Bell,
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

// Define the actual navigation structure for Allset
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
                  <span className="truncate font-semibold">Allset</span>
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