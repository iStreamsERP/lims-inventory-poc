import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/api/callSoapService";
import { useImageAPI } from "@/hooks/useImageAPI";
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

const CustomerListPage = () => {
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});

  const { userData } = useAuth();
  const { toast } = useToast();
  const { deleteImage } = useImageAPI();
  const navigate = useNavigate();

  const fetchAllCustomersData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        DataModelName: "CLIENT_MASTER",
        WhereCondition: "",
        Orderby: "CLIENT_ID DESC",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setTableList(response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchAllCustomersData();
  }, [fetchAllCustomersData]);

  const handleDelete = useCallback(
    async (customer) => {
      const result = window.confirm("Are you sure you want to delete this customer? This action cannot be undone.");
      if (!result) return;

      setLoading(true);
      try {
        const payload = {
          UserName: userData.userEmail,
          DataModelName: "CLIENT_MASTER",
          WhereCondition: `CLIENT_ID = ${customer.CLIENT_ID}`,
        };

        const response = await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

        setTableList((prev) => prev.filter((c) => c.CLIENT_ID !== customer.CLIENT_ID));

        toast({
          title: "Customer deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: error?.message || "Failed to delete product",
        });
      } finally {
        setLoading(false);
      }
    },
    [userData, toast, deleteImage],
  );

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
      accessorKey: "CLIENT_ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Client ID
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("CLIENT_ID") || "-"}</div>,
    },
    {
      accessorKey: "CLIENT_NAME",
      header: "Client Name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("CLIENT_NAME") || "-"}</div>,
    },
    {
      accessorKey: "TELEPHONE_NO",
      header: "Telephone No",
      cell: ({ row }) => <div className="capitalize">{row.getValue("TELEPHONE_NO") || "-"}</div>,
    },
    {
      accessorKey: "EMAIL_ADDRESS",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Email ID
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("EMAIL_ADDRESS") || "-"}</div>,
    },
    {
      accessorKey: "action",
      header: () => <div>Action</div>,
      id: "actions",
      // enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;
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
                onClick={() => navigate(`/customer/${customer.CLIENT_ID}`)}
                className="flex items-center gap-1"
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-1 text-red-600"
                onClick={() => handleDelete(customer)}
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
      const selectedItems = tableList.filter(row => 
        selectedClientIds.includes(row.CLIENT_ID.toString())
      );
      selectedItems.forEach((item) => handleDelete(item));
    }}
  >
    Delete Selected
  </Button>
);

  return (
    <DataTable
      title="All Customers"
      columns={columns}
      data={tableList}
      loading={loading}
      error={error}
      onCreate={() => navigate("/new-customer")}
      noResultsText="No customer found."
      additionalToolbarButtons={additionalButtons}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(originalRow) => originalRow.CLIENT_ID.toString()}
    />
  );
};

export default CustomerListPage;
