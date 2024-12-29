"use client";

//import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { boolean } from "zod";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
if (geistSans&& geistMono) {
  console.log('Active component');
}

//export const metadata: Metadata = {
//  title: "Vi",
//  description: "Built with sadness",
//};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLogin, setLogin] = useState<boolean>();
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
        router.push("/devices");
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
    
    <html lang="en">
      <body
      >
      <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      >
      <SidebarProvider>
        <AppSidebar onNavItemClick={handleNavItemClick}/>
        <SidebarInset>
        <header className="flex h-4 shrink-0 items-center gap-2"></header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
        <Toaster/>
      </ThemeProvider>
      </body>
    </html>
  );
}
