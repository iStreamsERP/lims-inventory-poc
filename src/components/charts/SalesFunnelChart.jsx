import {
    Funnel,
    FunnelChart,
    LabelList,
    ResponsiveContainer
} from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";

const salesFunnelChartConfig = {
    sales: {
        label: "Total Sales",
        color: "#ef4444",
    },
};

const salesFunnelData = [
    { stage: "New Leads", value: 1000, fill: "#ef4444" },
    { stage: "Qualified", value: 800, fill: "#f97316" },
    { stage: "Proposal Sent", value: 600, fill: "#f59e0b" },
    { stage: "Negotiation", value: 300, fill: "#10b981" },
    { stage: "Won", value: 100, fill: "#6366f1" },
];

const SalesFunnelChart = () => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <ChartContainer config={salesFunnelChartConfig}>
                <FunnelChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Funnel dataKey="value" data={salesFunnelData} isAnimationActive>
                        <LabelList position="right" offset={10} fontSize={10} stroke="none" dataKey="stage" />
                    </Funnel>
                </FunnelChart>
            </ChartContainer>
        </ResponsiveContainer>
    )
}

export default SalesFunnelChart
