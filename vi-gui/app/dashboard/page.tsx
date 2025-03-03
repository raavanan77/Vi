"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", passed: 186, failed: 80 , unsupported:30, blocked: 50},
  { month: "February", passed: 305, failed: 200 },
  { month: "March", passed: 237, failed: 120 },
  { month: "April", passed: 73, failed: 190 },
  { month: "May", passed: 209, failed: 130 },
  { month: "June", passed: 214, failed: 140 },
]

const chartConfig = {
  passed: {
    label: "Passed",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-2))",
  },
  blocked: {
    label: "Blocked",
    color: "hsl(var(--chart-4))",
  },
  unsupported: {
    label: "NA",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function Dashboard() {
  return (
    <Card>
      <div className="grid auto-rows-min gap-4 md:grid-cols-5 p-5">
        <div className="p-2 aspect-video rounded-xl bg-muted/50" >
          <p>Total Testcase</p>
        </div>
        <div className="p-2 aspect-video rounded-xl bg-muted/50"> 
          <p>Passed</p>
        </div>
        <div className="p-2 aspect-video rounded-xl bg-muted/50"> 
          <p>Failed</p>
        </div>
        <div className="p-2 aspect-video rounded-xl bg-muted/50"> 
          <p>Blocked</p>
        </div>
        <div className="p-2 aspect-video rounded-xl bg-muted/50"> 
          <p>NA</p>
        </div>
      </div>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis values="No of Testcases" tickMargin={10}/>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="passed"
              stackId="a"
              fill="var(--color-passed)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="failed"
              stackId="a"
              fill="var(--color-failed)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="blocked"
              stackId="a"
              fill="var(--color-blocked)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="unsupported"
              stackId="a"
              fill="var(--color-unsupported)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
