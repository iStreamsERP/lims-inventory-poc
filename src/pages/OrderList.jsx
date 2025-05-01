import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Plus, Settings2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { deleteDataModelService, getDataModelFromQueryService, getDataModelService } from "@/services/dataModelService"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PacmanLoader } from "react-spinners"
import { convertServiceDate } from "@/utils/dateUtils"

const OrderList = () => {
    const [tableList, setTableList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState("")
    const { userData } = useAuth();
    const { toast } = useToast()
    const navigate = useNavigate();

    useEffect(() => {
        fetchClientList();
    }, [])


    const fetchClientList = async () => {
        setLoading(true);
        try {
            const payload = {
                SQLQuery: `SELECT * FROM SALES_ORDER_MASTER ORDER BY SALES_ORDER_SERIAL_NO DESC`,
            };

            const response = await getDataModelFromQueryService(
                payload,
                userData.currentUserLogin,
                userData.clientURL
            );

            setTableList(response || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: `Error fetching client list: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageDelete = async (newItemCode) => {
        setLoading(true);

        try {
            const email = encodeURIComponent(userData.currentUserLogin);
            const fileName = encodeURIComponent(`PRODUCT_IMAGE_${newItemCode}`);
            const url = `https://cloud.istreams-erp.com:4499/api/MaterialImage/delete?email=${email}&fileName=${fileName}`;

            const response = await axios.delete(url);

            if (response.status === 200) {
                toast({
                    title: response.data.message,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: `Image delete failed with status: ${response.status}`,
                });
            }

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error deleting image.",
                description:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unknown error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (product) => {
        window.confirm("Are you sure you want to delete this product? This action cannot be undone.");

        try {
            const deleteProductPayload = {
                UserName: userData.currentUserLogin,
                DataModelName: "INVT_MATERIAL_MASTER",
                WhereCondition: `ITEM_CODE = '${product.ITEM_CODE}'`,
            };

            const deleteProductResponse = await deleteDataModelService(
                deleteProductPayload,
                userData.currentUserLogin,
                userData.clientURL
            );

            toast({
                variant: "destructive",
                title: deleteProductResponse,
            })

            await handleImageDelete(product.ITEM_CODE);

            fetchAllProductsData();
        } catch (error) {
            console.error("Error deleting product:", error);

            toast({
                variant: "destructive",
                title: error?.message || "Unknown error occurred.",
            });
        }
    };

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
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
            accessorKey: "SALES_ORDER_SERIAL_NO",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0"
                    >
                        Sales Order
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("SALES_ORDER_SERIAL_NO") || "-"}</div>
            ),
        },
        {
            accessorKey: "ORDER_NO",
            header: "Order No",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("ORDER_NO") || "-"}</div>
            ),
        },
        {
            accessorKey: "CLIENT_NAME",
            header: "Customer Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("CLIENT_NAME") || "-"}</div>
            ),
        },
        {
            accessorKey: "NET_VALUE",
            header: "Net Value",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("NET_VALUE") || "-"}</div>
            ),
        },
        {
            accessorKey: "TOTAL_VALUE",
            header: "Total Value",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("TOTAL_VALUE") || "-"}</div>
            ),
        },
        {
            accessorKey: "USER_NAME",
            header: "User Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("USER_NAME") || "-"}</div>
            ),
        },
        {
            accessorKey: "ORDER_DATE",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0"
                    >
                        Order Date
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{convertServiceDate(row.getValue("ORDER_DATE")) || "-"}</div>,
        },
        {
            accessorKey: "action",
            header: () => <div>Action</div>,
            id: "actions",
            // enableHiding: false,
            cell: ({ row }) => {
                const product = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/product/${product.ITEM_CODE}`)} className="flex items-center gap-1"><Pencil /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 flex items-center gap-1" onClick={() => handleDelete(product)}> <Trash2 /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },

    ]

    console.log(tableList[0]);
    

    const fuzzyFilter = (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        return String(value || "").toLowerCase().includes(filterValue.toLowerCase());
    };

    const table = useReactTable({
        data: tableList,
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
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    })

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">All Orders</h1>
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2 items-center">
                    <Input
                        placeholder="Global Search..."
                        value={(table.getState().globalFilter) ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <div className="flex items-center gap-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
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
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button onClick={() => navigate("/new-order")}>Create<Plus /></Button>

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
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <PacmanLoader color="#6366f1" />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
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
