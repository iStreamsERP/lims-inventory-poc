import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Check, ChevronsUpDown, EditIcon, Pencil, PlusIcon, ShoppingCart, TrashIcon } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const CustomerTable = () => {
  const CustomerList = [
    { customername: "Alice", country: "USA", city: "New York", phone: "+1 9876543210" },
    { customername: "Hiroshi", country: "Japan", city: "Tokyo", phone: "+81 2345678901" },
    { customername: "Carlos", country: "Spain", city: "Madrid", phone: "+34 8765432109" },
    { customername: "Fatima", country: "UAE", city: "Dubai", phone: "+971 543210987" },
    { customername: "Liam", country: "Canada", city: "Toronto", phone: "+1 6543210987" },
    { customername: "Sophia", country: "Australia", city: "Sydney", phone: "+61 8765432190" },
    { customername: "Pierre", country: "France", city: "Paris", phone: "+33 7654321098" },
    { customername: "Chen", country: "China", city: "Beijing", phone: "+86 6543210987" },
    { customername: "Vikram", country: "India", city: "Mumbai", phone: "+91 9876543210" },
    { customername: "Elena", country: "Russia", city: "Moscow", phone: "+7 8765432109" },
  ];
  const [carts, setCarts] = useState([
    {
      itemcode: "MICRO10383",
      img: "https://angiehomes.co/cdn/shop/products/main-qimg-2a454bd75f67342c6def07_grande.jpg?v=1636616330",
      uom: "pcs",
      customername: "Ravi",
      item: "Samsung",
      qty: 2,
      rate: 12000,
      color: "Black",
    },
    {
      itemcode: "TRF20240003",
      img: "https://images-cdn.ubuy.co.in/63513e7722f3fe049d367fb1-midewhik-desk-gaming-desks-portable.jpg",
      uom: "pcs",
      customername: "Arun",
      item: "Dell",
      qty: 1,
      rate: 15000,
      color: "Red",
    },
    {
      itemcode: "TRF20244444",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGb94_S2mjUk8bTp3e5EyT8f8vEV81qxTdFQ&s",
      uom: "pcs",
      customername: "Ajeth",
      item: "Mac",
      qty: 1,
      rate: 1510,
      color: "Pink",
    },
    {
      itemcode: "MICRO10567",
      img: "https://m.media-amazon.com/images/I/81t6Av5DvXL._SX466_.jpg",
      customername: "Vijay",
      item: "Lenovo",
      uom: "pcs",
      qty: 3,
      rate: 14000,
      color: "Silver",
    },
    {
      itemcode: "TRF20248888",
      img: "https://blogs.windows.com/wp-content/uploads/mswbprod/sites/2/2018/05/e55fcbfa05409c0e2262acca4756e76b-1024x870.jpg",
      customername: "Suresh",
      item: "HP",
      uom: "pcs",
      qty: 1,
      rate: 12500,
      color: "Blue",
    },
    {
      itemcode: "MICRO10999",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD1F9vqk5KiL271SAnU6XVqBbEdmXMDc1H2g&s",
      customername: "Rahul",
      item: "Asus",
      uom: "pcs",
      qty: 2,
      rate: 13500,
      color: "White",
    },
    {
      itemcode: "TRF20249999",
      img: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SL1500_.jpg",
      customername: "Kiran",
      item: "Acer",
      uom: "pcs",
      qty: 1,
      rate: 11000,
      color: "Green",
    },
  ]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermCustomer, setSearchTermCustomer] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingIndexRate, setEditingIndexRate] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [tempRate, setTempRate] = useState(0);
  const [itemcode, SetItemcode] = useState("");
  const [item, setItem] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredItems = searchTerm
    ? carts.filter(
      (cart) =>
        cart.itemcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cart.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cart.uom.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    : [];

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    SetItemcode(item.itemcode || ""); // Ensure itemcode is set
    setItem(item.item);
    setSearchTerm(""); // Show selected item in input
    setIsFocused(false); // Hide dropdown after selection
  };

  const handleAddMaterial = () => {
    if (selectedItem) {
      if (!tableData.some((item) => item.itemcode === selectedItem.itemcode)) {
        setTableData([...tableData, selectedItem]);
      }
      setItem("");
      SetItemcode("");
      setSelectedItem("");
    }
  };
  const handleDelete = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  const handleEdit = (index) => {
    // Set the index of the rate being edited

    setEditingIndexRate(index);
    setEditingIndex(index);
  };

  const handleEditQuantity = (index, qty) => {
    setEditingIndex(index);
    setTempQuantity(qty);
  };

  const handleEditRate = (index, rate) => {
    setEditingIndexRate(index);
    setTempRate(rate);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== "") {
      setTempQuantity(value);
    }
  };
  const handleRateChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value !== "") {
      setTempRate(value);
    }
  };

  const handleSaveQuantity = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].qty = Number(tempQuantity);
    setTableData(updatedTableData);
    setEditingIndex(null);
  };
  const handleSaveRate = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].rate = Number(tempRate);
    setTableData(updatedTableData);
    setEditingIndexRate(null);
  };

  const filteredCustomers = CustomerList.filter(
    (customer) =>
      customer.customername.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
      customer.phone.includes(searchTermCustomer) ||
      customer.city.toLowerCase().includes(searchTermCustomer.toLowerCase()) ||
      customer.country.toLowerCase().includes(searchTermCustomer.toLowerCase()),
  );

  // Handle customer selection
  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    setOpen(false);
    setIsEditing(false); // Hide input after selection
  };
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-12 grid-rows-5 gap-4">
          {/* Button Section */}
          <div className="col-span-4 col-start-4">
            <Button className="w-full" onClick={handleAddMaterial}>
              <PlusIcon size={16} /> Add Customer
            </Button>
          </div>

          {/* Input Field */}
          <div className="col-span-4 col-start-7">
            <Input
              type="text"
              placeholder="Search ItemCode"
              value={searchTerm || itemcode}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dropdown/Search Results */}
          <div className="col-span-4 col-start-9 relative">
            {filteredItems.length > 0 || isFocused ? (
              <div className="absolute top-12 z-10 mt-1 w-full rounded-lg bg-white p-2 text-sm shadow-lg">
                {(filteredItems.length > 0 ? filteredItems : carts).map((item) => (
                  <div
                    key={item.itemcode}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.itemcode} - {item.item} - {item.uom}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>


        <Table className="mt-4">
          <ScrollArea className="h-[340px] w-full rounded-md border p-4">
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Itemcode</TableHead>
                <TableHead className="text-center sm:w-[250px] lg:w-[150px]">Item</TableHead>
                <TableHead className="text-center">Uom</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Rate</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {tableData.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-5 text-center text-gray-500"
                  >
                    -- No Material Added Yet. Search to Add Material --
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {tableData.map((cart, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{cart.itemcode}</TableCell>
                    <TableCell className="flex justify-center gap-2 text-center sm:w-[250px] lg:w-[150px]">
                      <img
                        src={cart.img}
                        alt={cart.name}
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
                    <TableCell className="text-right">{cart.uom}</TableCell>
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
                          onClick={() => handleEditQuantity(index, cart.qty)}
                          className="cursor-pointer"
                        >
                          {cart.qty}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {editingIndexRate === index ? (
                        <input
                          type="text"
                          className="w-16 rounded bg-gray-700 p-1 text-white"
                          value={tempRate}
                          onChange={handleRateChange}
                          onBlur={() => handleSaveRate(index)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveRate(index)}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => handleEditRate(index, cart.rate)}
                          className="cursor-pointer"
                        >
                          {cart.rate}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{cart.qty * cart.rate}</TableCell>
                    <TableCell className="text-center text-xs">
                      <Button
                        variant="gost"
                        className="me-2 bg-transparent p-0 text-blue-500"
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="gost"
                        className="bg-transparent p-0 text-red-500"
                        onClick={() => handleDelete(index)}
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
      </CardContent>
    </Card>
  );
};

export default CustomerTable;