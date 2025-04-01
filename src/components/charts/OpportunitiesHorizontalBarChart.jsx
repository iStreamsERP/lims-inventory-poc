import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ResponsiveContainer,
    XAxis,
    YAxis
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
import { getDynamicColor } from "@/utils/getDynamicColor";

const horizontalBarChartData = [
    { month: "January", totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "February", totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "March", totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "April", totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "May", totalSales: Math.floor(Math.random() * 500) + 50 },
    { month: "June", totalSales: Math.floor(Math.random() * 500) + 50 },
];

const horizontalBarChartConfig = {
    totalSales: {
        label: "Total Sales",
    },
};

const maxSales = Math.max(...horizontalBarChartData.map(item => item.totalSales));

const salesActivityChartDataWithPercentage = horizontalBarChartData.map(item => ({
    ...item,
    Percentage: Math.floor((item.totalSales / maxSales) * 100)
}));

const OpportunitiesHorizontalBarChart = () => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <ChartContainer config={horizontalBarChartConfig}>
                <BarChart
                    accessibilityLayer
                    data={salesActivityChartDataWithPercentage}
                    layout="vertical"
                    margin={{ right: 16 }}
                >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="month"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        hide
                    />
                    <XAxis dataKey="totalSales" type="number" hide />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                        dataKey="totalSales"
                        layout="vertical"
                        radius={4}
                    >
                        {salesActivityChartDataWithPercentage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getDynamicColor(entry.Percentage)} />
                        ))}
                        <LabelList
                            dataKey="month"
                            position="insideLeft"
                            offset={8}
                            className="fill-black"
                            fontSize={12}
                        />
                        <LabelList
                            dataKey="totalSales"
                            position="right"
                            offset={8}
                            className="fill-foreground"
                            fontSize={12}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </ResponsiveContainer>

    )
}

export default OpportunitiesHorizontalBarChart
