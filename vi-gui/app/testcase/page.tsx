"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { timeLog } from "console";
import { title } from "process";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import TerminalComponent from "@/components/xterm";
import WebsiteEmbed from "@/components/webterminal";
export default function Page() {
  const [data, setData] = useState<any[] | null>(null);
  const [tclist, setTClist] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://172.16.0.189:8000/api/testcase/fetch/Linux?format=json"
      );
      if (!response.ok) {
        throw new Error("No response");
      }
      const result = await response.json();
      console.log("Response:", result);
      if (Array.isArray(result)) {
        setData(result); // Directly set the result (which is an array of objects)
      } else {
        console.error("Unexpected response format", result);
        setData([]); // Handle unexpected response
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setData(null); // Ensure data is null on error
    } finally {
      setLoading(false);
    }
  };
  const selectedcase = {
    
  }
  useEffect(() => {
    fetchData();
  }, []);

  function onItemClick(title: any) {
    setTClist(title);
    console.log(tclist)
  }

  return (
    <SidebarProvider>
      <AppSidebar onNavItemClick={handleNavItemClick}/>
      <ResizablePanelGroup direction="vertical" className="min-h-[100vh]  rounded-lg border md:min-w-min">
        <ResizablePanel defaultSize={100}>
          <SidebarInset>
            <header className="flex h-4 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4"></div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <Command>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <CommandList>
                    {loading ? (
                      <p>Loading...</p>
                    ) : data === null ? (
                      <p>Error loading data.</p>
                    ) : data.length > 0 ? (
                      data.map((testcase, index) => (
                        <Label key={index} onClick={(e) => {
                          e.preventDefault();
                          onItemClick(testcase.testcaseName);
                        }}>
                          <CommandItem key={index}>{testcase.testcaseName}</CommandItem>
                        </Label>
                      ))
                    ) : (
                      <p>No data available</p>
                    )}
                    </CommandList>
                  </ScrollArea>
                  <CommandInput placeholder="Type a command or search..."/>
                  <Input/>
                </Command>
              </div>
              <div className="p-4">
              </div>
              </div>
          </SidebarInset>
        </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <WebsiteEmbed/>
      </ResizablePanel>
      </ResizablePanelGroup>
    </SidebarProvider>
  );
}
