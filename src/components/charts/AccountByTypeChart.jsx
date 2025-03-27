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

const accountTypeConfig = {
    Conversion: {
        label: "Conversion",
    },
    Customer: {
        label: "Customer",
    },
    Propspect: {
        label: "Propspect",
    },
    Supplier: {
        label: "Supplier",
    },
    Suspect: {
        label: "Suspect",
    },
}

const accountTypeChartData = [
    { Type: "Customer", Conversion: 275 },
    { Type: "Propspect", Conversion: 50 },
    { Type: "Supplier", Conversion: 157 },
    { Type: "Suspect", Conversion: 220 },
];

const maxSales = Math.max(...accountTypeChartData.map(item => item.Conversion));

const accountTypeChartDataWithPercentage = accountTypeChartData.map(item => ({
    ...item,
    Percentage: Math.floor((item.Conversion / maxSales) * 100)
}));



const AccountByTypeChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account By Type</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={accountTypeConfig}>
                    <BarChart
                        accessibilityLayer
                        data={accountTypeChartDataWithPercentage}
                        margin={{ top: 20 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="Type"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 10)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="Conversion" radius={8}>
                            {accountTypeChartDataWithPercentage.map((entry, index) => (
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

export default AccountByTypeChart
