import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const items = [
  {
    code: "SMART001",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    name: "SMART WATCH",
    color: "White",
    uom: "pcs",
    quantity: "1",
    size: "5mm",
    length: "6.1 inch",
    width: "3.6 inch",
    thickness: "0.8 inch",
    convertionrate: "0.000001",
  },
  {
    code: "LAP002",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSG7oansXmJ3ZHItvlbD_G89TY0xyW1JOmMQun7X-wOOWp_XQa6xbDQp2XwHtL0vtJNSnNzNkmlUHTFq564EGAjmlsOLzRgF4eebHgKBcJue5e1tb1rSlYD",
    name: "Lenovo Laptop",
    color: "Black",
    uom: "unit",
    quantity: "10",
    size: "15.6 inch",
    length: "6.1 inch",
    width: "3.6 inch",
    thickness: "0.8 inch",
    convertionrate: "0.0001",
  },
  {
    code: "TAB003",
    img: "https://m.media-amazon.com/images/I/6100f2qmEnL.jpg",
    name: "Samsung Tablet",
    color: "Gray",
    uom: "unit",
    quantity: "5",
    size: "10.1 inch",
    length: "6.1 inch",
    width: "3.6 inch",
    thickness: "0.8 inch",
    convertionrate: "20.000001",
  },
  {
    code: "PHN004",
    img: "https://iplanet.one/cdn/shop/files/iPhone_13_ProductRED_PDP_Image_Position-1B__GBEN_921f9eb5-f025-4d61-b6bc-859ed52dab1c.jpg?v=1691170101&width=823",
    name: "iPhone 13",
    color: "Blue",
    uom: "unit",
    quantity: "3",
    size: "6.1 inch",
    length: "6.1 inch",
    width: "3.6 inch",
    thickness: "0.8 inch",
    convertionrate: "0.800001",
  },
  {
    code: "HDD005",
    img: "https://ntptechstore.com/wp-content/uploads/2024/03/seagate-expansion-2-tb-hdd.png",
    name: "External HDD",
    color: "Black",
    uom: "pcs",
    quantity: "7",
    size: "1TB",
    length: "6.1 inch",
    width: "3.6 inch",
    thickness: "0.8 inch",
    convertionrate: "0.000001",
  },
];

export default function SubMaterialPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [itemcode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempQuantity, setTempQuantity] = useState("");

  const filteredItems = searchTerm
  ? items.filter(
      (item) =>
        item.code.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.uom.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )
  : [];
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setQuantity(item.quantity);
    setItemName(item.name);
    setItemCode(item.code);
    setSearchTerm(""); // This ensures the dropdown disappears after selection
  };

  const handleSave = () => {
    if (tableData.length === 0) {
      alert("datas are empty");
    } else {
      alert("Data saved successfully!");
      alert(
        tableData.map(
          (item) =>
            `Code: ${item.code}, Name: ${item.name}, Quantity: ${item.quantity}, UOM: ${item.uom}, Size: ${item.size}, Length: ${item.length}, Width: ${item.width}, Thickness: ${item.thickness}, Conversion Rate: ${item.convertionrate}, Image: ${item.img}, Color: ${item.color}`,
        ),
      );
      console.log(tableData);
    }
  };
  const handleDelete = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };
  const handleAddMaterial = () => {
    if (selectedItem) {
      // Prevent duplicate entries
      if (!tableData.some((item) => item.code === selectedItem.code)) {
        setTableData([...tableData, selectedItem]);
      }
      // Clear selected fields
      setSelectedItem(null);
      setQuantity("");
      setItemName("");
      setItemCode("");
    }
  };
  const handleEditQuantity = (index, qty) => {
    setEditingIndex(index);
    setTempQuantity(qty);
  };

  const handleQuantityChange = (e) => {
    setTempQuantity(e.target.value);
  };

  const handleSaveQuantity = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].quantity = tempQuantity;
    setTableData(updatedTableData);
    setEditingIndex(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SubMaterial</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative grid gap-4 sm:grid-cols-1 xl:grid-cols-4">
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-300">Item Code</Label>

            <Input
              placeholder="Enter Item Code, Name, or UOM"
              value={searchTerm || itemcode}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredItems.length > 0 && (
              <div className="absolute z-10 mt-1 w-72 rounded-md bg-white text-xs text-black shadow-md">
                {filteredItems.map((item) => (
                  <div
                    key={item.code}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.code} - {item.name} - {item.uom}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full items-end justify-between gap-2 space-x-2">
            <div className="flex-1">
              <Label className="mb-2 block text-sm font-medium text-gray-300">Item Name</Label>
              <Input
                placeholder="Enter Item Name"
                value={itemName}
                readOnly
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-300">Quantity</Label>
            <Input
              placeholder="Enter Quantity"
              value={quantity}
              readOnly
            />
          </div>
          <div className="w-full">
            <Button
              onClick={handleAddMaterial}
              className="mt-7 flex w-full items-center justify-center rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-md transition hover:bg-green-700"
            >
              <Plus />
              Add Material
            </Button>
          </div>
        </div>
        {tableData.length === 0 ? (
          <p className="mt-5 pt-5 text-center text-sm text-gray-500">-- Search for an item to add Material -- </p>
        ) : (
          <Table className="mt-5 whitespace-nowrap">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead className="w-[200px] text-center">Item Details</TableHead>
                <TableHead className="text-center">Length</TableHead>
                <TableHead className="text-center">Width</TableHead>
                <TableHead className="text-center">Thickness</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Convertion Rate</TableHead>
                <TableHead className="text-center">Qty(Volume*conrate)</TableHead>
                <TableHead className="text-center">Size</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell className="flex items-start justify-start gap-2 p-4 w-[200px] text-center">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-10 w-10 rounded"
                    />
                    <div>
                      <p className="ms-1 text-start font-semibold text-gray-700">{item.name}</p>

                      <div className="mt-1 flex items-center justify-start">
                        <span
                          style={{ backgroundColor: item.color }}
                          className="mr-1 inline-block rounded-full p-1"
                        ></span>
                        <p className="mb-0 text-sm text-gray-400">{item.color}</p>
                        <p className="ml-2 rounded bg-purple-600 px-1 text-xs font-semibold text-white">{item.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.length}</TableCell>
                  <TableCell className="ttext-center">{item.width}</TableCell>

                  <TableCell className="text-center">{item.thickness}</TableCell>
                  <TableCell className="text-center">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        className="w-16 rounded bg-gray-700 p-1 text-white"
                        value={tempQuantity}
                        onChange={handleQuantityChange}
                        onBlur={() => handleSaveQuantity(index)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveQuantity(index)}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => handleEditQuantity(index, item.quantity)}
                        className="cursor-pointer"
                      >
                        {item.quantity}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{item.convertionrate}</TableCell>
                  <TableCell className="text-center">{item.quantity * item.convertionrate}</TableCell>
                  <TableCell className="text-center">{item.size}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="p-1"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}></TableCell>
                <TableCell>Total</TableCell>
                <TableCell
                  className="text-right"
                  colSpan={1}
                >
                  {tableData.reduce((total, item) => total + item.quantity * item.convertionrate, 0)}
                </TableCell>
                <TableCell colSpan={1}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}

        <Button
          onClick={handleSave}
          className="mb-2 mt-5 flex w-full items-center justify-center rounded-lg bg-purple-700 px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
