  import { callSoapService } from "@/api/callSoapService";
import CrudCards from "@/components/rfq/CrudCards";
import DashBoardCards from "@/components/rfq/DashBoardCards";
import QuotationCards from "@/components/rfq/QuotationCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { convertServiceDate } from "@/utils/dateUtils";
import getExpirationStatus from "@/utils/rfqportalUtils";
import { Item } from "@radix-ui/react-accordion";
import {
  Box,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  ClockIcon,
  FileText,
  GitCompare,
  ListFilter,
  PlusCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RfqMaterialList() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [popup, setPopup] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [dashboards, setDashboards] = useState([
    {
      title: "Total Quotations",
      icon: FileText,
      color: "text-blue-500",
      content: 0,
      description: "Total number of quotations",
    },
    {
      title: "Active",
      icon: CheckCircle,
      color: "text-green-500",
      content: 0,
      description: "Valid quotations",
    },
    {
      title: "Expiring Soon",
      icon: ClockIcon,
      color: "text-yellow-500",
      content: 0,
      description: "Need attention",
    },
    {
      title: "Expired",
      icon: XCircle,
      color: "text-red-500",
      content: 0,
      description: "Require renewal",
    },
  ]);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    // Calculate dashboard counts based on lists
    const totalQuotations = lists.length;
    const activeQuotations = lists.filter(
      (item) =>
        getExpirationStatus(
          convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
        ).status === "Active"
    ).length;
    const expiringSoonQuotations = lists.filter(
      (item) =>
        getExpirationStatus(
          convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
        ).status === "Expiring Soon"
    ).length;
    const expiredQuotations = lists.filter(
      (item) =>
        getExpirationStatus(
          convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
        ).status === "Expired"
    ).length;

    // Update dashboards state
    setDashboards([
      {
        title: "Total Quotations",
        icon: FileText,
        color: "text-blue-500",
        content: totalQuotations,
        description: "Total number of quotations",
      },
      {
        title: "Active",
        icon: CheckCircle,
        color: "text-green-500",
        content: activeQuotations,
        description: "Valid quotations",
      },
      {
        title: "Expiring Soon",
        icon: ClockIcon,
        color: "text-yellow-500",
        content: expiringSoonQuotations,
        description: "Need attention",
      },
      {
        title: "Expired",
        icon: XCircle,
        color: "text-red-500",
        content: expiredQuotations,
        description: "Require renewal",
      },
    ]);
  }, [lists]);

  const groupedQuotations = (quotations) => {
    if (!quotations || !Array.isArray(quotations)) return [];

    const grouped = {};
    quotations.forEach((quote) => {
      const refNo = quote.QUOTATION_REF_NO;
      if (!grouped[refNo]) {
        grouped[refNo] = {
          ...quote,
          items: [{ ...quote, SERIAL_NO: quote.SERIAL_NO || "" }],
          itemCount: 1,
        };
      } else {
        grouped[refNo].items.push({
          ...quote,
          SERIAL_NO: quote.SERIAL_NO || "",
        });
        grouped[refNo].itemCount++;
      }
    });
    return Object.values(grouped);
  };

  const fetchLists = async () => {
    try {
      const payload = {
        DataModelName: "INVT_PURCHASE_QUOTMASTER",
        WhereCondition: "",
        OrderBy: "QUOTATION_REF_NO DESC",
      };
      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );

      const groupedResponse = groupedQuotations(response);
      if (response && groupedResponse) {
        setLists(groupedResponse);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const handleSubmit = (e) => {
    alert("Form submitted!");
    setPopup(false);
    setSelectedQuotation(null);
  };

  return (
    <div>
       <h1 className="text-lg font-bold mb-1">RFQ Material List</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-1  items-center justify-center ">
        {dashboards.map((dashboard, index) => (
          <DashBoardCards
            key={index}
            cardtitle={dashboard.title}
            Icon={dashboard.icon}
            color={dashboard.color}
            content={dashboard.content}
            description={dashboard.description}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2">
        <CrudCards
          onclick={() => navigate("/new-rfq")}
          cardtitle={"Create Quotation"}
          color={"bg-blue-100 "}
          textcolor={"text-blue-500"}
          Icon={PlusCircle}
        />
        <CrudCards
          onclick={() => navigate("/rfq-offcial")}
          cardtitle={"Rate Update"}
          color={"bg-green-100 "}
          textcolor={"text-green-500"}
          Icon={RefreshCw}
        />
        <CrudCards
          onclick={() => {}}
          cardtitle={"Rate Shortlist"}
          color={"bg-red-100 "}
          textcolor={"text-red-500"}
          Icon={ListFilter}
        />
        <CrudCards
          onclick={() => navigate("/rfq-rate-comparision")}
          cardtitle={"Rate Comparison"}
          color={"bg-orange-100 "}
          textcolor={"text-orange-500"}
          Icon={GitCompare}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
        {lists.map((item, index) => (
          <QuotationCards
            key={index}
            cardtitle={item.QUOTATION_REF_NO}
            badge={
              getExpirationStatus(
                convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
              ).status
            }
            badgeClass={
              getExpirationStatus(
                convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
              ).badgeClass
            }
            refdate={
              convertServiceDate(item.QUOTATION_REF_DATE) ||
              item.QUOTATION_REF_DATE
            }
            lastdate={
              convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
            }
            description={
              getExpirationStatus(
                convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
              ).daysText
            }
            itemcounts={item.itemCount}
            onclicks={() => {
              setSelectedQuotation(item);
              setPopup(true);
            }}
          />
        ))}
      </div>

      <Dialog open={popup} onOpenChange={setPopup}>
        <DialogContent className="max-w-[70vw] h-[80vh] overflow-auto rounded-xl border border-gray-300 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Quotation Details
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 mb-2 mt-2">
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <Label className="text-sm text-gray-600">
                Quotation Ref Number
              </Label>
              <p className="font-medium text-gray-800">
                {selectedQuotation?.QUOTATION_REF_NO || "-"}
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <Label className="text-sm text-gray-600">Reference Date</Label>
              <p className="font-medium text-gray-800">
                {selectedQuotation
                  ? convertServiceDate(selectedQuotation.QUOTATION_REF_DATE) ||
                    selectedQuotation.QUOTATION_REF_DATE
                  : "-"}
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <Label className="text-sm text-gray-600">Expected Date</Label>
              <p className="font-medium text-gray-800">
                {selectedQuotation
                  ? convertServiceDate(selectedQuotation.EXPECTED_DATE) ||
                    selectedQuotation.EXPECTED_DATE
                  : "-"}
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <Label className="text-sm text-gray-600">Item Count</Label>
              <p className="font-medium text-gray-800">
                {selectedQuotation?.itemCount || "-"}
              </p>
            </div>
          </div>

          {selectedQuotation?.items?.length > 0 && (
            <>
             <Label className="text-base font-semibold text-gray-700">
                Items ({selectedQuotation.itemCount})
              </Label>
           
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-1">
             
              {selectedQuotation.items.map((item, index) => (
                <div key={index} className="">
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer p-2 ">
                    <CardHeader className=" px-1 py-1">
                      <div className="flex items-center gap-2 justify-between truncate">
                        <CardTitle className="text-sm text-indigo-500 font-bold truncate ">
                          {item.SELECTED_VENDOR_NAME}
                        </CardTitle>
                        <Badge
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-lg ${
                            item.UOM !== null
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          UOM : {item.UOM}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-1 py-1">
                      <div className="grid ">
                        <div className="flex items-center  justify-between">
                          <span className="text-gray-500 ">
                            {item.DESCRIPTION}
                          </span>
                          <Badge
                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-lg ${
                              item.QTY !== null
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Qty : {item.QTY}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
               </>
          )}

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RfqMaterialList;
