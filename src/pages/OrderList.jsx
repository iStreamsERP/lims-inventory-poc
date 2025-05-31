import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import { convertServiceDate } from "@/utils/dateUtils";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

const OrderList = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isQuotation = pathname.includes("quotations");

  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    fetchClientList();
  }, [isQuotation]);

  const fetchClientList = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        SQLQuery: `SELECT * FROM SALES_ORDER_MASTER WHERE ${isQuotation ? "QUOTATION_NO IS NOT NULL AND QUOTATION_NO != ''" : "ORDER_NO IS NOT NULL AND ORDER_NO != ''"} ORDER BY SALES_ORDER_SERIAL_NO DESC`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      setTableList(response || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client list: ${error.message}`,
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [isQuotation, userData, toast]);

  const handleDelete = useCallback(
    async (item, isMultipleItem) => {
      if (!isMultipleItem) {
        const isConfirmed = window.confirm("Are you sure you want to delete? This action cannot be undone.");
        if (!isConfirmed) return;
      }

      try {
        const payload = {
          UserName: userData.userEmail,
          DataModelName: "SALES_ORDER_MASTER",
          WhereCondition: `SALES_ORDER_SERIAL_NO = ${item.SALES_ORDER_SERIAL_NO}`,
        };

        const response = await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

        if (typeof response === "string" && response.trim().toLowerCase().startsWith("error")) {
          toast({
            variant: "destructive",
            title: `Delete failed for Order No: ${item.SALES_ORDER_SERIAL_NO}`,
            description: response,
          });
        } else {
          toast({
            title: `Deleted Order No: ${item.SALES_ORDER_SERIAL_NO}`,
            description: response,
          });
        }
      } catch (error) {
        console.error("Error deleting order:", error);

        toast({
          variant: "destructive",
          title: error?.message || "Unknown error occurred.",
        });
      } finally {
        fetchClientList();
      }
    },
    [userData, fetchClientList, toast],
  );

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={() => {
              row.toggleSelected();
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "SALES_ORDER_SERIAL_NO",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0"
            >
              S.No
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue("SALES_ORDER_SERIAL_NO")}</div>,
      },
      {
        accessorKey: isQuotation ? "QUOTATION_NO" : "ORDER_NO",
        header: isQuotation ? "Quotation No" : "Order No",
        cell: ({ row }) => <div className="capitalize">{isQuotation ? row.getValue("QUOTATION_NO") : row.getValue("ORDER_NO")}</div>,
      },
      {
        accessorKey: "CLIENT_NAME",
        header: "Customer Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("CLIENT_NAME")}</div>,
      },
      {
        accessorKey: "ORDER_CATEGORY",
        header: "Category",
        cell: ({ row }) => <div className="capitalize">{row.getValue("ORDER_CATEGORY")}</div>,
      },
      {
        accessorKey: "NET_VALUE",
        header: "Net Value",
        cell: ({ row }) => <div className="capitalize">{row.getValue("NET_VALUE")}</div>,
      },
      {
        accessorKey: "USER_NAME",
        header: "User Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("USER_NAME")}</div>,
      },
      {
        accessorKey: `${isQuotation ? "QUOTATION_DATE" : "ORDER_DATE"}`,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0"
            >
              {isQuotation ? "Quotation Date" : "Order Date"}
              <ArrowUpDown />
            </Button>
          );
        },
        cell: ({ row }) => <div>{convertServiceDate(row.getValue(`${isQuotation ? "QUOTATION_DATE" : "ORDER_DATE"}`))}</div>,
      },
      {
        accessorKey: "action",
        header: () => <div>Action</div>,
        id: "actions",
        // enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate(`/${isQuotation ? "view-quotation" : "view-order"}/${item.SALES_ORDER_SERIAL_NO}`)}
                  className="flex items-center gap-1"
                >
                  <Eye /> View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/${isQuotation ? "edit-quotation" : "edit-order"}/${item.SALES_ORDER_SERIAL_NO}`)}
                  className="flex items-center gap-1"
                >
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-1 text-red-600"
                  onClick={() => handleDelete(item)}
                >
                  {" "}
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [isQuotation, navigate, handleDelete],
  );

  const fuzzyFilter = (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    return String(value || "")
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  };

  const table = useReactTable({
    data: tableList,
    columns,
    onSortingChange: setSorting,
    getRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">All {isQuotation ? "Quotations" : "Orders"}</h1>
      <div className="w-full">
        <div className="grid grid-cols-1 items-center gap-2 pb-2 sm:grid-cols-2">
          <Input
            placeholder="Global Search..."
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto"
                >
                  <Settings2 /> View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="destructive"
              disabled={Object.keys(rowSelection).length === 0}
              onClick={() => {
                const selectedItems = table.getSelectedRowModel().rows.map((row) => row.original);
                selectedItems.forEach((item) => handleDelete(item, true));
              }}
            >
              Delete Selected
            </Button>

            <Button onClick={() => navigate(`${isQuotation ? "/new-quotation" : "/new-order"}`)}>
              Create
              <Plus />
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <PacmanLoader color="#6366f1" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-red-500"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No products found.
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
      </div>
    </div>
  );
};

export default OrderList;
