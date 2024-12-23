"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import WebsiteEmbed from "@/components/webterminal";

export default function Page() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const router = useRouter(); // Access router
  if (activeComponent) {
    console.log('Active component:', activeComponent);
}
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
