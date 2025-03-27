import {
    Funnel,
    FunnelChart,
    LabelList,
    Tooltip as RechartsTooltip
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

const palette = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6"];

const salesFunnelChartConfig = {
    sales: {
        label: "Total Sales",
        // Primary color can be the first palette color
        color: palette[0],
    },
};

const salesFunnelData = [
    { stage: "New Leads", value: 500, fill: "#ef4444" },
    { stage: "Qualified", value: 350, fill: "#f97316" },
    { stage: "Proposal Sent", value: 250, fill: "#f59e0b" },
    { stage: "Negotiation", value: 150, fill: "#10b981" },
    { stage: "Won", value: 50, fill: "#6366f1" },
];


const SalesFunnelChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Funnel</CardTitle>
                <CardDescription>Conversion by Stage</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={salesFunnelChartConfig}>
                    <FunnelChart width={400} height={400}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Funnel dataKey="value" data={salesFunnelData} isAnimationActive>
                            <LabelList dataKey="stage" position="inside" offset={10} fill="#FFF" fontSize={10} />
                        </Funnel>
                    </FunnelChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default SalesFunnelChart
