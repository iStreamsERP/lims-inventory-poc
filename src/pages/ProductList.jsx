import { ItemDialog } from "@/components/Dialog/ItemDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { EditIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ProductList = () => {
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("itemData");

    try {
      const parsedData = savedData ? JSON.parse(savedData) : [];
      setCarts(Array.isArray(parsedData) ? parsedData : []); // Ensure carts is always an array
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setCarts([]); // Set empty array if JSON parsing fails
    }
  }, []);

  const handleDeleteitem = (index) => {
    const updatedCarts = [...carts];
    updatedCarts.splice(index, 1);
    setCarts(updatedCarts);
    localStorage.setItem("itemData", JSON.stringify(updatedCarts)); // Save to localStorage
  };

  return (
    <div className="w-full">

      <div className="flex flex-col gap-y-4">
        <h1 className="title">Product List</h1>
        <div>
          <div className="mb-2 grid grid-cols-12 gap-2">
            <div className="col-span-12 flex w-full justify-end text-xs md:col-span-2 md:col-start-7 lg:col-span-2 lg:col-start-7">
              <ItemDialog />
            </div>

            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <Input
                type="text"
                placeholder="Search Products"
                className="w-full"
              />
            </div>
          </div>

          <Table className="whitespace-nowrap">
            <ScrollArea className="max-h-[70vh] w-full rounded-md border">
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Itemcode</TableHead>
                  <TableHead className="sm:w-[250px] lg:w-[500px]">Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier Ref</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              {carts.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-5 text-center text-gray-500"
                    >
                      -- No Material Added Yet. Search to Add Material --
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {carts.map((cart, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{cart.itemcode}</TableCell>
                      <TableCell className="flex justify-start gap-2 text-start sm:w-[250px] lg:w-[200px]">
                        <img
                          src={cart.previewImage}
                          alt={cart.employeeImage}
                          className="h-10 w-10 rounded"
                        />
                        <div>
                          <p className="font-semibold text-gray-500">{cart.item}</p>
                          <div className="flex items-center">
                            <span
                              style={{ backgroundColor: cart.color }}
                              className="mr-1 rounded-full p-1"
                            ></span>
                            <p className="text-sm text-gray-400">{cart.color}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{cart.type}</TableCell>
                      <TableCell>{cart.supplierref}</TableCell>
                      <TableCell>{cart.salesprice}</TableCell>
                      <TableCell>{cart.margin}</TableCell>
                      <TableCell className="text-right">{cart.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="gost"
                          className="me-2 bg-transparent p-0 text-blue-500"

                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="gost"
                          className="bg-transparent p-0 text-red-500"
                          onClick={() => handleDeleteitem(index)}
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </ScrollArea>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
