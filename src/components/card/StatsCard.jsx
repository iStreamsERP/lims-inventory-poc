import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

const StatsCard = ({ title, value }) => {
    return (
        <Card>
            <CardHeader className="p-3">
                <CardTitle className="text-xs text-gray-400">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <h1 className="text-4xl font-semibold">{value}</h1>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <p className="text-xs text-gray-400">
                    Previous month <span className="font-bold text-sm">{value}</span> <span className="font-bold text-green-400">7.7%</span>
                </p>
            </CardFooter>
        </Card>
    )
}

export default StatsCard
