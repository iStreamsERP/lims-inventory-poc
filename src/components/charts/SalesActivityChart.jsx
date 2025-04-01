import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    ResponsiveContainer,
    XAxis
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { getDynamicColor } from "@/utils/getDynamicColor";

const salesActivityChartConfig = {
    sales: {
        label: "Sales Activity",
    },
};

const salesActivityChartData = [
    { Name: "Ajeeth", Sales: Math.floor(Math.random() * 500) + 50 },
    { Name: "Harish", Sales: Math.floor(Math.random() * 500) + 50 },
    { Name: "Arafath", Sales: Math.floor(Math.random() * 500) + 50 },
    { Name: "Haneesh", Sales: Math.floor(Math.random() * 500) + 50 },
    { Name: "Yogesh", Sales: Math.floor(Math.random() * 500) + 50 },
    { Name: "Sneha", Sales: Math.floor(Math.random() * 500) + 50 },
];

const maxSales = Math.max(...salesActivityChartData.map(item => item.Sales));

const salesActivityChartDataWithPercentage = salesActivityChartData.map(item => ({
    ...item,
    Percentage: Math.floor((item.Sales / maxSales) * 100)
}));


export const SalesActivityChart = () => {
    return (
        <ResponsiveContainer width="100%" height={200}>
                <ChartContainer config={salesActivityChartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={salesActivityChartDataWithPercentage}
                        margin={{ top: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="Name"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 8)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="Sales" radius={8}>
                            {salesActivityChartDataWithPercentage.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getDynamicColor(entry.Percentage)} />
                            ))}
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
        </ResponsiveContainer>
    )
}
