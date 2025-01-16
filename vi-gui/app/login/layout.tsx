"use client";

import localFont from "next/font/local";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
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
        router.push("/testcases");
        break;
      default:
        router.push("/");
    }
  };

  const { toasts } = useToast()
  return (
    
    <html lang="en">
      <body
      >
      <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      >
        <header className="flex h-12 shrink-0 items-center gap-2 border-b">
        </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              {children}
            </div>
          </div>
      </ThemeProvider>
      </body>
    </html>
  );
}
