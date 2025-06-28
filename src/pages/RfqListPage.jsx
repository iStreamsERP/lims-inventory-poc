import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/api/callSoapService";
import DataTable from "@/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { convertServiceDate } from "@/utils/dateUtils";

const RfqListPage = () => {
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});

  const { userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchAllRFQData = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        DataModelName: "INVT_PURCHASE_QUOTMASTER",
        WhereCondition: "",
        Orderby: "QUOTATION_REF_NO DESC",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setTableList(response);
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRFQData();
  }, [userData]);

  const handleDelete = async (service) => {
    const result = window.confirm("Are you sure you want to delete this service? This action cannot be undone.");
    if (!result) return;

    try {
      const payload = {
        UserName: userData.userEmail,
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: `ITEM_CODE = '${service.ITEM_CODE}'`,
      };

      await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

      setTableList((prev) => prev.filter((s) => s.ITEM_CODE !== service.ITEM_CODE));

      toast({
        title: "Service deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message || "Failed to delete service",
      });
    }
  };

  const columns = [
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
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "QUOTATION_REF_NO",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            RFQ Number
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("QUOTATION_REF_NO") || "-"}</div>,
    },
    {
      accessorKey: "QUOTATION_REF_DATE",
      header: "Service Name",
      cell: ({ row }) => (
        <div className="capitalize">{convertServiceDate(row.getValue("QUOTATION_REF_DATE")) || row.getValue("QUOTATION_REF_DATE") || "-"}</div>
      ),
    },
    {
      accessorKey: "GROUP_LEVEL1",
      header: () => <div>Category</div>,
      cell: ({ row }) => <div>{row.getValue("GROUP_LEVEL1") || "-"}</div>,
    },
    {
      accessorKey: "SALE_RATE",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Sale Price
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("SALE_RATE") || "-"}</div>,
    },
    {
      accessorKey: "SALE_UOM",
      header: () => <div>Range</div>,
      cell: ({ row }) => <div>{row.getValue("SALE_UOM") || "-"}</div>,
    },
    {
      accessorKey: "action",
      header: () => <div>Action</div>,
      id: "actions",
      cell: ({ row }) => {
        const service = row.original;
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
                onClick={() => navigate(`/service/${service.ITEM_CODE}`)}
                className="flex items-center gap-1"
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-1 text-red-600"
                onClick={() => handleDelete(service)}
              >
                {" "}
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const additionalButtons = (
    <Button
      variant="destructive"
      disabled={Object.keys(rowSelection).length === 0}
      onClick={() => {
        const selectedClientIds = Object.keys(rowSelection);
        const selectedItems = tableList.filter((row) => selectedClientIds.includes(row.ITEM_CODE.toString()));
        selectedItems.forEach((item) => handleDelete(item));
      }}
    >
      Delete Selected
    </Button>
  );

  return (
    <DataTable
      title="All RFQ"
      columns={columns}
      data={tableList}
      loading={loading}
      error={error}
      onCreate={() => navigate("/new-rfq")}
      noResultsText="No rfq found."
      additionalToolbarButtons={additionalButtons}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(originalRow) => originalRow.ITEM_CODE.toString()}
    />
  );
};

export default RfqListPage;
