import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
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
    { month: "January", totalSales: 186 },
    { month: "February", totalSales: 305 },
    { month: "March", totalSales: 237 },
    { month: "April", totalSales: 73 },
    { month: "May", totalSales: 209 },
    { month: "June", totalSales: 214 },
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
        <Card>
            <CardHeader>
                <CardTitle>Opportunities won by months</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}

export default OpportunitiesHorizontalBarChart
