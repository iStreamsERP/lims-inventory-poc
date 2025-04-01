import { getDynamicColor } from "@/utils/getDynamicColor";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";


const overviewChartConfig = {
    sales: {
        label: "Total Sales",
    },
};

const data = [
    {
        month: "Jan",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Feb",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Mar",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Apr",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "May",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Jun",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Jul",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Aug",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Sep",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Oct",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Nov",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        month: "Dec",
        totalSales: Math.floor(Math.random() * 5000) + 1000,
    },
]

const maxSales = Math.max(...data.map(item => item.totalSales));

const dataWithPercentage = data.map(item => ({
    ...item,
    Percentage: Math.floor((item.totalSales / maxSales) * 100)
}));


export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <ChartContainer config={overviewChartConfig} >
                <BarChart data={data} margin={{ top: 20 }}>
                    <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="totalSales" radius={8} className="fill-primary">
                        {dataWithPercentage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getDynamicColor(entry.Percentage)} />
                        ))}
                        <LabelList
                            position="top"
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