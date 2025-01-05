"use client";

import { use } from "react";
import TestcaseExecutor from "@/app/testcases/testcaseExecutor";

export default function Page({ params } : any) {

  const devicePlatform = use(params);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <TestcaseExecutor params={devicePlatform}/>
    </div>
  );
}
