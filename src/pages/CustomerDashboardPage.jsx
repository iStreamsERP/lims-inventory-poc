import SalesSummaryCard from "@/components/card/SalesSummaryCard";
import { Overview } from "@/components/charts/OverviewChart";
import ProfitEarnedChart from "@/components/charts/ProfitEarnedChart";
import { SalesActivityChart } from "@/components/charts/SalesActivityChart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card, CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, MoreHorizontal, Phone } from "lucide-react";

const CustomerDashboardPage = () => {
    const { userData } = useAuth();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 h-full">
            <div className="h-full md:col-span-2 lg:col-span-6 grid gap-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <SalesSummaryCard />
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="col-span-full md:col-span-8 lg:col-span-6">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview />
                        </CardContent>
                    </Card>

                    <Card className="col-span-full md:col-span-4 lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Sales Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <SalesActivityChart />
                        </CardContent>
                    </Card>

                    <Card className="col-span-full md:col-span-4 lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Profit Earned</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ProfitEarnedChart />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="text-center lg:sticky md:col-span-2 lg:col-span-2 h-fit p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={userData.currentUserImageData} alt={userData.currentUserName} />
                        <AvatarFallback>{userData.currentUserName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-3">
                        <div className="flex flex-col items-start">
                            <h2 className="text-xl font-semibold">
                                {userData.currentUserName}
                            </h2>
                            <p className="text-xs text-gray-500">iStreams ERP Solutions</p>
                        </div>

                        <div className="flex gap-4 text-gray-500">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="">
                                            <Mail size={16} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>gopi@demo.com</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button>
                                            <Phone size={16} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>+91 909215 5223</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button>
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>More</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                </div>

                <Tabs defaultValue="lead-info" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="lead-info">Leads Info</TabsTrigger>
                        <TabsTrigger value="address-info">Address Info</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lead-info">
                        <Card>
                            <CardContent className="space-y-4 p-3 font-normal">
                                <div className=" flex items-center justify-between text-sm">
                                    <p htmlFor="name" className=" text-gray-400">Email ID</p>
                                    <p>{userData.userEmail}</p>
                                </div>

                                <div className=" flex items-center justify-between text-sm">
                                    <p htmlFor="name" className=" text-gray-400">Phone</p>
                                    <p>+91 909215 5223</p>
                                </div>

                                <div className=" flex items-center justify-between text-sm">
                                    <p htmlFor="name" className=" text-gray-400">Lead Owner</p>
                                    <p>Anees</p>
                                </div>

                                <div className=" flex items-center justify-between text-sm">
                                    <p htmlFor="name" className=" text-gray-400">Job Title</p>
                                    <p>Developer</p>
                                </div>

                                <div className=" flex items-center justify-between text-sm">
                                    <p htmlFor="name" className=" text-gray-400">Lead Source</p>
                                    <p>Online Store</p>
                                </div>

                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="address-info">
                        <Card>
                            <CardContent className="space-y-2 p-3 font-normal">
                                <div className=" flex items-center justify-between text-sm">
                                    <p htmlFor="name" className=" text-gray-400">Lead Source</p>
                                    <p>Online Store</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </Card>


        </div>
    )
}

export default CustomerDashboardPage