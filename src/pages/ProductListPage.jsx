import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
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

const ProductListPage = () => {
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowSelection, setRowSelection] = useState({});

  const { userData } = useAuth();
  const { toast } = useToast();
  const { deleteImage } = useImageAPI();
  const navigate = useNavigate();

  const fetchAllProductsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: "COST_CODE = 'MXXXX' AND ITEM_GROUP = 'PRODUCT'",
        Orderby: "ITEM_CODE DESC",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setTableList(response);
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    fetchAllProductsData();
  }, [fetchAllProductsData]);

  const handleDelete = useCallback(
    async (product) => {
      const result = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
      if (!result) return;

      setLoading(true);
      try {
        const payload = {
          UserName: userData.userEmail,
          DataModelName: "INVT_MATERIAL_MASTER",
          WhereCondition: `ITEM_CODE = '${product.ITEM_CODE}'`,
        };

        await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

        try {
          await deleteImage("product", product.ITEM_CODE);
        } catch (imageError) {
          console.warn("Image deletion failed, but product was deleted", imageError);
        }

        setTableList((prev) => prev.filter((p) => p.ITEM_CODE !== product.ITEM_CODE));

        toast({
          title: "Product deleted successfully",
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
      accessorKey: "ITEM_CODE",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Product Code
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("ITEM_CODE") || "-"}</div>,
    },
    {
      accessorKey: "ITEM_NAME",
      header: "Product Name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("ITEM_NAME") || "-"}</div>,
    },
    {
      accessorKey: "GROUP_LEVEL1",
      header: "Cateogry",
      cell: ({ row }) => <div className="capitalize">{row.getValue("GROUP_LEVEL1") || "-"}</div>,
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
      accessorKey: "action",
      header: () => <div>Action</div>,
      id: "actions",
      // enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
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
                onClick={() => navigate(`/product/${product.ITEM_CODE}`)}
                className="flex items-center gap-1"
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-1 text-red-600"
                onClick={() => handleDelete(product)}
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
      title="All Products"
      columns={columns}
      data={tableList}
      loading={loading}
      error={error}
      onCreate={() => navigate("/new-product")}
      noResultsText="No products found."
      additionalToolbarButtons={additionalButtons}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      getRowId={(originalRow) => originalRow.ITEM_CODE.toString()}
    />
  );
};

export default ProductListPage;
