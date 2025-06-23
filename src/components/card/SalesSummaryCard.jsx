
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { BarChart, DollarSign, Handshake, IndianRupee, TrendingUp } from "lucide-react"


const data = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        percentage: "20.1%",
        icon: <IndianRupee size={18} color="green" />
    },
    {
        title: "Deals",
        value: Math.floor(Math.random() * 1000),
        percentage: "60.1%",
        icon: <Handshake size={18} color="blue" />
    },
    {
        title: "No.of Deals Closed",
        value: Math.floor(Math.random() * 1000),
        percentage: "86%",
        icon: <BarChart size={18} color="purple" />
    },
    {
        title: "Estimated Revenue",
        value: "₹45,231.89",
        percentage: "90.1%",
        icon: <TrendingUp size={18} color="orange" />
    },
]

const SalesSummaryCard = () => {
    return (
        data.map((data, index) => {
            return (
                <Card key={index} className="bg-gradient-to-t from-slate-900 to-blue-900 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {data.title}
                        </CardTitle>
                        <div className="p-2 bg-white rounded-full">
                            {data.icon}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.value}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600 font-semibold">+{data.percentage}</span> from last month
                        </p>
                    </CardContent>
                </Card>
            )
        })

    )
}

export default SalesSummaryCard
