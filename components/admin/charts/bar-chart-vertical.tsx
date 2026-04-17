"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
        label: "Completions",
        color: "#10b981", // Emerald green for success
    },
} satisfies ChartConfig

export function CompletionsBarChart({
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
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                    <CardTitle className="font-mono text-[10px] font-normal tracking-[0.25em] text-muted-foreground/60 uppercase">
                        Completions (8 weeks)
                    </CardTitle>
                </div>
                <CardDescription className="mt-1.5 text-xs text-muted-foreground/70">
                    Weekly volume of clients successfully finishing the pathway.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative p-6 pt-4">
                {loading ? (
                    <div className="absolute inset-0 flex animate-pulse items-center justify-center font-mono text-sm tracking-widest text-[#10b981]/50 uppercase">
                        Loading…
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[180px] w-full"
                    >
                        <BarChart
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
                                tickMargin={10}
                                axisLine={false}
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
                                cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="count"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                fillOpacity={0.8}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
