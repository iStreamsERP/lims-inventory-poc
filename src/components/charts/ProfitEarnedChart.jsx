import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis
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
    ChartTooltipContent,
} from "@/components/ui/chart";




const profitEarnedChartData = [
    { month: "January", profitEarned: Math.floor(Math.random() * 500) + 50, totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "February", profitEarned: Math.floor(Math.random() * 500) + 50, totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "March", profitEarned: Math.floor(Math.random() * 500) + 50, totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "April", profitEarned: Math.floor(Math.random() * 500) + 50, totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "May", profitEarned: Math.floor(Math.random() * 500) + 50, totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "June", profitEarned: Math.floor(Math.random() * 500) + 50, totalSales: Math.floor(Math.random() * 500) + 50 },
]

const profitEarnedChartConfig = {
    profitEarned: {
        label: "Profit Earned",
    },
    totalSales: {
        label: "Total Sales",
    },
}
const ProfitEarnedChart = () => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <ChartContainer config={profitEarnedChartConfig}>
                <BarChart accessibilityLayer data={profitEarnedChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="profitEarned" fill="#3b82f6" radius={4} />
                    <Bar dataKey="totalSales" fill="#a2d2ff" radius={4} />
                </BarChart>
            </ChartContainer>
        </ResponsiveContainer>
    )
}

export default ProfitEarnedChart
