import { callSoapService } from "@/api/callSoapService";
import CrudCards from "@/components/rfq/CrudCards";
import DashBoardCards from "@/components/rfq/DashBoardCards";
import QuotationCards from "@/components/rfq/QuotationCards";
import { useAuth } from "@/contexts/AuthContext";
import { convertServiceDate } from "@/utils/dateUtils";
import getExpirationStatus from "@/utils/rfqPortalUtils";
import {
  CheckCircle,
  ClockIcon,
  FileText,
  List,
  ListFilter,
  PlusCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RfqRateComparisionPortal() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = React.useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

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
  console.log("Lists:", lists);

  const fetchLists = async () => {
    debugger;
    try {
      const payload = {
        DataModelName: "INVT_PURCHASE_QUOTMASTER",
        WhereCondition: "",
        OrderBy: "QUOTATION_REF_NO DESC",
      };
      console.log("Fetching lists with payload:", payload);
      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );

      console.log("Response from API:", response);
      const groupedResponse = groupedQuotations(response);
      if (response && response) {
        setLists(groupedResponse);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const [dashboards, setDashboards] = React.useState([
    {
      title: "Total Quotations",
      icon: FileText,
      color: "text-blue-500",
      content: lists.length || 0, // Default to 0 if lists is undefined
      description: "Total number of quotations",
    },
    {
      title: "Active",
      icon: CheckCircle,
      color: "text-green-500",
      content: lists.length || 0, // Default to 0 if lists is undefined
      description: "Valid quotations",
    },
    {
      title: "Expiring Soon",
      icon: ClockIcon,
      color: "text-yellow-500",
      content: lists.length || 0, // Default to 0 if lists is undefined
      description: "Need attention",
    },
    {
      title: "Expired",
      icon: XCircle,
      color: "text-red-500",
      content: lists.length || 0, // Default to 0 if lists is undefined
      description: "Require renewal",
    },
  ]);

  return (
    <div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-1 items-center justify-center bg-gray-100">
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
      </div> */}
      <h1 className="text-xl font-bold">Rate Comparision</h1>
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
          cardtitle={"Rate shortlist"}
          color={"bg-red-100 "}
          textcolor={"text-red-500"}
          Icon={ListFilter}
        />
        <CrudCards
          onclick={() => {navigate("/rfq-material-list")}}
          cardtitle={"Material List"}
          color={"bg-blue-100 "}
          textcolor={"text-blue-500"}
          Icon={List}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-2">
        {lists.map((item, index) => (
          <QuotationCards
            key={index}
            cardtitle={item.QUOTATION_REF_NO}
           badge={getExpirationStatus(
              convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
            ).status}
            badgeClass={getExpirationStatus(
              convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
            ).badgeClass}
            refdate={
              convertServiceDate(item.QUOTATION_REF_DATE) ||
              item.QUOTATION_REF_DATE
            }
            lastdate={
              convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
            }
            description={getExpirationStatus(
              convertServiceDate(item.EXPECTED_DATE) || item.EXPECTED_DATE
            ).daysText}
            itemcounts={item.itemCount}
            onclicks={() =>
              navigate(`/rfq-rate-updates/${item.QUOTATION_REF_NO}`)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default RfqRateComparisionPortal;
