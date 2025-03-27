import {
    Bar,
    BarChart,
    CartesianGrid,
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
    { month: "January", profitEarned: 186, totalSales: 80 },
    { month: "February", profitEarned: 305, totalSales: 200 },
    { month: "March", profitEarned: 237, totalSales: 120 },
    { month: "April", profitEarned: 73, totalSales: 190 },
    { month: "May", profitEarned: 209, totalSales: 130 },
    { month: "June", profitEarned: 214, totalSales: 140 },
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
        <Card>
            <CardHeader>
                <CardTitle>Profit Earned</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}

export default ProfitEarnedChart
