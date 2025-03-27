import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
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
    { Name: "Ajeeth", Sales: 186 },
    { Name: "Harish", Sales: 305 },
    { Name: "Arafath", Sales: 237 },
    { Name: "Haneesh", Sales: 73 },
    { Name: "Yogesh", Sales: 209 },
    { Name: "Sneha", Sales: 214 },
];

const maxSales = Math.max(...salesActivityChartData.map(item => item.Sales));

const salesActivityChartDataWithPercentage = salesActivityChartData.map(item => ({
    ...item,
    Percentage: Math.floor((item.Sales / maxSales) * 100)
}));


export const SalesActivityChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Activity</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}
