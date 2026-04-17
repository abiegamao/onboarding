"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
        color: "#b6954a", // Premium gold
    },
} satisfies ChartConfig

export function RegistrationAreaChart({
    data,
    loading,
}: {
    data: { week: string; count: number }[]
    loading?: boolean
}) {
    return (
        <Card className="rounded-2xl border border-[#b6954a]/15 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CardHeader className="p-6 pb-0">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b6954a]/50"></span>
                    <CardTitle className="font-mono text-[10px] font-normal tracking-[0.25em] text-muted-foreground/60 uppercase">
                        New Registrations (8 weeks)
                    </CardTitle>
                </div>
                <CardDescription className="mt-1.5 text-xs text-muted-foreground/70">
                    Weekly volume of inbound clients flowing into the pathway.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative p-6 pt-4">
                {loading ? (
                    <div className="absolute inset-0 flex animate-pulse items-center justify-center font-mono text-sm tracking-widest text-[#b6954a]/50 uppercase">
                        Loading…
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[180px] w-full"
                    >
                        <AreaChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                left: -20,
                                right: 10,
                                top: 10,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="var(--border)"
                                strokeOpacity={0.5}
                                strokeDasharray="3 3"
                            />
                            <XAxis
                                dataKey="week"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tick={{
                                    fill: "var(--muted-foreground)",
                                    fontSize: 10,
                                    fontWeight: 500,
                                }}
                                tickFormatter={(v) =>
                                    typeof v === "string" ? v.slice(5) : v
                                }
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{
                                    fill: "var(--muted-foreground)",
                                    fontSize: 10,
                                }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <ChartTooltip
                                cursor={{
                                    stroke: "rgba(182,149,74,0.2)",
                                    strokeWidth: 1,
                                }}
                                content={
                                    <ChartTooltipContent indicator="line" />
                                }
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="#b6954a"
                                fillOpacity={0.4}
                                stroke="#b6954a"
                                strokeWidth={2}
                                activeDot={{
                                    r: 5,
                                    strokeWidth: 0,
                                    fill: "#f1ddb0",
                                }}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
