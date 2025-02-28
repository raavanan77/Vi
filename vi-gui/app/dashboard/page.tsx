"use client"
import { Card } from "@/components/ui/card";
import TestcaseExecutor from "../testcases/testcaseExecutor";

export default function Page() {
  return (
    <Card className="w-full">
      <TestcaseExecutor params={"OpenWRT"}/>
    </Card>
  );
}
