import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { callSoapService } from "@/services/callSoapService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { convertServiceDate } from "@/utils/dateUtils";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Check, ChevronsUpDown, Settings2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// Define initial master form data outside the component
const initialMasterFormData = {
  COMPANY_CODE: 1,
  BRANCH_CODE: 1,
  SALES_ORDER_SERIAL_NO: -1,
  ORDER_NO: "ORDER-" + new Date().getTime(),
  ORDER_DATE: new Date().toISOString().split("T")[0],
  QUOTATION_NO: "QUOTATION-" + new Date().getTime(),
  QUOTATION_DATE: new Date().toISOString().split("T")[0],
  CLIENT_ID: null,
  CLIENT_NAME: null,
  ORDER_CATEGORY: "",
  TOTAL_VALUE: 0,
  DISCOUNT_VALUE: 0,
  NET_VALUE: 0,
  AMOUNT_IN_WORDS: "",
  CURRENCY_NAME: "Rupees",
  NO_OF_DECIMALS: 0,
  EXCHANGE_RATE: 0,
  ORDER_VALUE_IN_LC: 0,
  MODE_OF_PAYMENT: "Static",
  CREDIT_DAYS: 0,
  ADVANCE_AMOUNT: 0,
  MODE_OF_TRANSPORT: "",
  DELIVERY_DATE: "",
  DELIVERY_ADDRESS: "",
  TERMS_AND_CONDITIONS: "",
  DELETED_STATUS: "F",
  DELETED_DATE: "",
  DELETED_USER: "",
  USER_NAME: "",
  ENT_DATE: "",
};

const OrderFormPage = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [itemData, setItemData] = useState([]);
  const [categoryData, setCategoryData] = useState("ALL");
  const [openProduct, setOpenProduct] = useState(false);

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false);

  const [itemValue, setItemValue] = useState("");
  const [customerValue, setCustomerValue] = useState("");

  const [tableData, setTableData] = useState([]);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, columnId: null });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    // DISCOUNT_VALUE: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const [editingDiscountRowId, setEditingDiscountRowId] = useState(null);
  // const [discountInputs, setDiscountInputs] = useState({ percentage: 0, value: 0 });

  // Determine document type
  const isQuotation = location.pathname.includes("quotation");
  const isEditMode = Boolean(id);
  const isViewMode = location.pathname.includes("view");
  const docTypeLabel = isQuotation ? "Quotation" : "Order";

  // Master Form state
  const [masterFormData, setMasterFormData] = useState(initialMasterFormData);

  // Detail Form Data
  const [detailsFormData, setDetailsFormData] = useState({
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    SALES_ORDER_SERIAL_NO: masterFormData.SALES_ORDER_SERIAL_NO,
    ORDER_NO: "",
    ORDER_DATE: new Date().toISOString().split("T")[0],
    SERIAL_NO: -1,
    ITEM_CODE: "",
    SUB_MATERIAL_NO: "",
    DESCRIPTION: "",
    UOM_SALES: "",
    UOM_STOCK: "",
    CONVERSION_RATE: 1,
    QTY: 0,
    QTY_STOCK: 0,
    CONVRATE_TO_MASTER: 0,
    QTY_TO_MASTER: 0,
    RATE: 0,
    VALUE: 0,
    DISCOUNT_VALUE: 0,
    DISCOUNT_RATE: 0,
    NET_VALUE: 0,
    VALUE_IN_LC: 0,
    DELETED_STATUS: 0,
    USER_NAME: userData.userEmail,
    ENT_DATE: "",
    TRANSPORT_CHARGE: "",
  });

  // Add this useEffect to determine order category from table items and calculate financial values
  useEffect(() => {
    const orderCategories = Array.from(new Set(tableData.map((item) => item.ORDER_CATEGORY)));

    let finalCategory = "";
    if (orderCategories.length === 1) {
      finalCategory = orderCategories[0];
    } else if (orderCategories.length > 1) {
      finalCategory = "ALL";
    }

    const totalValue = tableData.reduce((sum, item) => {
      const rate = item.SALE_RATE || item.RATE || 0;
      return sum + item.QTY * rate;
    }, 0);
    const totalDiscount = tableData.reduce((sum, item) => sum + (item.DISCOUNT_VALUE || 0), 0);
    const netValue = totalValue - totalDiscount;

    setMasterFormData((prev) => ({
      ...prev,
      ORDER_CATEGORY: finalCategory,
      TOTAL_VALUE: totalValue,
      DISCOUNT_VALUE: totalDiscount,
      NET_VALUE: netValue,
      ORDER_VALUE_IN_LC: netValue,
    }));
  }, [tableData]);

  // Fetch items and UOM
  useEffect(() => {
    fetchItemList();
  }, [categoryData, userData]);

  // Reset state when id changes
  useEffect(() => {
    if (!isEditMode) {
      setMasterFormData(initialMasterFormData);
      setTableData([]);
      setSelectedClient(null);
      setCustomerValue("");
    }
  }, [id, isEditMode]);

  // Fetch existing data only in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    fetchExistingMasterData();
    fetchExistingDetailData();
  }, [id, isEditMode, userData]);

  // Fetch clients
  useEffect(() => {
    fetchClientData();
  }, [userData]);

  const fetchItemList = async () => {
    const baseCondition = `COST_CODE = 'MXXXX'`;
    const itemGroupCondition = categoryData !== "ALL" ? ` AND ITEM_GROUP = '${categoryData}'` : "";

    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER_VIEW",
        WhereCondition: baseCondition + itemGroupCondition,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);

      setItemData(response || []);
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: err?.message || "Error fetching items" });
    }
  };

  const fetchExistingMasterData = async () => {
    try {
      const payload = {
        DataModelName: "SALES_ORDER_MASTER",
        WhereCondition: `SALES_ORDER_SERIAL_NO = '${id}'`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);

      if (response?.[0]) {
        setMasterFormData(response[0]);
        setSelectedClient({
          CLIENT_ID: response[0].CLIENT_ID,
          CLIENT_NAME: response[0].CLIENT_NAME,
        });
        setCustomerValue(response[0].CLIENT_NAME);
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: err?.message || "Error loading order data" });
    }
  };

  const fetchExistingDetailData = async () => {
    if (!isEditMode) return;

    try {
      const payload = {
        DataModelName: "SALES_ORDER_DETAILS",
        WhereCondition: `SALES_ORDER_SERIAL_NO = ${id}`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);

      const dataWithIds = (response || []).map((item) => ({
        ...item,
        id: item.SERIAL_NO?.toString() || Math.random().toString(36).substr(2, 9),
      }));

      setTableData(dataWithIds);
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: err?.message || "Error loading order items" });
    }
  };

  const fetchClientData = async () => {
    try {
      const payload = { SQLQuery: `SELECT CLIENT_ID, CLIENT_NAME, COUNTRY, CITY_NAME, TELEPHONE_NO FROM CLIENT_MASTER` };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      setClientData(response || []);
    } catch (error) {
      toast({ variant: "destructive", title: `Error fetching client: ${error.message}` });
    }
  };

  const handleSelectItem = (item) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    setItemValue(item.ITEM_NAME);
    setOpenProduct(false);

    const qty = 1;
    const rate = item.SALE_RATE;
    const discountPercent = item.DISCOUNT_PERCENTAGE || 0;
    const discountValue = qty * rate * (discountPercent / 100);
    const netValue = qty * rate - discountValue;

    setTableData((prev) => [
      ...prev,
      {
        id: tempId,
        ITEM_CODE: item.ITEM_CODE,
        ITEM_NAME: item.ITEM_NAME,
        SERIAL_NO: -1,
        SUB_MATERIAL_NO: item.SUB_MATERIAL_NO,
        ORDER_CATEGORY: item.ITEM_GROUP,
        CONVRATE_TO_MASTER: item.CONVRATE_TO_MASTER,
        UOM_STOCK: item.UOM_STOCK,
        QTY_IN_HAND: item.QTY_IN_HAND,
        QTY: qty,
        SALE_RATE: rate,
        DISCOUNT_PERCENTAGE: discountPercent,
        DISCOUNT_VALUE: discountValue,
        NET_VALUE: netValue,
      },
    ]);
  };

  // Handle selecting client
  const handleSelectClient = (name) => {
    const client = clientData.find((c) => c.CLIENT_NAME === name) || null;
    setSelectedClient(client);
    setMasterFormData((prev) => ({
      ...prev,
      CLIENT_ID: client?.CLIENT_ID,
      CLIENT_NAME: client?.CLIENT_NAME,
    }));
    setCustomerValue(name);
    setOpenCustomer(false);
  };

  // Filtered for command
  const filteredClients = clientData.filter((c) => c.CLIENT_NAME.toLowerCase().includes(customerValue.toLowerCase()));

  const handleCellChange = (rowIndex, columnId, value) => {
    setTableData((prev) => {
      const newData = [...prev];
      const currentRow = newData[rowIndex];
      const newValue = parseFloat(value) || 0;

      // Quantity validation
      if (columnId === "QTY") {
        if (newValue > currentRow.QTY_IN_HAND) {
          toast({
            variant: "destructive",
            title: "Quantity exceeds available stock",
            description: `Available: ${currentRow.QTY_IN_HAND}`,
          });
          return prev;
        }
      }

      // Update the changed cell
      newData[rowIndex] = {
        ...currentRow,
        [columnId]: newValue,
      };

      // Recalculate dependent values
      if (["QTY", "SALE_RATE", "DISCOUNT_PERCENTAGE", "DISCOUNT_VALUE", "DISCOUNT_PERCENTAGE"].includes(columnId)) {
        const qty = newData[rowIndex].QTY;
        const rate = newData[rowIndex].SALE_RATE;
        let discountValue = 0;

        // Handle both percentage and flat discount
        if (newData[rowIndex].DISCOUNT_PERCENTAGE > 0) {
          discountValue = qty * rate * (newData[rowIndex].DISCOUNT_PERCENTAGE / 100);
        } else {
          discountValue = newData[rowIndex].DISCOUNT_VALUE || 0;
        }

        newData[rowIndex] = {
          ...newData[rowIndex],
          DISCOUNT_VALUE: discountValue,
          NET_VALUE: qty * rate - discountValue,
        };
      }

      return newData;
    });
  };

  const DiscountCell = ({ row }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [discountInputs, setDiscountInputs] = useState({
      percentage: row.original.DISCOUNT_PERCENTAGE || 0,
      value: row.original.DISCOUNT_VALUE || 0,
    });

    const qty = row.original.QTY;
    const rate = row.original.SALE_RATE || row.original.RATE || 0;

    const handleSave = () => {
      setTableData((prev) => {
        return prev.map((item) => {
          if (item.id === row.original.id) {
            return {
              ...item,
              DISCOUNT_PERCENTAGE: discountInputs.percentage,
              DISCOUNT_VALUE: discountInputs.value,
              NET_VALUE: qty * rate - discountInputs.value,
            };
          }
          return item;
        });
      });
      setIsOpen(false);
    };

    return (
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full text-right"
            disabled={isViewMode}
          >
            <div>{row.original.DISCOUNT_VALUE.toFixed(2)}</div>
            <div className="text-xs text-red-500">({row.original.DISCOUNT_PERCENTAGE}%)</div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Percentage</Label>
              <Input
                type="number"
                value={discountInputs.percentage}
                onChange={(e) => {
                  const newPct = parseFloat(e.target.value) || 0;
                  const newVal = (qty * rate * newPct) / 100;
                  setDiscountInputs({ percentage: newPct, value: newVal });
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Value</Label>
              <Input
                type="number"
                value={discountInputs.value}
                onChange={(e) => {
                  const newVal = parseFloat(e.target.value) || 0;
                  const newPct = (newVal / (qty * rate)) * 100 || 0;
                  setDiscountInputs({ value: newVal, percentage: newPct });
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const columns = [
    {
      accessorKey: "ITEM_NAME",
      header: "Items",
      size: 180,
      cell: ({ row }) => {
        return (
          <div className="flex w-full flex-col gap-0 leading-none">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{row.original.ITEM_CODE}</span>
            </div>
            <p className="w-full whitespace-nowrap text-sm">{row.original.ITEM_NAME || row.original.DESCRIPTION}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "UOM_STOCK",
      header: "UOM",
      size: 50,
      cell: ({ row }) => <p>{row.original.UOM_STOCK}</p>,
    },
    {
      accessorKey: "QTY",
      header: "Qty",
      size: 50,
      cell: ({ row }) => <div className="capitalize">{row.getValue("QTY") || "-"}</div>,
    },
    {
      accessorKey: "SALE_RATE",
      header: () => <div className="text-right">Rate</div>,
      size: 80,
      cell: ({ row }) => <div className="text-right">{row.original.SALE_RATE || row.original.RATE}</div>,
    },
    {
      accessorKey: "ITEM_RATE",
      header: () => <div className="text-right">Value</div>,
      size: 80,
      cell: ({ row }) => {
        return <div className="text-right">{row.original.QTY * (row.original.SALE_RATE || row.original.RATE)}</div>;
      },
    },
    {
      accessorKey: "DISCOUNT_VALUE",
      header: () => <div className="text-right">Discount Value</div>,
      enableHiding: false,
      size: 80,
      cell: ({ row }) => <DiscountCell row={row} />,
    },
    {
      accessorKey: "NET_VALUE",
      header: () => <div className="text-right">Net Value</div>,
      size: 80,
      cell: ({ row }) => <div className="text-right capitalize">{(row.original.NET_VALUE || 0).toFixed(2)}</div>,
    },
    {
      accessorKey: "action",
      header: () => <div></div>,
      id: "actions",
      size: 65,
      cell: isViewMode
        ? () => null
        : ({ row }) => {
            const product = row.original;
            return (
              <Button
                onClick={() => handleDelete(product)}
                className="flex items-center gap-1 text-red-600"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            );
          },
    },
  ];

  const fuzzyFilter = (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return String(value || "")
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  };

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    initialState: {
      columnVisibility: {
        // DISCOUNT_VALUE: false,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const handleDelete = async (product) => {
    const isConfirmDelete = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");
    if (!isConfirmDelete) return;

    if (isEditMode) {
      try {
        const payload = {
          UserName: userData.userEmail,
          DataModelName: "SALES_ORDER_DETAILS",
          WhereCondition: `SERIAL_NO = '${product.SERIAL_NO}'`,
        };

        const response = await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

        toast({ title: response });
      } catch (err) {
        toast({ variant: "destructive", title: err.message });
      } finally {
        fetchExistingDetailData();
      }
    } else {
      setTableData((prev) => prev.filter((item) => item.id !== product.id));
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      return toast({ variant: "destructive", title: "Please select a customer." });
    }

    try {
      setLoading(true);
      const payloadModel = {
        ...masterFormData,
        ORDER_NO: isQuotation ? "" : masterFormData.ORDER_NO,
        QUOTATION_NO: isQuotation ? masterFormData.QUOTATION_NO : "",
        ORDER_DATE: isQuotation ? "" : masterFormData.ORDER_DATE,
        QUOTATION_DATE: isQuotation ? masterFormData.QUOTATION_DATE : "",
      };

      const payload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", payloadModel),
      };

      const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);

      const m = response.match(/Serial No\s*'(\d+)'/);
      const newSerialNo = m ? parseInt(m[1], 10) : null;

      if (typeof response === "string" && response.trim().startsWith("Error")) {
        throw new Error(response);
      }

      if (!newSerialNo) {
        throw new Error("Could not parse new order serial number from response");
      }

      const itemsToSend = tableData;

      // 2) now send each item as a DETAIL record
      for (let i = 0; i < itemsToSend.length; i++) {
        const item = itemsToSend[i];
        const lineValue = item.QTY * item.SALE_RATE;
        console.log("item", item);

        const detailModal = {
          ...detailsFormData,
          COMPANY_CODE: masterFormData.COMPANY_CODE,
          BRANCH_CODE: masterFormData.BRANCH_CODE,
          SALES_ORDER_SERIAL_NO: newSerialNo,
          ORDER_NO: isQuotation ? "" : masterFormData.ORDER_NO,
          QUOTATION_NO: isQuotation ? masterFormData.QUOTATION_NO : "",
          ORDER_DATE: isQuotation ? "" : masterFormData.ORDER_DATE,
          QUOTATION_DATE: isQuotation ? masterFormData.QUOTATION_DATE : "",
          SERIAL_NO: item.SERIAL_NO,
          ITEM_CODE: item.ITEM_CODE,
          SUB_MATERIAL_NO: item.SUB_MATERIAL_NO,
          DESCRIPTION: item.ITEM_NAME,
          UOM_SALES: item.UOM_STOCK,
          UOM_STOCK: item.UOM_STOCK,
          CONVERSION_RATE: 1,
          QTY: item.QTY,
          QTY_STOCK: item.QTY,
          CONVRATE_TO_MASTER: 1,
          QTY_TO_MASTER: item.QTY,
          RATE: item.SALE_RATE,
          VALUE: lineValue,
          DISCOUNT_VALUE: item.DISCOUNT_VALUE,
          DISCOUNT_RATE: 0,
          NET_VALUE: item.NET_VALUE,
          VALUE_IN_LC: lineValue,
          TRANSPORT_CHARGE: 0,
          DELETED_STATUS: "F",
          USER_NAME: userData.userEmail,
          ENT_DATE: "",
        };

        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("SALES_ORDER_DETAILS", detailModal),
        };

        const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
      }

      toast({
        title: "Order Saved Successfully",
        description: response,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.",
        description: error?.message || "Unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Main form */}
        <Card className="col-span-12 lg:col-span-9">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between text-sm">
                <p>
                  {docTypeLabel} No :{" "}
                  <span className="text-purple-500">
                    {isEditMode ? (isQuotation ? masterFormData.QUOTATION_NO : masterFormData.ORDER_NO) : "(New)"}
                  </span>
                </p>
                <p>
                  {docTypeLabel} Date :{" "}
                  <span className="text-gray-500">
                    {isEditMode
                      ? isQuotation
                        ? convertServiceDate(masterFormData.QUOTATION_DATE)
                        : convertServiceDate(masterFormData.ORDER_DATE)
                      : isQuotation
                        ? masterFormData.QUOTATION_DATE
                        : masterFormData.ORDER_DATE}
                  </span>
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Category & product select */}
            {!isViewMode && (
              <div className="mb-4 flex items-center gap-3">
                <Select
                  value={categoryData}
                  onValueChange={setCategoryData}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="PRODUCT">Product</SelectItem>
                      <SelectItem value="SERVICE">Service</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Popover
                  open={openProduct}
                  onOpenChange={setOpenProduct}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-between"
                    >
                      {itemValue || "Select item..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search by name or code..." />
                      <CommandList>
                        <CommandEmpty>No data found.</CommandEmpty>
                        <CommandGroup>
                          {itemData.map((item, index) => {
                            const isSelected = itemValue === item.ITEM_NAME;
                            const combinedValue = `${item.ITEM_CODE} ${item.ITEM_NAME}`;

                            return (
                              <CommandItem
                                key={index}
                                value={combinedValue}
                                onSelect={() => handleSelectItem(item)}
                              >
                                <span>
                                  {item.ITEM_CODE} - <span>{item.ITEM_NAME}</span>
                                </span>
                                <Check className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Table */}
            <div className="mb-2 flex items-center gap-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Settings2 /> View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="rounded-md border">
              <Table style={{ tableLayout: "fixed" }}>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            style={{
                              width: header.column.getSize(),
                              minWidth: header.column.getSize(),
                            }}
                          >
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, rowIndex) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const cid = cell.column.id;
                          const isEditable = !isViewMode && ["QTY", "SALE_RATE"].includes(cid);
                          const isEditing = editingCell.rowIndex === rowIndex && editingCell.columnId === cid;
                          const cellValue = cell.getValue();

                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                width: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              onClick={() => {
                                if (isEditable) {
                                  setEditingCell({ rowIndex, columnId: cid });
                                }
                              }}
                              className={isEditable ? "cursor-pointer" : ""}
                            >
                              {isEditable ? (
                                isEditing ? (
                                  <Input
                                    autoFocus
                                    defaultValue={cellValue}
                                    onBlur={(e) => {
                                      handleCellChange(rowIndex, cid, e.target.value);
                                      setEditingCell({ rowIndex: null, columnId: null });
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.target.blur();
                                      }
                                    }}
                                    className="h-fit px-2 py-0"
                                  />
                                ) : (
                                  flexRender(cell.column.columnDef.cell, cell.getContext())
                                )
                              ) : (
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No items found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="col-span-12 space-y-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Select Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover
                open={openCustomer}
                onOpenChange={setOpenCustomer}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={isViewMode}
                  >
                    {customerValue || "Select..."} <ChevronsUpDown />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search..."
                      value={customerValue}
                      onValueChange={setCustomerValue}
                    />
                    <CommandList>
                      <CommandEmpty>No customers</CommandEmpty>
                      <CommandGroup>
                        {filteredClients.map((c) => (
                          <CommandItem
                            key={c.CLIENT_ID}
                            value={c.CLIENT_NAME}
                            onSelect={handleSelectClient}
                          >
                            {c.CLIENT_NAME}
                            <Check className={cn("ml-auto", customerValue === c.CLIENT_NAME ? "opacity-100" : "opacity-0")} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{tableData.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal (Before Discount):</span>
                  <span>{tableData.reduce((sum, r) => sum + r.QTY * r.SALE_RATE, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>{tableData.reduce((sum, r) => sum + (r.DISCOUNT_VALUE || 0), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Order Total:</span>
                  <span>{(tableData.reduce((sum, r) => sum + r.NET_VALUE, 0) * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>

            {!isViewMode && (
              <CardFooter className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSubmit}
                >
                  {loading ? "Saving…" : "Save my order"}
                </Button>
                <Button className="w-full">
                  <Check /> Proceed To Pay
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderFormPage;
