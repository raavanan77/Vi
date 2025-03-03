import * as React from "react";
import {
  BookOpen,
  Bot,
  FileTerminal,
  icons,
  LogOut,
  Router,
  Settings,
  SquareTerminal,
  WaypointsIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
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

const data = {
  navMain: [
    {
      title: "Test Script",
      url: "#",
      icon: FileTerminal,
      items: [
        {
          title: "Scripts",
          url: "/testcases",
        },
      ],
    },
    {
      title: "Devices",
      url: "/devices",
      icon: Router,
      items: [
        {
          title: "Device List",
          url: "/devices",
        },
        {
          title: "DUT Profiles",
          url: "/devices/dutprofiles",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
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
      title: "API Docs",
      url: "/docs/api",
      icon: WaypointsIcon,
    },
  ],
};

export function AppSidebar({
  onNavItemClick,
  ...props
}: { onNavItemClick: (title: string) => void } & React.ComponentProps<
  typeof Sidebar
>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="https://github.com/raavanan77/Vi/blob/master/vi-gui/components/evvi.png?raw=true"
                      alt="logo"
                    />
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
        
      </SidebarFooter>
    </Sidebar>
  );
}
