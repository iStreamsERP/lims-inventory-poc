import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, RadialBar, RadialBarChart, PolarRadiusAxis, Label } from "recharts";

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
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Ajeeth", sales: 186 },
  { month: "Harish", sales: 305 },
  { month: "Arafath", sales: 237 },
  { month: "Haneesh", sales: 73 },
  { month: "Yogesh", sales: 209 },
  { month: "Sneha", sales: 214 },
];

const chartConfig = {
  sales: {
    label: "Total Sales",
    // no longer using css variables for color
    color: "#3b82f6",
  },
};

const totalSales = 700;
const target = 1500;
const percentage = (totalSales / target) * 100;
const remaining = 100 - percentage;

const radialChartData = [
  {
    month: "january",
    totalSales,
    target,
    percentage,
    remaining,
  },
];

const horizontalBarChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const horizontalBarChartConfig = {
  desktop: {
    label: "Desktop",
    color: "#3b82f6", // Tailwind blue-500
  },
  mobile: {
    label: "Mobile",
    color: "#10b981", // Tailwind green-500
  },
  label: {
    color: "#000", // black text for labels
  },
};

const DashboardPage = () => {
  const formattedPercentage = percentage.toFixed(0);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {/* Bar Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Since 1 Jan 2019</CardTitle>
            <CardDescription>January - June 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={8}>
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

        {/* Radial Chart Card */}
        <Card className="flex flex-col">
          <CardHeader className="items-start pb-0">
            <CardTitle>Sales Target</CardTitle>
            <CardDescription>January 2024</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[250px]"
            >
              <RadialBarChart
                data={radialChartData}
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={130}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 20}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {formattedPercentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy || 0}
                              className="fill-muted-foreground text-sm"
                            >
                              out of {target}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                {/* Achieved portion */}
                <RadialBar
                  dataKey="percentage"
                  stackId="a"
                  cornerRadius={5}
                  fill="#3b82f6"
                  className="stroke-transparent stroke-2"
                />
                {/* Remaining portion */}
                <RadialBar
                  dataKey="remaining"
                  stackId="a"
                  cornerRadius={5}
                  fill="#f3f4f6"
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Horizontal Bar Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunities won by this month</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={horizontalBarChartConfig}>
              <BarChart
                accessibilityLayer
                data={horizontalBarChartData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="month"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  hide
                />
                <XAxis dataKey="desktop" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="desktop"
                  layout="vertical"
                  fill="#3b82f6"
                  radius={4}
                >
                  <LabelList
                    dataKey="month"
                    position="insideLeft"
                    offset={8}
                    className="fill-black"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="desktop"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
