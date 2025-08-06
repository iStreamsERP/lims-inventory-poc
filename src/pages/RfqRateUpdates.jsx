import { callSoapService } from "@/api/callSoapService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { convertServiceDate } from "@/utils/dateUtils";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RfqRateUpdates() {
  const { id } = useParams();
  const { userData } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groupedItems, setGroupedItems] = useState([]);
  const [lowestRates, setLowestRates] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchMaterials(), fetchRates()]);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userData]);

  useEffect(() => {
    if (materials.length > 0 && rates.length > 0) {
      const grouped = groupItems(materials, rates);
      setGroupedItems(grouped);
      calculateLowestRates(grouped);

      const initialExpanded = {};
      grouped.forEach((item) => {
        initialExpanded[item.ITEM_CODE] = false;
      });
      setExpandedItems(initialExpanded);
    }
  }, [materials, rates]);

  const toggleExpand = (itemCode) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemCode]: !prev[itemCode],
    }));
  };

  const calculateLowestRates = (groupedItems) => {
    const rateMap = {};

    groupedItems.forEach((item) => {
      if (!rateMap[item.ITEM_CODE]) {
        rateMap[item.ITEM_CODE] = {
          lowestRate: Infinity,
          vendor: null,
          vendorCount: 0,
        };
      }

      item.rates.forEach((rate) => {
        const rateValue = parseFloat(rate.RATE || item.RATE);
        if (rateValue < rateMap[item.ITEM_CODE].lowestRate) {
          rateMap[item.ITEM_CODE] = {
            ...rateMap[item.ITEM_CODE],
            lowestRate: rateValue,
            vendor: item.SELECTED_VENDOR_NAME,
          };
        }
        rateMap[item.ITEM_CODE].vendorCount++;
      });
    });

    setLowestRates(rateMap);
  };

  const groupItems = (materials, rates) => {
    const itemMap = new Map();

    materials.forEach((material) => {
      const key = `${material.ITEM_CODE}-${material.SELECTED_VENDOR_NAME}`;
      if (!itemMap.has(key)) {
        itemMap.set(key, {
          ...material,
          rates: rates.filter(
            (rate) =>
              rate.ITEM_CODE === material.ITEM_CODE &&
              rate.VENDOR_NAME === material.SELECTED_VENDOR_NAME
          ),
        });
      }
    });

    return Array.from(itemMap.values());
  };

  const fetchMaterials = async () => {
    try {
      const payload = {
        DataModelName: "INVT_PURCHASE_QUOTMASTER",
        WhereCondition: `QUOTATION_REF_NO = '${id}'`,
        OrderBy: "",
      };

      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );
      setMaterials(response);
    } catch (error) {
      throw new Error("Failed to fetch materials");
    }
  };

  const fetchRates = async () => {
    try {
      const payload = {
        DataModelName: "INVT_PURCHASE_QUOTDETAILS",
        WhereCondition: `QUOTATION_REF_NO = '${id}'`,
        OrderBy: "",
      };

      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );
      setRates(response);
    } catch (error) {
      throw new Error("Failed to fetch rates");
    }
  };

  const handleSubmit = () => {
    console.log("Submitting rate updates");
    // Add your submission logic here
  };

  const getRateCellStyle = (itemCode, vendorName, rate) => {
    const rateValue = parseFloat(rate);
    if (
      lowestRates[itemCode] &&
      lowestRates[itemCode].lowestRate === rateValue &&
      lowestRates[itemCode].vendor === vendorName
    ) {
      return "bg-green-100 dark:bg-green-900";
    }
    return "bg-red-100 dark:bg-red-900";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg">Loading RFQ data...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="shadow-lg">
          <CardHeader className="rounded-t-lg bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <CardTitle className="text-xl font-bold text-gray-800">
                RFQ Rate Comparison
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white text-blue-800">
                  <span className="font-semibold">Ref No:</span> {id}
                </Badge>
                <Badge variant="secondary" className="bg-white text-blue-800">
                  <span className="font-semibold">Date:</span>{" "}
                  {convertServiceDate(materials[0]?.QUOTATION_REF_DATE) ||
                    materials[0]?.QUOTATION_REF_DATE}
                </Badge>
                <Badge className="bg-green-600 text-white">
                  {userData.companyCurrName} ({userData.companyCurrSymbol})
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div>
              <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Summary View
              </h2>
              <Button
                variant="default"
                size="sm"
                className="mb-4"
                onClick={()=> {}}
              >
                View All
              </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table className="min-w-full">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="w-12 font-semibold text-gray-700 px-4 py-3">
                        #
                      </TableHead>
                      <TableHead className="w-32 font-semibold text-gray-700 px-4 py-3">
                        Item Code
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 px-4 py-3">
                        Description
                      </TableHead>
                      <TableHead className="w-24 font-semibold text-gray-700 text-center px-4 py-3">
                        UOM
                      </TableHead>
                      <TableHead className="w-24 font-semibold text-gray-700 text-right px-4 py-3">
                        Qty
                      </TableHead>
                      <TableHead className="w-32 font-semibold text-gray-700 text-right px-4 py-3">
                        Best Rate
                      </TableHead>
                      <TableHead className="w-48 font-semibold text-gray-700 px-4 py-3">
                        Supplier
                      </TableHead>
                      <TableHead className="w-16 font-semibold text-gray-700 px-4 py-3"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedItems
                      .filter(
                        (item, index, self) =>
                          index ===
                          self.findIndex((t) => t.ITEM_CODE === item.ITEM_CODE)
                      )
                      .map((item, index) => (
                        <React.Fragment key={item.ITEM_CODE}>
                          <TableRow className="hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-600 px-4 py-3">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-gray-800 px-4 py-3">
                              {item.ITEM_CODE}
                            </TableCell>
                            <TableCell className="font-medium text-gray-800 px-4 py-3">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="line-clamp-1">
                                    {item.DESCRIPTION}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.DESCRIPTION}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="text-center text-gray-600 px-4 py-3">
                              {item.UOM}
                            </TableCell>
                            <TableCell className="text-right text-gray-600 px-4 py-3">
                              {item.QTY}
                            </TableCell>
                            <TableCell className="text-right px-4 py-3">
                              <Badge className="bg-green-100 text-green-800 font-mono">
                                {lowestRates[
                                  item.ITEM_CODE
                                ]?.lowestRate?.toLocaleString() || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-gray-800 px-4 py-3">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="line-clamp-1">
                                    {lowestRates[item.ITEM_CODE]?.vendor ||
                                      "N/A"}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {lowestRates[item.ITEM_CODE]?.vendor ||
                                      "N/A"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="text-center px-4 py-3">
                              <button
                                onClick={() => toggleExpand(item.ITEM_CODE)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {expandedItems[item.ITEM_CODE] ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                            </TableCell>
                          </TableRow>

                          {expandedItems[item.ITEM_CODE] && (
                            <TableRow className="bg-gray-50">
                              <TableCell colSpan={8} className="p-0">
                                <div className="px-6 py-4">
                                  <h3 className="font-medium text-gray-700 mb-3">
                                    Rate Comparison for {item.DESCRIPTION}
                                  </h3>
                                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <Table className="min-w-full">
                                      <TableHeader className="bg-gray-200">
                                        <TableRow>
                                          <TableHead className="w-32 font-semibold text-gray-700 px-4 py-3">
                                            Vendor
                                          </TableHead>
                                          <TableHead className="w-24 font-semibold text-gray-700 text-center px-4 py-3">
                                            UOM
                                          </TableHead>
                                          <TableHead className="w-24 font-semibold text-gray-700 text-right px-4 py-3">
                                            Qty
                                          </TableHead>
                                          <TableHead className="w-28 font-semibold text-gray-700 text-right px-4 py-3">
                                            Rate
                                          </TableHead>
                                          <TableHead className="w-28 font-semibold text-gray-700 px-4 py-3">
                                            Status
                                          </TableHead>
                                          <TableHead className="w-28 font-semibold text-gray-700 text-right px-4 py-3">
                                            Discount %
                                          </TableHead>
                                          <TableHead className="w-28 font-semibold text-gray-700 text-right px-4 py-3">
                                            Discount Value
                                          </TableHead>
                                          {/* Uncomment if Vendor Offer and Select columns are needed */}
                                          {/* <TableHead className="w-48 font-semibold text-gray-700 px-4 py-3">
                                            Vendor Offer
                                          </TableHead>
                                          <TableHead className="w-24 font-semibold text-gray-700 text-center px-4 py-3">
                                            Select
                                          </TableHead> */}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {groupedItems
                                          .filter(
                                            (i) =>
                                              i.ITEM_CODE === item.ITEM_CODE
                                          )
                                          .flatMap((vendorItem) =>
                                            vendorItem.rates.map(
                                              (rate, rateIndex) => (
                                                <TableRow
                                                  key={`${vendorItem.ITEM_CODE}-${vendorItem.SELECTED_VENDOR_NAME}-${rateIndex}`}
                                                >
                                                  <TableCell className="font-medium text-gray-800 px-4 py-2">
                                                    {
                                                      vendorItem.SELECTED_VENDOR_NAME
                                                    }
                                                  </TableCell>
                                                  <TableCell className="text-center text-gray-600 px-4 py-2">
                                                    {vendorItem.UOM}
                                                  </TableCell>
                                                  <TableCell className="text-right text-gray-600 px-4 py-2">
                                                    {vendorItem.QTY}
                                                  </TableCell>
                                                  <TableCell
                                                    className={`text-right px-4 py-2 font-mono ${getRateCellStyle(
                                                      item.ITEM_CODE,
                                                      vendorItem.SELECTED_VENDOR_NAME,
                                                      rate.RATE ||
                                                        vendorItem.RATE
                                                    )}`}
                                                  >
                                                    {(
                                                      rate.RATE ||
                                                      vendorItem.RATE
                                                    )?.toLocaleString()}
                                                  </TableCell>
                                                  <TableCell className="px-4 py-2">
                                                    {lowestRates[item.ITEM_CODE]
                                                      ?.vendor ===
                                                    vendorItem.SELECTED_VENDOR_NAME ? (
                                                      <Badge className="bg-green-100 text-green-800">
                                                        Best Rate
                                                      </Badge>
                                                    ) : (
                                                      <Badge variant="outline">
                                                        Available
                                                      </Badge>
                                                    )}
                                                  </TableCell>
                                                  <TableCell className="text-right text-gray-600 px-4 py-2">
                                                    {rate.DISCOUNT_PTG || "N/A"}
                                                  </TableCell>
                                                  <TableCell className="text-right text-gray-600 px-4 py-2">
                                                    {rate.DISCOUNT_VALUE || "N/A"}
                                                  </TableCell>
                                                  {/* Uncomment if Vendor Offer and Select columns are needed */}
                                                  {/* <TableCell className="px-4 py-2">
                                                    <Tooltip>
                                                      <TooltipTrigger asChild>
                                                        <span className="line-clamp-1">
                                                          {rate.VENDOR_OFFER || "N/A"}
                                                        </span>
                                                      </TooltipTrigger>
                                                      <TooltipContent>
                                                        <p>{rate.VENDOR_OFFER || "N/A"}</p>
                                                      </TooltipContent>
                                                    </Tooltip>
                                                  </TableCell>
                                                  <TableCell className="text-center px-4 py-2">
                                                    <Checkbox />
                                                  </TableCell> */}
                                                </TableRow>
                                              )
                                            )
                                          )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6 px-4 sm:px-6 lg:px-8">
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 shadow-md px-6 py-2"
          >
            Submit Rate Updates
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default RfqRateUpdates;