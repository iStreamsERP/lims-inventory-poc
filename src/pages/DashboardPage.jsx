import { callSoapService } from "@/api/callSoapService";
import ChatbotUI from "@/components/ChatbotUI";
import { GrossSalaryChart } from "@/components/iStCharts/GrossSalaryBarChart";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AnimatedNumber = ({ value, generateRandomValue }) => {
  const [displayValue, setDisplayValue] = useState(generateRandomValue());
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(generateRandomValue());
    }, 100);
    return () => clearInterval(interval);
  }, [generateRandomValue]);
  return <span>{displayValue}</span>;
};

export const DashboardPage = () => {
  const { userData } = useAuth();
  const [dbData, setDbData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnimatedNumbers, setShowAnimatedNumbers] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState(1);
  const dashboardId = 1;
  const navigate = useNavigate();

  useEffect(() => {
    const savedLayout = localStorage.getItem("selected_layout");
    if (savedLayout) {
      setSelectedLayout(Number(savedLayout));
    }
    fetchUserData();
    const timer = setTimeout(() => setShowAnimatedNumbers(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const DashBoardID = { DashBoardID: dashboardId };
      const [master, event] = await Promise.all([
        callSoapService(userData.clientURL, "BI_GetDashBoardMaster_Configuration", DashBoardID),
        callSoapService(userData.clientURL, "BI_GetDashboard_UpcomingEvents_Data", DashBoardID),
      ]);
      setDbData(master);
      setEventData(event);

      if (master.length > 0) {
        const layoutFromAPI = Number(master[0].DEFAULT_LAYOUT);
        const savedLayout = localStorage.getItem("selected_layout");

        if (!savedLayout && layoutFromAPI && layoutFromAPI > 0) {
          setSelectedLayout(layoutFromAPI);
          localStorage.setItem("selected_layout", layoutFromAPI); // optional
        }
      }

      localStorage.setItem(
        "chatbot_context",
        JSON.stringify({
          source: "events",
          title: item.UPCOMING_EVENT_HEADER || "Upcoming Events",
          data: event,
        }),
      );
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const chartProps = (item, chartNo) => ({
    DashBoardID: dashboardId,
    ChartNo: chartNo,
    chartTitle: item[`CHART${chartNo}_TITLE`],
    chartXAxis: item[`CHART${chartNo}_X_AXIS1`],
    chartYAxis: item[`CHART${chartNo}_Y_AXIS1`],
    chartType: chartNo === 2 ? "donut" : "bar",
  });

  const renderEventCard = (item) => (
    <Card className="rounded-xl border bg-white shadow-xl dark:bg-slate-950">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold tracking-wide">{item.UPCOMING_EVENT_HEADER || "Upcoming Events"}</CardTitle>
      </CardHeader>
      <CardContent className="ms-2 h-[55vh] overflow-y-auto p-3">
        {eventData.length === 0 ? (
          <div className="py-8 text-center text-lg">No upcoming events.</div>
        ) : (
          <div className="relative">
            <div className="absolute left-24 top-0 h-full w-0.5 border border-dashed bg-blue-100 dark:bg-blue-900" />
            <div className="ml-28 space-y-4 whitespace-nowrap">
              {eventData.map((ev, idx) => {
                const eventDate = new Date(ev.EVENT_DATE);
                const formattedDate = eventDate.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  weekday: "short",
                });
                return (
                  <div
                    key={idx}
                    className="relative"
                  >
                    <div className="absolute -left-28 top-0 text-[10px] font-semibold">{formattedDate}</div>
                    <div className="absolute -left-[22.5px] top-2 h-4 w-4 animate-pulse rounded-full border-4 border-white bg-blue-900 shadow-md" />
                    <div className="w-full rounded-lg bg-blue-100 p-2 text-gray-800 shadow-lg hover:bg-blue-200 dark:bg-gray-800 dark:text-gray-200">
                      <div className="text-wrap text-sm font-semibold">{ev.EVENT_NAME}</div>
                      <div className="text-wrap font-semibold">
                        {ev.EVENT_DESCRIPTION}
                        <p className="text-[11px] text-gray-500">{ev.EVENT_INFO}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 rounded-xl"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      {dbData.map((item, index) => (
        <div
          key={index}
          className="space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">{item.DASHBOARD_NAME}</h1>
            <div className="flex items-center gap-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <div className="flex items-center gap-2 text-sm">
                        <label
                          htmlFor="layout-select"
                          className="font-medium text-gray-700 dark:text-gray-300"
                        >
                          Layout:
                        </label>
                        <select
                          id="layout-select"
                          value={selectedLayout}
                          onChange={(e) => {
                            const layout = Number(e.target.value);
                            setSelectedLayout(layout);
                            localStorage.setItem("selected_layout", layout);
                          }}
                          className="rounded-md px-2 py-1 text-gray-800 dark:bg-slate-900 dark:text-white"
                        >
                          {[1, 2, 3, 4].map((num) => (
                            <option
                              key={num}
                              value={num}
                            >
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Badges (Hidden for Layout 5 amd 6) */}
          {![5, 6].includes(selectedLayout) && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-4">
              {[1, 2, 3, 4].map((badgeNum) => {
                const colors = ["bg-blue-200", "bg-green-200", "bg-purple-200", "bg-orange-200"];
                const textColor = "text-gray-800";
                const generateRandomValue = () => {
                  const badgeValue = item[`BADGE${badgeNum}_VALUE`];
                  if (!badgeValue) return "N/A";
                  const badgeValueStr = String(parseInt(badgeValue));
                  const prefix = badgeValueStr.replace(/[0-9]/g, "");
                  const numbers = badgeValueStr.replace(/[^0-9]/g, "");
                  if (numbers.length === 0) return badgeValueStr;
                  const randomNum = Math.floor((Math.random() * (parseInt(numbers) * 2 - parseInt(numbers))) / 2 + parseInt(numbers) / 2).toString();
                  return prefix + parseInt(randomNum);
                };
                return (
                  <Card
                    key={badgeNum}
                    className={`transform cursor-pointer transition duration-300 hover:scale-105 hover:shadow-lg ${
                      colors[badgeNum - 1]
                    } ${textColor}`}
                    onClick={() =>
                      navigate(`/dashboard-details/${item.DASHBOARD_ID}/${badgeNum}`, {
                        state: { badgeTitle: item[`BADGE${badgeNum}_TITLE`] },
                      })
                    }
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-0 pt-3">
                      <CardTitle className={`text-sm font-medium ${textColor}`}>{item[`BADGE${badgeNum}_TITLE`] || "Unknown"}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-2 pt-1">
                      <div className="flex items-center justify-between pt-0">
                        <div className="text-lg font-bold">
                          {showAnimatedNumbers ? (
                            <AnimatedNumber
                              value={item[`BADGE${badgeNum}_VALUE`]}
                              generateRandomValue={generateRandomValue}
                            />
                          ) : (
                            (() => {
                              const val = item[`BADGE${badgeNum}_VALUE`];
                              if (!val) return "N/A";

                              const valStr = String(val);
                              const isDecimal = valStr.includes(".") && !isNaN(Number(valStr));
                              const currencySymbol = userData?.companyCurrSymbol || "$";

                              return isDecimal ? `${currencySymbol} ${Number(val).toLocaleString()}` : valStr;
                            })()
                          )}
                        </div>

                        <ArrowRight className={`h-4 w-4 ${textColor} mr-1`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          {/* Layout 1 */}
          {selectedLayout === 1 && (
            <>
              <GrossSalaryChart {...chartProps(item, 1)} />
              <div className="grid gap-3 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 2)} />
                {renderEventCard(item)}ss
              </div>
              <GrossSalaryChart {...chartProps(item, 3)} />
            </>
          )}

          {/* Layout 2 */}
          {selectedLayout === 2 && (
            <>
              <div className="grid gap-3 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 1)} />
                <GrossSalaryChart {...chartProps(item, 2)} />
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 3)} />
                {renderEventCard(item)}
              </div>
            </>
          )}

          {/* Layout 3 */}
          {selectedLayout === 3 && (
            <>
              <div className="grid gap-3 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 1)} />
                {renderEventCard(item)}
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 2)} />
                <GrossSalaryChart {...chartProps(item, 3)} />
              </div>
            </>
          )}

          {/* Layout 4 */}
          {selectedLayout === 4 && (
            <>
              <GrossSalaryChart {...chartProps(item, 1)} />
              <GrossSalaryChart {...chartProps(item, 2)} />
              <GrossSalaryChart {...chartProps(item, 3)} />
              {renderEventCard(item)}
            </>
          )}

          {/* Layout 5 */}
          {selectedLayout === 5 && (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 1)} />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((badgeNum) => {
                    const colors = ["bg-blue-200", "bg-green-200", "bg-purple-200", "bg-orange-200"];
                    const textColor = "text-gray-800";
                    const generateRandomValue = () => {
                      const badgeValue = item[`BADGE${badgeNum}_VALUE`];
                      if (!badgeValue) return "N/A";
                      const badgeValueStr = String(badgeValue);
                      const prefix = badgeValueStr.replace(/[0-9]/g, "");
                      const numbers = badgeValueStr.replace(/[^0-9]/g, "");
                      if (numbers.length === 0) return badgeValueStr;
                      const randomNum = Math.floor(
                        (Math.random() * (parseInt(numbers) * 2 - parseInt(numbers))) / 2 + parseInt(numbers) / 2,
                      ).toString();
                      return prefix + randomNum;
                    };
                    return (
                      <Card
                        key={badgeNum}
                        className={`transform cursor-pointer transition duration-300 hover:scale-105 hover:shadow-lg ${
                          colors[badgeNum - 1]
                        } ${textColor} p-4`}
                        onClick={() =>
                          navigate(`/dashboard-details/${item.DASHBOARD_ID}/${badgeNum}`, {
                            state: {
                              badgeTitle: item[`BADGE${badgeNum}_TITLE`],
                            },
                          })
                        }
                      >
                        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
                          <CardTitle className={`text-xl font-medium ${textColor}`}>{item[`BADGE${badgeNum}_TITLE`] || "Unknown"}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-center justify-between pt-2 text-xl font-bold">
                            {showAnimatedNumbers ? (
                              <AnimatedNumber
                                value={item[`BADGE${badgeNum}_VALUE`]}
                                generateRandomValue={generateRandomValue}
                              />
                            ) : (
                              item[`BADGE${badgeNum}_VALUE`] || "N/A"
                            )}
                            <ArrowRight className={`h-4 w-4 ${textColor} mr-1`} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 2)} />
                {renderEventCard(item)}
              </div>
              <GrossSalaryChart {...chartProps(item, 3)} />
            </>
          )}

          {/* Layout 6 */}
          {selectedLayout === 6 && (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Left: Badges in column */}
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((badgeNum) => {
                    const colors = ["bg-blue-200", "bg-green-200", "bg-purple-200", "bg-orange-200"];
                    const textColor = "text-gray-800";
                    const generateRandomValue = () => {
                      const badgeValue = item[`BADGE${badgeNum}_VALUE`];
                      if (!badgeValue) return "N/A";
                      const badgeValueStr = String(badgeValue);
                      const prefix = badgeValueStr.replace(/[0-9]/g, "");
                      const numbers = badgeValueStr.replace(/[^0-9]/g, "");
                      if (numbers.length === 0) return badgeValueStr;
                      const randomNum = Math.floor(
                        (Math.random() * (parseInt(numbers) * 2 - parseInt(numbers))) / 2 + parseInt(numbers) / 2,
                      ).toString();
                      return prefix + randomNum;
                    };
                    return (
                      <Card
                        key={badgeNum}
                        className={`transform cursor-pointer transition duration-300 hover:scale-105 hover:shadow-lg ${
                          colors[badgeNum - 1]
                        } ${textColor}`}
                        onClick={() =>
                          navigate(`/dashboard-details/${item.DASHBOARD_ID}/${badgeNum}`, {
                            state: {
                              badgeTitle: item[`BADGE${badgeNum}_TITLE`],
                            },
                          })
                        }
                      >
                        <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4">
                          <CardTitle className={`text-sm font-medium ${textColor}`}>{item[`BADGE${badgeNum}_TITLE`] || "Unknown"}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="flex items-center justify-between pt-2 text-xl font-bold">
                            {showAnimatedNumbers ? (
                              <AnimatedNumber
                                value={item[`BADGE${badgeNum}_VALUE`]}
                                generateRandomValue={generateRandomValue}
                              />
                            ) : (
                              item[`BADGE${badgeNum}_VALUE`] || "N/A"
                            )}
                            <ArrowRight className={`h-4 w-4 ${textColor} mr-1`} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Right: Event card full height */}
                <div className="h-full">{renderEventCard(item)}</div>
              </div>

              {/* Below section can be extended if needed */}
              <GrossSalaryChart {...chartProps(item, 1)} />
              <div className="grid gap-3 lg:grid-cols-2">
                <GrossSalaryChart {...chartProps(item, 2)} />
                <GrossSalaryChart {...chartProps(item, 3)} />
              </div>
            </>
          )}
        </div>
      ))}
      <ChatbotUI />
    </div>
  );
};
