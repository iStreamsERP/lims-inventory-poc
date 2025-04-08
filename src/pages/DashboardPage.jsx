
import SalesSummaryCard from "@/components/card/SalesSummaryCard";
import AccountByTypeChart from "@/components/charts/AccountByTypeChart";
import NewLeadsPieChart from "@/components/charts/NewLeadsPieChart";
import OpportunitiesHorizontalBarChart from "@/components/charts/OpportunitiesHorizontalBarChart";
import { Overview } from "@/components/charts/OverviewChart";
import ProfitEarnedChart from "@/components/charts/ProfitEarnedChart";
import { SalesActivityChart } from "@/components/charts/SalesActivityChart";
import SalesFunnelChart from "@/components/charts/SalesFunnelChart";
import SalesTargetRadialChart from "@/components/charts/SalesTargetRadialChart";
import RecentSales from "@/components/RecentSales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

// Define a multi-color palette
const palette = ["#ef4444", "#f97316", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6"];


const chartConfig = {
  sales: {
    label: "Total Sales",
    // Primary color can be the first palette color
    color: palette[0],
  },
};

const totalSales = 700;
const target = 1500;
const percentage = (totalSales / target) * 100;
const remaining = 100 - percentage;


const DashboardPage = () => {
  const { userData } = useAuth();

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="font-semibold">Welcome back, {userData.currentUserName} 👋</h1>
        <p className="text-gray-400 text-sm">here's what's happening with your account today</p>
      </div>

      <h1 className="title">Sales Dashboard</h1>


      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <SalesSummaryCard />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-8 lg:grid-cols-9">
        <Card className="col-span-full md:col-span-8 lg:col-span-6">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-6">
            <RecentSales />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Target</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesTargetRadialChart />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesActivityChart />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Opportunities won by months</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OpportunitiesHorizontalBarChart />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Account By Type</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AccountByTypeChart />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Funnel</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesFunnelChart />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>New Leads by Month</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <NewLeadsPieChart />
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Profit Earned</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ProfitEarnedChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;