import {
    Cell,
    Label,
    Pie,
    PieChart,
    ResponsiveContainer,
    Sector
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

const palette = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6"];

const newLeadByMonthData = [
    { month: "january", newLeads: Math.floor(Math.random() * 500) + 50, fill: palette[1] },
    { month: "february", newLeads: Math.floor(Math.random() * 500) + 50, fill: palette[2] },
    { month: "march", newLeads: Math.floor(Math.random() * 500) + 50, fill: palette[3] },
    { month: "april", newLeads: Math.floor(Math.random() * 500) + 50, fill: palette[4] },
    { month: "may", newLeads: Math.floor(Math.random() * 500) + 50, fill: palette[5] },
];

const newLeadByMonthChartConfig = {
    newLeads: {
        label: "New Leads",
    },
    january: {
        label: "January",
        color: palette[1],
    },
    february: {
        label: "February",
        color: palette[2],
    },
    march: {
        label: "March",
        color: palette[3],
    },
    april: {
        label: "April",
        color: palette[4],
    },
}

const NewLeadsPieChart = () => {
    const id = "pie-interactive";

    const [activeMonth, setActiveMonth] = useState(newLeadByMonthData[0].month);

    const activeIndex = useMemo(
        () => newLeadByMonthData.findIndex((item) => item.month === activeMonth),
        [activeMonth]
    );

    const months = useMemo(() => newLeadByMonthData.map((item) => item.month), []);
    return (
        <ResponsiveContainer width="100%" height={200}>
            <div className="flex items-start">
                <ChartContainer
                    id={id}
                    config={newLeadByMonthChartConfig}
                    className="mx-auto aspect-square w-full max-w-[200px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={newLeadByMonthData}
                            dataKey="newLeads"
                            nameKey="month"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={({ outerRadius = 0, ...props }) => (
                                <g>
                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 25}
                                        innerRadius={outerRadius + 12}
                                    />
                                </g>
                            )}
                        >
                            {newLeadByMonthData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-slate-900 dark:fill-slate-50"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="text-3xl font-bold"
                                                >
                                                    {newLeadByMonthData[activeIndex].newLeads.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                >
                                                    New Leads
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>

                <Select value={activeMonth} onValueChange={setActiveMonth}>
                    <SelectTrigger
                        className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {months.map((key) => {
                            const config = newLeadByMonthChartConfig[key];
                            if (!config) {
                                return null;
                            }
                            return (
                                <SelectItem
                                    key={key}
                                    value={key}
                                    className="rounded-lg [&_span]:flex"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="flex h-3 w-3 shrink-0 rounded-sm"
                                            style={{
                                                backgroundColor: newLeadByMonthChartConfig[key].color,
                                            }}
                                        />
                                        {config?.label}
                                    </div>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
        </ResponsiveContainer>
    )
}

export default NewLeadsPieChart
