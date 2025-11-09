"use client"

import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const complianceChartData = [
  { framework: "ISO 27001", compliance: 82, fill: "var(--color-iso)" },
  { framework: "NIST", compliance: 78, fill: "var(--color-nist)" },
  { framework: "CIS", compliance: 95, fill: "var(--color-cis)" },
  { framework: "Custom", compliance: 60, fill: "var(--color-custom)" },
]

const complianceChartConfig = {
  compliance: {
    label: "Compliance",
  },
  iso: {
    label: "ISO 27001",
    color: "hsl(var(--chart-1))",
  },
  nist: {
    label: "NIST",
    color: "hsl(var(--chart-2))",
  },
  cis: {
    label: "CIS",
    color: "hsl(var(--chart-3))",
  },
  custom: {
    label: "Custom",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const riskChartData = [
  { risk: "Critical", assets: 5, fill: "var(--color-critical)" },
  { risk: "High", assets: 12, fill: "var(--color-high)" },
  { risk: "Medium", assets: 34, fill: "var(--color-medium)" },
  { risk: "Low", assets: 56, fill: "var(--color-low)" },
]

const riskChartConfig = {
  assets: {
    label: "Assets",
  },
  critical: {
    label: "Critical",
    color: "hsl(var(--destructive))",
  },
  high: {
    label: "High",
    color: "hsl(var(--chart-4))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-3))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export function DashboardCharts() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Compliance Posture</CardTitle>
                <CardDescription>Compliance percentage by framework</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={complianceChartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={complianceChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="framework"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="compliance" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  Overall compliance is trending up by 3.2% this month.
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing data for all monitored assets.
                </div>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Number of assets by risk classification</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={riskChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={riskChartData}
                      dataKey="assets"
                      nameKey="risk"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                       {riskChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="risk" />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
               <CardFooter className="flex-col gap-2 text-sm">
                 <div className="flex items-center gap-2 font-medium leading-none">
                  5 critical risk assets require immediate attention.
                </div>
                 <div className="leading-none text-muted-foreground">
                  Drill down to view specific assets.
                </div>
               </CardFooter>
            </Card>
        </div>
    )
}
