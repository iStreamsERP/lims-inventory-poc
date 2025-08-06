import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { callSoapService } from "@/api/callSoapService";
import { Input } from "@/components/ui/input";

const PopoverTable = ({
  data = [],
  onSelectData = () => {},
  onEditData = () => {},
  onDeleteData = () => {},
  columns = [],
  searchFields = [],
  uniqueKey = "ITEM_CODE",
  placeholderText = "Select an item...",
  emptyMessage = "No items found.",
  popoverWidth = "400px",
  dataModelName = "",
  dataModelType = "",
  wherecondition = "",
  orderby = "",
  editingId,
  setEditingId,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableData, setAvailableData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    if (userData?.userName && userData?.clientURL) {
      fetchData();
    }
  }, [userData]);

  useEffect(() => {
    if (isPopoverOpen) {
      setSearchQuery("");
    }
  }, [isPopoverOpen]);

  const fetchData = async () => {
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
  };

  const handleDataSelect = (data) => {
    if (!data) return;
    setIsPopoverOpen(false);
    setSearchQuery("");
    onSelectData(data);
  };

  const isDataSelected = (dataItem) => {
  return dataItem && uniqueKey && dataItem[uniqueKey] && Array.isArray(data)
    ? data.some(
        (d) =>
          d[uniqueKey] === dataItem[uniqueKey] &&
          (d.SUB_MATERIAL_NO || "0") === (dataItem.SUB_MATERIAL_NO || "0")
      )
    : false;
};

  const filteredData = availableData.filter((data) =>
    searchFields.some((field) =>
      String(data[field] || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-2 rounded-lg border p-2 shadow-sm">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="h-8 w-full justify-between bg-white text-xs dark:bg-slate-950"
            disabled={isFetching}
          >
            {isFetching
              ? "Loading data..."
              : data?.length > 0
              ? `${data[0][uniqueKey]} - ${data[0].ITEM_NAME}${
                  data[0].SUB_MATERIAL_NO ? ` - ${data[0].SUB_MATERIAL_NO}` : ""
                }`
              : placeholderText}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" style={{ width: popoverWidth }}>
          <Command className="bg-white dark:bg-slate-950">
            <CommandInput
              placeholder={placeholderText}
              className="h-9"
              value={searchQuery}
              onValueChange={setSearchQuery}
              disabled={isFetching}
            />
            <CommandList>
              {isFetching ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                  <span className="ml-2">Loading data...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {filteredData.map((dataItem) => (
                      <CommandItem
                        key={`${dataItem[uniqueKey]}-${dataItem.SUB_MATERIAL_NO || "0"}`}
                        value={searchFields
                          .map((field) => dataItem[field] || "")
                          .join(" ")
                          .trim()}
                        onSelect={() => handleDataSelect(dataItem)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{dataItem.ITEM_NAME || "Unknown"}</span>
                          <div className="flex gap-2 text-xs text-gray-500">
                            <span>Code: {dataItem[uniqueKey] || "-"}</span>
                            <span>•</span>
                            <span>UOM: {dataItem.UOM_STOCK || "-"}</span>
                            {dataItem.SUB_MATERIAL_NO && (
                              <>
                                <span>•</span>
                                <span>Sub Material: {dataItem.SUB_MATERIAL_NO}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Check
  className={cn(
    "ml-auto h-4 w-4",
    isDataSelected(dataItem) ? "opacity-100" : "opacity-0"
  )}
/>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="h-[calc(68vh-100px)] overflow-auto">
        <Table className="text-xs">
          <TableHeader className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
            <TableRow className="h-8">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "px-2 py-1",
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                  )}
                  style={{ width: col.width }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow
                  key={`${item[uniqueKey]}-${item.SUB_MATERIAL_NO || "0"}-${index}`}
                  className="h-8"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        "px-2 py-1",
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                      )}
                    >
                      {col.key === "index"
                        ? index + 1
                        : col.render
                        ? col.render(item, index, editingId, setEditingId, onDeleteData, onEditData)
                        : item[col.key] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="h-8">
                <TableCell
                  colSpan={columns.length}
                  className="py-4 text-center text-gray-400 md:h-[35vh]"
                >
                  <PackageSearch className="mx-auto mb-3 h-24 w-24 opacity-50" />
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PopoverTable;