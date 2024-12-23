"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MultipleSelectorControlled from "@/components/multi-selector";

export default function Page() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const router = useRouter(); // Access router
  if (activeComponent) {
    console.log('Active component:', activeComponent);
}
  const handleNavItemClick = (title: string) => {
    console.log(title);
    setActiveComponent(title); // Update the active component
    // Navigate to corresponding route based on the sidebar item clicked
    switch (title) {
      case "Testcase":
        router.push("/testcase");
        break;
      case "Devices":
        router.push("/devices");
        break;
      case "Documentation":
        router.push("/documentation");
        break;
      case "Settings":
        router.push("/settings");
        break;
      default:
        router.push("/");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar onNavItemClick={handleNavItemClick} />
          <SidebarInset>
            <header className="flex h-4 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4"></div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              <MultipleSelectorControlled/>
              </div>
            </div>
          </SidebarInset>
    </SidebarProvider>
  );
}
