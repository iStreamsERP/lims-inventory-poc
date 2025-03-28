import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SquarePen, Trash2 } from "lucide-react";

const UserTable = () => {
    return (
        <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[600px] border-collapse">
                <TableHeader className="">
                    <TableRow>
                        <TableHead className="w-[60px] p-2 text-xs md:text-sm">S.No</TableHead>
                        <TableHead className="p-2 text-xs md:text-sm">User Name</TableHead>
                        <TableHead className="p-2 text-xs md:text-sm">Type</TableHead>
                        <TableHead className="p-2 text-xs md:text-sm">Email</TableHead>
                        <TableHead className="p-2 text-xs md:text-sm">Phone</TableHead>
                        <TableHead className="p-2 text-xs md:text-sm">Password</TableHead>
                        <TableHead className="p-2 text-xs md:text-sm">Emp-No</TableHead>
                        <TableHead className="p-2 text-center text-xs md:text-sm">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="hover:bg-gray-50">
                        <TableCell className="p-2 text-xs font-medium md:text-sm">01</TableCell>
                        <TableCell className="p-2 text-xs md:text-sm">Gopi</TableCell>
                        <TableCell className="p-2 text-xs md:text-sm">User</TableCell>
                        <TableCell className="p-2 text-xs md:text-sm">gopi@demo.com</TableCell>
                        <TableCell className="p-2 text-xs md:text-sm">+91 8965745121</TableCell>
                        <TableCell className="p-2 text-xs md:text-sm">1234</TableCell>
                        <TableCell className="p-2 text-xs md:text-sm">EMP5584</TableCell>
                        <TableCell className="flex justify-center space-x-2 p-2 text-xs md:text-sm">
                            <button className="text-indigo-400 hover:text-indigo-300">
                                <SquarePen size={18} />
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                                <Trash2 size={18} />
                            </button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default UserTable
