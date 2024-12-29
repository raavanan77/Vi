"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Home,
  LogOut,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react"

const data = {
  user: {
    name: "raavanan",
    email: "",
    avatar: "/evvi.png",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Testcase",
          url: "/devices",
        },
        {
          title: "Testcase Builder",
          url: "/testcaseBuilder",
        },
      ],
    },
    {
      title: "Devices",
      url: "/devices",
      icon: Bot,
      items: [
        {
          title: "Add device",
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
