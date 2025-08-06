import { callSoapService } from "@/api/callSoapService";
import Header from "@/components/rfqPortal/Header";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Box,
  CalendarDays,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  FileText,
  Info,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { convertServiceDate } from "@/utils/dateUtils";
import getExpirationStatus from "@/utils/rfqportalUtils";
import { useNavigate } from "react-router-dom";
import QuotationCards from "@/components/rfq/QuotationCards";

function RfqOffical() {
  const [quotation, setQuotation] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [openSupplier, setOpenSupplier] = useState(false);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      fetchQuotations();
    } else {
      setQuotation([]); // Clear quotations if no supplier is selected
    }
  }, [selectedSupplier]);

  const groupQuotations = (quotations) => {
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

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const payload = {
        DataModelName: "VENDOR_MASTER",
        WhereCondition: "",
        Orderby: "",
      };
      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );
      console.log("Suppliers response:", response);
      if (response && Array.isArray(response)) {
        setSupplier(response);
      } else {
        setSupplier([]);
        toast({
          variant: "destructive",
          title: "No suppliers found",
          description: "The server returned no supplier data.",
        });
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch suppliers",
        description:
          error.message || "An error occurred while fetching suppliers.",
      });
      setSupplier([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSupplier = (supplierName) => {
    const foundSupplier = supplier.find((s) => s.VENDOR_NAME === supplierName);
    if (foundSupplier) {
      console.log("Selected supplier:", foundSupplier);
      setSelectedSupplier(foundSupplier);
    } else {
      console.warn("No supplier found for:", supplierName);
      setSelectedSupplier(null);
    }
    setOpenSupplier(false);
    setSearchSupplier("");
  };

  const fetchQuotations = async () => {
    if (!selectedSupplier?.VENDOR_ID) {
      console.warn("No VENDOR_ID provided for fetching quotations");
      setQuotation([]);
      return;
    }

    try {
      setLoading(true);
      const vendorId = String(selectedSupplier.VENDOR_ID).trim();
      const payload = {
        DataModelName: "INVT_PURCHASE_QUOTMASTER",
        WhereCondition: `SELECTED_VENDOR = '${vendorId}'`,
        Orderby: "",
      };
      console.log("Quotation fetch payload:", payload);
      const response = await callSoapService(
        userData.clientURL,
        "DataModel_GetData",
        payload
      );
      console.log("Quotations response:", response);

      if (response && Array.isArray(response) && response.length > 0) {
        const groupedQuotations = groupQuotations(response);
        console.log("Grouped quotations:", groupedQuotations);
        setQuotation(groupedQuotations);
      } else {
        setQuotation([]);
        toast({
          variant: "warning",
          title: "No quotations found",
          description: `No quotations found for supplier ${selectedSupplier.VENDOR_NAME} (ID: ${vendorId}).`,
        });
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch quotations",
        description:
          error.message || "An error occurred while fetching quotations.",
      });
      setQuotation([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-1">
        <div className="bg-white p-2 rounded-lg shadow-sm mb-2 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Truck className="h-5 w-5 text-indigo-600" />
            Select Supplier for Quotations
          </h2>
          <div className="flex flex-col gap-2">
            <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
              <PopoverTrigger asChild>
                <Button
                  id="supplier-select"
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSupplier}
                  className="w-full sm:w-[400px] justify-between text-left px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                >
                  {selectedSupplier ? (
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-gray-500" />
                      {`${selectedSupplier.VENDOR_NAME} (ID: ${selectedSupplier.VENDOR_ID})`}
                    </span>
                  ) : (
                    <span className="text-gray-500">Select Supplier...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full sm:w-[400px] p-0 shadow-lg rounded-md border border-gray-200">
                <Command>
                  <CommandInput
                    value={searchSupplier}
                    onValueChange={setSearchSupplier}
                    placeholder="Search supplier by name or ID..."
                    className="h-10 px-4 focus:ring-0 focus:border-0"
                  />
                  <CommandList className="max-h-60 overflow-y-auto">
                    <CommandEmpty className="py-6 text-center text-gray-500">
                      No supplier found.
                    </CommandEmpty>
                    <CommandGroup>
                      {supplier
                        .filter(
                          (suppliers) =>
                            suppliers.VENDOR_NAME.toLowerCase().includes(
                              searchSupplier.toLowerCase()
                            ) ||
                            String(suppliers.VENDOR_ID || "")
                              .toLowerCase()
                              .includes(searchSupplier.toLowerCase())
                        )
                        .map((suppliers) => (
                          <CommandItem
                            key={suppliers.VENDOR_ID}
                            value={suppliers.VENDOR_NAME}
                            onSelect={(currentValue) => {
                              handleSelectSupplier(currentValue);
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-800">
                              {suppliers.VENDOR_NAME} ({suppliers.VENDOR_ID})
                            </span>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedSupplier?.VENDOR_ID ===
                                  suppliers.VENDOR_ID
                                  ? "opacity-100 text-indigo-600"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-600">
            <svg
              className="animate-spin h-6 w-6 mr-3 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Fetching Quotations...
          </div>
        )}

        {quotation.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
            {quotation.map((quoteGroup) => {
              const expirationStatus = getExpirationStatus(
                convertServiceDate(quoteGroup.EXPECTED_DATE)
              );
              console.log(
                "Badge class for",
                quoteGroup.QUOTATION_REF_NO,
                expirationStatus.badgeClass,
                "Converted date:",
                convertServiceDate(quoteGroup.EXPECTED_DATE)
              );
              return (
                <div key={quoteGroup.QUOTATION_REF_NO}>
                  <QuotationCards
                    cardtitle={quoteGroup.QUOTATION_REF_NO}
                     badge={getExpirationStatus(convertServiceDate(quoteGroup.EXPECTED_DATE) || quoteGroup.EXPECTED_DATE).status}
                     badgeClass={getExpirationStatus(convertServiceDate(quoteGroup.EXPECTED_DATE) || item.EXPECTED_DATE).badgeClass}
                    refdate={
                      convertServiceDate(quoteGroup.QUOTATION_REF_DATE) ||
                      quoteGroup.QUOTATION_REF_DATE
                    }
                    lastdate={
                      convertServiceDate(quoteGroup.EXPECTED_DATE) ||
                      quoteGroup.EXPECTED_DATE
                    }
                    description={expirationStatus.daysText}
                    itemcounts={quoteGroup.itemCount}
                    onclicks={() =>
                      navigate(`/rfq-details/${quoteGroup.QUOTATION_REF_NO}`, {
                        state: {
                          quotation: quoteGroup,
                          supplier: selectedSupplier,
                          items: quoteGroup.items.map((item) => ({
                            ...item,
                            SERIAL_NO: item.SERIAL_NO || "",
                          })),
                        },
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : (
          !loading &&
          selectedSupplier && (
            <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-center justify-center gap-3 shadow-sm">
              <Info className="h-5 w-5" />
              <p className="text-base font-medium">
                No quotations found for supplier{" "}
                <span className="font-semibold">
                  {selectedSupplier.VENDOR_NAME}
                </span>{" "}
                (ID:{" "}
                <span className="font-semibold">
                  {selectedSupplier.VENDOR_ID}
                </span>
                ).
              </p>
            </div>
          )
        )}
        {!selectedSupplier && !loading && (
          <div className="mt-1 p-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg flex items-center justify-center gap-3 shadow-sm">
            <Info className="h-5 w-5" />
            <p className="text-base font-medium">
              Please select a supplier to view their quotations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RfqOffical;