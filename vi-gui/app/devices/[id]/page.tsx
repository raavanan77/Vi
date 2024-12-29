"use client";

import { use } from "react";
import MultipleSelectorControlled from "@/components/multi-selector";
import SelectDrop from "@/components/ui/groupeddropdown";

export default function Page({ params } : any) {

  const devicePlatform = use(params);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        
      </div>
      <MultipleSelectorControlled params={devicePlatform}/>
    </div>
  );
}
