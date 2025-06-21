import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/api/callSoapService";
import { convertServiceDate } from "@/utils/dateUtils";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const OrderList = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isQuotation = pathname.includes("quotations");

  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    fetchClientList();
  }, [isQuotation]);

  const fetchClientList = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        SQLQuery: `SELECT * FROM SALES_ORDER_MASTER WHERE ${
          isQuotation ? "QUOTATION_NO IS NOT NULL AND QUOTATION_NO != ''" : "ORDER_NO IS NOT NULL AND ORDER_NO != ''"
        } ORDER BY SALES_ORDER_SERIAL_NO DESC`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);
      setTableList(response || []);
    } catch (error) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: `Error fetching ${isQuotation ? "quotations" : "orders"}: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  }, [isQuotation, userData, toast]);

  const handleDelete = useCallback(
    async (item) => {
      const result = window.confirm("Are you sure you want to delete this customer? This action cannot be undone.");
      if (!result) return;

      try {
        const payload = {
          UserName: userData.userEmail,
          DataModelName: "SALES_ORDER_MASTER",
          WhereCondition: `SALES_ORDER_SERIAL_NO = ${item.SALES_ORDER_SERIAL_NO}`,
        };

        const response = await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

        toast({
          title: response,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: error?.message || "Delete failed",
        });
      } finally {
        fetchClientList();
      }
    },
    [userData, fetchClientList, toast, isQuotation],
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

  const additionalButtons = (
    <Button
      variant="destructive"
      disabled={Object.keys(rowSelection).length === 0}
      onClick={() => {
        const selectedClientIds = Object.keys(rowSelection);
        const selectedItems = tableList.filter((row) => selectedClientIds.includes(row.SALES_ORDER_SERIAL_NO.toString()));
        selectedItems.forEach((item) => handleDelete(item));
      }}
    >
      Delete Selected
    </Button>
  );

  return (
    <DataTable
      title={`All ${isQuotation ? "Quotations" : "Orders"}`}
      columns={columns}
      data={tableList}
      loading={loading}
      error={error}
      onCreate={() => navigate(isQuotation ? "/new-quotation" : "/new-order")}
      noResultsText={`No ${isQuotation ? "quotations" : "orders"} found.`}
      additionalToolbarButtons={additionalButtons}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(originalRow) => originalRow.SALES_ORDER_SERIAL_NO.toString()}
    />
  );
};

export default OrderList;
