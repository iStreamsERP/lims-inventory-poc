import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  Label,
  LabelList,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  Sector,
  XAxis,
  YAxis
} from "recharts";

import AccountByTypeChart from "@/components/charts/AccountByTypeChart";
import ProfitEarnedChart from "@/components/charts/ProfitEarnedChart";
import { SalesActivityChart } from "@/components/charts/SalesActivityChart";
import SalesTargetRadialChart from "@/components/charts/SalesTargetRadialChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OpportunitiesHorizontalBarChart from "@/components/charts/OpportunitiesHorizontalBarChart";
import SalesFunnelChart from "@/components/charts/SalesFunnelChart";
import NewLeadsPieChart from "@/components/charts/NewLeadsPieChart";
import SalesSummaryCard from "@/components/card/SalesSummaryCard";
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
    const { userData, logout } = useAuth();
  
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="font-semibold">Welcome back, {userData.currentUserName} 👋</h1>
        <p className="text-gray-400 text-sm">here's what's happening with your account today</p>
      </div>
      <h1 className="title">Sales Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <SalesSummaryCard />
        </div>

        <SalesTargetRadialChart />

        <SalesActivityChart />

        <OpportunitiesHorizontalBarChart />

        <AccountByTypeChart />

        <SalesFunnelChart />

        <NewLeadsPieChart />

        <ProfitEarnedChart />
      </div>
    </div>
  );
};

export default DashboardPage;