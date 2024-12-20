"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LogOut,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Home,
} from "lucide-react"
import Link from 'next/link';
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import image from '../app/evvi.png'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const data = {
  user: {
    name: "raavanan",
    email: "",
    avatar: "/evvi.png",
  },
  navMain: [
    {
      title: "Execution",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Testcase",
          url: "/testcase",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Devices",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Add device",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "System Config",
          url: "#",
        },
        {
          title: "Device Config",
          url: "#",
        },
        {
          title: "User",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Logout",
      url: "/",
      icon: LogOut,
    },
  ],
}

export function AppSidebar({
  onNavItemClick,
  ...props
}: { onNavItemClick: (title: string) => void } & React.ComponentProps<typeof Sidebar>) {
  const [activePage, setActivePage] = React.useState<string | null>(null)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src='https://nextjs.org/icons/next.svg' alt='logo' />
                  <AvatarFallback className="rounded-lg">Vi</AvatarFallback>
                </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Vi</span>
                  <span className="truncate text-xs">Automation Tool</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onItemClick={onNavItemClick} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
