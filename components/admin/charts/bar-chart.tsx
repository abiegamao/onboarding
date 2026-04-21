"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

const funnelConfig = {
    count: {
        label: "Clients",
        color: "#b6954a",
    },
    label: {
        color: "var(--background)",
    },
} satisfies ChartConfig

export function StepFunnelChart({
    data,
    loading,
}: {
    data: { step: string; count: number }[]
    loading?: boolean
}) {
    return (
        <Card className="flex h-full flex-col rounded-2xl border border-[#b6954a]/15 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CardHeader className="shrink-0 pb-2">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b6954a]/50"></span>
                    <CardTitle className="font-mono text-[10px] font-normal tracking-[0.25em] text-muted-foreground/60 uppercase">
                        Step Funnel — Drop-off
                    </CardTitle>
                </div>
                <CardDescription className="mt-1.5 text-xs text-muted-foreground/70">
                    Track client progression and identify drop-off points in the
                    onboarding workflow.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative min-h-0 flex-1 pt-4">
                {loading ? (
                    <div className="absolute inset-0 flex animate-pulse items-center justify-center font-mono text-sm tracking-widest text-[#b6954a]/50 uppercase">
                        Loading…
                    </div>
                ) : (
                    <ChartContainer
                        config={funnelConfig}
                        className="h-full w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={data}
                            layout="vertical"
                            margin={{ right: 16 }}
                            barCategoryGap="6%"
                            barSize={50}
                        >
                            <CartesianGrid
                                horizontal={false}
                                strokeDasharray="3 3"
                                stroke="var(--border)"
                                strokeOpacity={0.5}
                            />
                            <YAxis
                                dataKey="step"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                hide
                            />
                            <XAxis dataKey="count" type="number" hide />
                            <ChartTooltip
                                cursor={{ fill: "rgba(182,149,74,0.05)" }}
                                content={
                                    <ChartTooltipContent indicator="line" />
                                }
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={4}
                            >
                                <LabelList
                                    dataKey="step"
                                    position="insideLeft"
                                    offset={10}
                                    className="fill-(--color-label) font-medium"
                                    fontSize={11}
                                />
                                <LabelList
                                    dataKey="count"
                                    position="right"
                                    offset={10}
                                    className="fill-foreground font-bold"
                                    fontSize={11}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
