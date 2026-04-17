"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Registrations",
    color: "#b6954a", // Gold branding
  },
} satisfies ChartConfig

export function RegistrationRadarChart({ 
    data, 
    loading 
}: { 
    data: { week: string; count: number }[]
    loading?: boolean 
}) {
  return (
    <Card className="rounded-2xl border border-[#b6954a]/15 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b6954a]/50"></span>
            <CardTitle className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-normal">
              New Registrations (8 weeks)
            </CardTitle>
        </div>
        <CardDescription className="text-xs mt-1.5 text-muted-foreground/70">
          Weekly volume of inbound clients starting their pathway, mapped across multiple axes.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-1 flex flex-col justify-center relative min-h-[220px]">
        {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[#b6954a]/50 animate-pulse font-mono tracking-widest uppercase">
                Loading…
            </div>
        ) : (
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-video max-h-[250px] w-full"
            >
                <RadarChart data={data}>
                    <ChartTooltip 
                        cursor={false} 
                        content={<ChartTooltipContent indicator="line" />} 
                    />
                    <PolarGrid
                        className="fill-[#b6954a] opacity-[0.03]"
                        gridType="circle"
                        stroke="var(--border)"
                        strokeOpacity={0.5}
                    />
                    <PolarAngleAxis 
                        dataKey="week" 
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 500 }}
                        tickFormatter={(v) => typeof v === 'string' ? v.slice(5) : v}
                    />
                    <Radar
                        dataKey="count"
                        fill="#b6954a"
                        fillOpacity={0.2}
                        stroke="#d6b56c"
                        strokeWidth={2.5}
                    />
                </RadarChart>
            </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
