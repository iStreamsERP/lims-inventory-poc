import {
    Label,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart
} from "recharts";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";

const palette = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6"];

const totalSales = 700;
const target = 1500;
const percentage = (totalSales / target) * 100;
const remaining = 100 - percentage;

const salesTargetChartConfig = {
    sales: {
        label: "Total Sales",
        color: palette[0],
    },
};

const salesTargetChartData = [
    {
        month: "january",
        totalSales,
        target,
        percentage,
        remaining,
    },
];

const SalesTargetChart = () => {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-start pb-0">
                <CardTitle>Sales Target</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={salesTargetChartData}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={salesTargetChartData}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" className="fill-slate-900 dark:fill-slate-50">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 20}
                                                    className="text-2xl font-bold"
                                                >
                                                    {formattedPercentage}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy || 0}
                                                    className="text-sm"
                                                >
                                                    out of {target}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        {/* Achieved portion (using the first palette color) */}
                        <RadialBar
                            dataKey="percentage"
                            stackId="a"
                            cornerRadius={5}
                            fill={palette[0]}
                            className="stroke-transparent stroke-2"
                        />
                        {/* Remaining portion */}
                        <RadialBar
                            dataKey="remaining"
                            stackId="a"
                            cornerRadius={5}
                            fill="#f3f4f6"
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default SalesTargetChart
