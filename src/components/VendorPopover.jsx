import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronsUpDown, Trash2Icon, Users } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { callSoapService } from "@/api/callSoapService";

const VendorPopoverTable = ({
  selectedData = [],
  onSelectData = () => {},
  onRemoveData = () => {},
  onBadgeClick = () => {},
  onRemoveMaterial = () => {},
  uniqueKey = "VENDOR_ID",
  searchFields = ["VENDOR_NAME", "COUNTRY_NAME", "VENDOR_ID"],
  placeholderText = "Select a vendor...",
  emptyMessage = "No vendors selected.",
  noDataMessage = "No vendors available.",
  popoverWidth = "400px",
  dialogWidth = "625px",
  cardHeight = "68vh",
  dataModelName = "",
  dataModelType = "",
  wherecondition = "",
  orderby = "",
  isDisabled = false,
  vendorDetailsColumns = [],
  openVendorPopup,
  setOpenVendorPopup,
  selectedVendorForPopup,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [availableData, setAvailableData] = useState([]);
  const { userData } = useAuth();

  const fetchData = useCallback(async () => {
    if (!userData?.userName || !userData?.clientURL) return;
    setIsFetching(true);
    try {
      const payload = {
        UserName: userData.userName,
        DataModelName: dataModelName,
        WhereCondition: wherecondition,
        Orderby: orderby,
      };
      const response = await callSoapService(userData.clientURL, dataModelType, payload);
      setAvailableData(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setAvailableData([]);
    } finally {
      setIsFetching(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchData();
  }, [userData]);

  const handleVendorSelection = (vendor) => {
    setIsPopoverOpen(false);
    setSearchQuery("");
    onSelectData(vendor);
  };

  const filteredData = availableData.filter((item) =>
    searchFields.some((field) =>
      String(item[field] || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Card className="w-full overflow-hidden shadow-lg dark:bg-slate-950" style={{ height: cardHeight }}>
      <CardHeader className="border-b px-4 py-[10px]">
        <CardTitle className="whitespace-nowrap text-base font-semibold">
          Vendor Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col overflow-hidden p-4 pt-2" style={{ height: `calc(${cardHeight} - 80px)` }}>
        <div className="flex-shrink-0 space-y-2">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="h-8 w-full justify-between bg-white text-xs dark:bg-slate-950"
                disabled={isDisabled || isFetching}
              >
                {isFetching
                  ? "Loading vendors..."
                  : selectedData.length > 0
                  ? selectedData[selectedData.length - 1].VENDOR_NAME
                  : placeholderText}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: popoverWidth }}>
              <Command className="bg-white dark:bg-slate-950">
                <CommandInput
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>{isFetching ? "Loading..." : "No vendor found."}</CommandEmpty>
                  <CommandGroup>
                    {filteredData.map((vendor) => (
                      <CommandItem
                        key={vendor[uniqueKey]}
                        value={searchFields
                          .map((field) => vendor[field] || "")
                          .join("-")
                          .trim()}
                        className="text-sm"
                        onSelect={() => handleVendorSelection(vendor)}
                      >
                        <div>
                          <div className="font-medium">{vendor.VENDOR_NAME}</div>
                          <div className="flex items-center gap-3 text-xs">
                            <p>{vendor.COUNTRY_NAME}</p>
                            <Badge variant="secondary">{vendor[uniqueKey]}</Badge>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mb-12 mt-4 flex-1 overflow-auto">
          {selectedData.length > 0 ? (
            <div className="space-y-2">
              {selectedData.map((vendor) => (
                <div
                  key={vendor[uniqueKey]}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div>
                    <div className="text-xs font-medium">{vendor.VENDOR_NAME}</div>
                    <div className="mt-1 text-xs text-gray-500">{vendor.COUNTRY_NAME}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className="cursor-pointer truncate rounded-full border px-2 py-1 text-xs"
                      variant="secondary"
                      onClick={() => onBadgeClick(vendor)}
                    >
                      {vendor.materials?.length || 0} {vendor.materials?.length === 1 ? "Item" : "Items"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={(e) => onRemoveData(vendor[uniqueKey], e)}
                      className="rounded-full p-2 hover:bg-red-100 dark:hover:bg-red-800"
                    >
                      <Trash2Icon className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <Users className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p className="font-medium">{emptyMessage}</p>
              <p className="text-sm">{isDisabled ? noDataMessage : "Select vendors to proceed with quotation"}</p>
            </div>
          )}
        </div>
        <Dialog open={openVendorPopup} onOpenChange={setOpenVendorPopup}>
          <DialogContent className={`sm:max-w-[${dialogWidth}]`}>
            <DialogHeader>
              <DialogTitle>Vendor Details - {selectedVendorForPopup?.VENDOR_NAME}</DialogTitle>
              <DialogDescription>Materials assigned to this vendor</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    {vendorDetailsColumns.map((col) => (
                      <TableHead
                        key={col.key}
                        className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}
                        style={{ width: col.width }}
                      >
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedVendorForPopup?.materials?.length > 0 ? (
                    selectedVendorForPopup.materials.map((m, index) => (
                      <TableRow key={`${m.ITEM_CODE}-${index}`}>
                        {vendorDetailsColumns.map((col) => (
                          <TableCell
                            key={col.key}
                            className={col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}
                          >
                            {col.render
                              ? col.render(m, index, onRemoveMaterial)
                              : m[col.key] || "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={vendorDetailsColumns.length}
                        className="py-8 text-center text-gray-500"
                      >
                        No materials assigned to this vendor.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default VendorPopoverTable;