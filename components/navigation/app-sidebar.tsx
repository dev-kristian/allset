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
          url: "/faq", // <-- Updated link
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