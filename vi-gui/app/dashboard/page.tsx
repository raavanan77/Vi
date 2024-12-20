"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const router = useRouter(); // Access router

  const handleNavItemClick = (title: string) => {
    console.log(title)
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
      <AppSidebar onNavItemClick={handleNavItemClick}/>
    </SidebarProvider>
  );
}
