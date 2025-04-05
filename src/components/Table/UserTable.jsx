import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Settings2, Trash2 } from "lucide-react"

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
import { deleteUser, getAllUsersList } from "@/services/userManagementService"
import { useEffect, useState } from "react"
import { PacmanLoader } from "react-spinners"
import UserDialog from "../Dialog/UserDialog"
import { Dialog, DialogTrigger } from "../ui/dialog"
import { toast } from "sonner"


const UserTable = () => {
  const [userTableData, setUserTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const { userData } = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAllUsersData();
  }, [])

  const fetchAllUsersData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsersList(userData.currentUserLogin, userData.clientURL)
      setUserTableData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteUser = async (user) => {
    alert("Are you sure you want to delete this user? This action cannot be undone.")
    throw new Error("User deletion is not implemented yet.");

    try {
      const deleteUserPayload = {
        fqUserName: user.EMAIL_ADDRESS,
        userNameOnly: user.USER_NAME,
      }
      const deleteUserResponse = await deleteUser(deleteUserPayload, userData.currentUserLogin, userData.clientURL);

      fetchAllUsersData();

      toast(deleteUserResponse);
    } catch (error) {
      console.error("Error deleting user:", error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.message || "Unknown error occurred.",
      })
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  const handleUserDialogClose = () => {
    setSelectedUser(null); // Reset when closing
    setIsDialogOpen(false);
    fetchAllUsersData();
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
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "USER_NAME",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            User Name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("USER_NAME") || "-"}</div>
      ),
    },
    {
      accessorKey: "FULL_NAME",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("FULL_NAME") || "-"}</div>
      ),
    },
    {
      accessorKey: "USER_TYPE",
      header: "User Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("USER_TYPE")}</div>
      ),
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
            Email
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("EMAIL_ADDRESS") || "-"}</div>,
    },
    {
      accessorKey: "MOBILE_NO",
      header: () => <div>Mobile No</div>,
      cell: ({ row }) => <div>{row.getValue("MOBILE_NO") || "-"}</div>,
    },
    {
      accessorKey: "EMP_NO",
      header: () => <div>Employee No</div>,
      cell: ({ row }) => <div>{row.getValue("EMP_NO") || "-"}</div>,
    },
    {
      accessorKey: "action",
      header: () => <div>Action</div>,
      id: "actions",
      // enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
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
              <DropdownMenuItem onClick={() => handleEditUser(user)} className="flex items-center gap-1"><Pencil /> Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 flex items-center gap-1" onClick={() => handleDeleteUser(user)}> <Trash2 /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },

  ]

  const fuzzyFilter = (row, columnId, filterValue) => {
    return row.getValue(columnId)?.toLowerCase().includes(filterValue.toLowerCase());
  };


  const table = useReactTable({
    data: userTableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })


  return (
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
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) handleUserDialogClose();
            setIsDialogOpen(open);
          }} className="z-50">
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>Add User</Button>
            </DialogTrigger>
            <UserDialog
              open={isDialogOpen}
              onClose={handleUserDialogClose}
              user={selectedUser} />
          </Dialog>

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
                  No results.
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
  )
}


export default UserTable