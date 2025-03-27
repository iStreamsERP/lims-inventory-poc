import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import StatsCard from "./StatsCard"

const SalesSummaryCard = () => {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                    Data updated as of July 2025. Overview of key sales metrics for the current period.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatsCard title="Total Revenue" value="₹ 1,00,000" />
                    <StatsCard title="Deals" value="126" />
                    <StatsCard title="No. of Deals Closed" value="126" />
                    <StatsCard title="Estimated Revenue" value="₹ 1,00,000" />
                </div>
            </CardContent>
        </Card>
    )
}

export default SalesSummaryCard
