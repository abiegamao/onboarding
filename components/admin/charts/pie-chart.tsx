"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
    type ChartConfig,
} from "@/components/ui/chart"

const phaseConfig = {
    clients: { label: "Clients" },
    connection: { label: "Connection", color: "#f1ddb0" },
    awareness: { label: "Awareness", color: "#d6b56c" },
    stabilization: { label: "Stabilization", color: "#b6954a" },
    activation: { label: "Activation", color: "#806b38" },
    completed: { label: "Completed", color: "#10b981" },
} satisfies ChartConfig

export function PhaseDistributionChart({
    data,
    loading,
}: {
    data: { phase: string; count: number }[]
    loading?: boolean
}) {
    const chartData = data.map((d) => ({
        phase: d.phase,
        key: d.phase.toLowerCase(),
        clients: d.count,
        fill: `var(--color-${d.phase.toLowerCase()})`,
    }))

    const total = React.useMemo(
        () => data.reduce((acc, d) => acc + d.count, 0),
        [data]
    )

    return (
        <Card className="rounded-2xl border border-[#b6954a]/15 bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b6954a]/50"></span>
                    <CardTitle className="font-mono text-[10px] font-normal tracking-[0.25em] text-muted-foreground/60 uppercase">
                        Phase Distribution
                    </CardTitle>
                </div>
                <CardDescription className="mt-1.5 text-xs text-muted-foreground/70">
                    Breakdown of current active clients grouped by their primary
                    engagement phase.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative flex-1 pt-4 pb-0">
                {loading ? (
                    <div className="absolute inset-0 flex animate-pulse items-center justify-center font-mono text-sm tracking-widest text-[#b6954a]/50 uppercase">
                        Loading…
                    </div>
                ) : (
                    <ChartContainer
                        config={phaseConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="clients"
                                nameKey="phase"
                                innerRadius={65}
                                strokeWidth={4}
                                stroke="var(--background)"
                                style={{
                                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))",
                                }}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (
                                            viewBox &&
                                            "cx" in viewBox &&
                                            "cy" in viewBox
                                        ) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-4xl font-extrabold tracking-tighter drop-shadow-sm"
                                                    >
                                                        {total}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className="fill-muted-foreground text-xs font-semibold tracking-wider uppercase"
                                                    >
                                                        Clients
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-wrap justify-center gap-x-5 gap-y-2 pt-6 pb-6">
                {data.map((d) => (
                    <span
                        key={d.phase}
                        className="flex items-center gap-2 text-xs font-medium text-muted-foreground/90 transition-colors hover:text-foreground"
                    >
                        <span
                            className="inline-block h-2.5 w-2.5 rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
                            style={{
                                background: (
                                    phaseConfig as Record<
                                        string,
                                        { color?: string }
                                    >
                                )[d.phase.toLowerCase()]?.color,
                            }}
                        />
                        {d.phase}
                        <span className="ml-0.5 font-bold text-foreground/80">
                            {d.count}
                        </span>
                    </span>
                ))}
            </CardFooter>
        </Card>
    )
}

export const description = "A donut chart with text"

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

export function ChartPieDonutText() {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut with Text</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Visitors
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}
