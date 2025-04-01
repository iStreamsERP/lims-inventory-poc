import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Check, CheckIcon, ChevronsUpDown, EditIcon, Pencil, PencilIcon, PlusIcon, ShoppingCart, Trash2Icon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { set } from "react-hook-form";

const OrderCreationPage = () => {
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
      tax: 3,
      discount: 5,
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
      tax: 3,
      discount: 5,
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
      tax: 3,
      discount: 5,
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
      tax: 3,
      discount: 5,
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
      tax: 3,
      discount: 5,
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
      tax: 3,
      discount: 5,
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
      tax: 3,
      discount: 5,
    },
  ]);
  const discount = 10;
  const tax = 5;
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermCustomer, setSearchTermCustomer] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedRow, setEditedRow] = useState(null);

  const [itemcode, SetItemcode] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  let amount;
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
    setQty(item.qty);
    setSearchTerm(""); // Show selected item in input
    setIsFocused(false); // Hide dropdown after selection
  };

  const handleAddMaterial = () => {
    if (selectedItem && qty) {
      if (!tableData.some((item) => item.itemcode === selectedItem.itemcode)) {
        setTableData([...tableData, { ...selectedItem, qty: Number(qty) }]);
      }
      setSelectedItem(null);
      setQty("");
      SetItemcode("");
      setItem("");
      setSearchTerm("");
    }
  };

  const handleEditRow = (index) => {
    setEditingIndex(index);
    setEditedRow({ ...tableData[index] });
  };

  const handleSaveRow = () => {
    const updatedTableData = [...tableData];
    updatedTableData[editingIndex] = {
      ...editedRow,
      qty: Number(editedRow.qty) || 0,
      rate: Number(editedRow.rate) || 0,
      tax: Number(editedRow.tax) || 0,
      discount: Number(editedRow.discount) || 0,
    };
    setTableData(updatedTableData);
    setEditingIndex(null);
  };

  const handleDeleteRow = (index) => {
    setTableData(tableData.filter((_, i) => i !== index));
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
  const calculateAmount = (cart) => {
    let basePrice = cart.qty * cart.rate;
    let discountAmount = (basePrice * cart.discount) / 100;
    let priceAfterDiscount = basePrice - discountAmount;
    let taxAmount = (priceAfterDiscount * cart.tax) / 100;
    return (priceAfterDiscount + taxAmount).toFixed(2);
  };
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <div className="flex h-full w-full flex-col justify-between lg:flex-row">
              <h2 className="text-lg text-gray-600">
                Order No - <span className="font-bold font-normal text-purple-400">MIR-2024-0002</span>
              </h2>
              <h2 className="text-lg text-gray-600">
                Order Date - <span className="font-normal text-gray-500">2024-03-05</span>
              </h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 lg:flex-row">
            <dl className="w-full relative">
              <dd>
              <Input
              type="text"
              placeholder="Search ItemCode"
              value={searchTerm || itemcode} // Ensure it reflects the selected item
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
           </dd>
           <dt className="w-[200px] absolute  rounded-lg bg-white  text-sm shadow-lg">
            {filteredItems.length > 0 ? (
              <div >
                {filteredItems.map((item) => (
                  <div
                    key={item.itemcode}
                    className="cursor-pointer p-2"
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.itemcode} - {item.item} - {item.uom}
                  </div>
                ))}
              </div>
            ) : isFocused ? (
              <div className="absolute top-1/3 z-10 mt-1 rounded-lg bg-white p-2 text-sm shadow-lg">
                {(filteredItems.length > 0 ? filteredItems : carts).map((item) => (
                  <div
                    key={item.itemcode}
                    className="cursor-pointer p-2"
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.itemcode} - {item.item} - {item.uom}
                  </div>
                ))}
              </div>
            ) : null}
            </dt>
          </dl>
            <Input
              type="text"
              placeholder="Available Items"
              value={item}
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <Button onClick={handleAddMaterial}>
              Add Material <PlusIcon size={16} />
            </Button>
          </div>

          <Table className="mt-4 w-full">
            <ScrollArea className="h-[400px] w-full overflow-x-scroll overflow-y-scroll rounded-md border p-4 xl:h-[399px]">
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Itemcode</TableHead>
                  <TableHead className="text-center">Item</TableHead>
                  <TableHead className="text-center">Uom</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Rate</TableHead>
                  <TableHead className="text-center">Tax</TableHead>
                  <TableHead className="text-center">Discount</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tableData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="py-5 text-center text-gray-500"
                    >
                      -- No Material Added Yet. Search to Add Material --
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((cart, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{cart.itemcode}</TableCell>
                      <TableCell className="flex w-[200px] justify-center gap-2 text-center xl:w-[200px]">
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
                      {editingIndex === index ? (
                        <>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-full xl:w-[100px]"
                              value={editedRow.qty}
                              onChange={(e) => setEditedRow({ ...editedRow, qty: e.target.value })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="w-full xl:w-[100px]"
                              value={editedRow.rate}
                              onChange={(e) => setEditedRow({ ...editedRow, rate: e.target.value })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editedRow.tax}
                              className="w-full xl:w-[100px]"
                              onChange={(e) => setEditedRow({ ...editedRow, tax: e.target.value })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editedRow.discount}
                              className="w-full xl:w-[100px]"
                              onChange={(e) => setEditedRow({ ...editedRow, discount: e.target.value })}
                            />
                          </TableCell>
                          <TableCell>
                          {calculateAmount(cart)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="me-2 bg-transparent p-0 text-blue-500"
                              onClick={handleSaveRow}
                            >
                              <CheckIcon size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              className="bg-transparent p-0 text-red-500"
                              onClick={() => handleDeleteRow(index)}
                            >
                              <Trash2Icon size={10} />
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-right">{cart.qty}</TableCell>
                          <TableCell className="text-right">{cart.rate}</TableCell>
                          <TableCell className="text-right">{cart.tax}%</TableCell>
                          <TableCell className="text-right">{cart.discount}%</TableCell>
                          <TableCell className="text-right"> {calculateAmount(cart)}
                          </TableCell>
                          <TableCell className="gap-1">
                            <Button
                              variant="ghost"
                              className="me-2 bg-transparent p-0 text-blue-500"
                              onClick={() => handleEditRow(index)}
                            >
                              <PencilIcon size={10} />
                            </Button>
                            <Button
                              variant="ghost"
                              className="bg-transparent p-0 text-red-500"
                              onClick={() => handleDeleteRow(index)}
                            >
                              <Trash2Icon size={10} />
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="position-absolute whitespace-nowrap text-gray-600"
                  >
                    No Of Selected Items
                  </TableCell>
                  <TableCell
                    colSpan={1}
                    className="text-left text-gray-600"
                  >
                    {tableData.length}
                  </TableCell>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell className="position-absolute text-gray-600">Total</TableCell>
                  <TableCell
                    className="text-right text-gray-600"
                    colSpan={1}
                  >
                   {tableData.reduce((total, cart) => total + parseFloat(calculateAmount(cart)), 0).toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={1}></TableCell>
                </TableRow>
              </TableFooter>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Table>
        </CardContent>
      </Card>
      <div className="sm:w-full md:w-full lg:w-fit xl:w-fit">
        <Card className="mb-2 h-[170px] w-full xl:w-[250px]">
          <CardHeader>
            <div className="flex items-center justify-between gap-1 space-y-1">
              <CardTitle className="text-gray-600">Customer</CardTitle>
              <CardTitle>
                {selectedCustomer === null ? (
                  ""
                ) : (
                  <Button
                    variant="ghost"
                    className="p-1 text-xs"
                    onClick={() => setIsEditing(true)} // Enable editing
                  >
                    <Pencil />
                  </Button>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCustomer && !isEditing ? (
              <div>
                <p className="text-lg font-bold text-gray-600">{selectedCustomer.customername}</p>
                <p className="text-xs font-semibold text-gray-500">
                  {selectedCustomer.country}, {selectedCustomer.city}
                </p>
                <p className="mb-2 text-xs font-semibold text-gray-500">{selectedCustomer.phone}</p>
              </div>
            ) : (
              <Popover
                open={open}
                onOpenChange={setOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedCustomer ? selectedCustomer.customername : "Search Customer..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-2">
                  <Input
                    placeholder="Search by name, phone, or city..."
                    value={searchTermCustomer}
                    onChange={(e) => setSearchTermCustomer(e.target.value)}
                    className="mb-2"
                  />
                  <div className="max-h-48 overflow-y-auto rounded border p-2 shadow">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.phone}
                          className="flex cursor-pointer flex-col p-2 hover:bg-gray-100"
                          onClick={() => handleSelect(customer)}
                        >
                          <span className="font-semibold">{customer.customername}</span>
                          <span className="text-xs text-gray-500">
                            {customer.city}, {customer.country}
                          </span>
                          <span className="text-xs text-gray-500">{customer.phone}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No customers found.</div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>You have 3 order in cart.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-start justify-between">
                <p className="mt-2 text-xs font-medium leading-none text-gray-600">GSTIN NO:</p>
                <p className="text-muted-foreground text-sm font-semibold">GSTIN8976543</p>
              </div>

              {/* <div className="flex items-start justify-between">
                <p className="mt-2 text-xs font-medium leading-none text-gray-600">OVERALL SELECTED ITEMS QTY :</p>
                <p className="text-muted-foreground mt-1 text-sm font-semibold">{tableData.reduce((total, item) => total + item.qty, 0)}</p>
              </div> */}

              <div className="flex items-start justify-between">
                <p className="mt-2 text-xs font-medium leading-none text-gray-600">Total Before Tax :</p>
                <p className="text-muted-foreground text-sm font-semibold"> {tableData.reduce((total, item) => total + item.qty * item.rate, 0)}</p>
              </div>

              <div className="flex items-start justify-between">
                <p className="mt-2 text-xs font-medium leading-none text-gray-600">Estimated Tax :</p>
                <p className="text-muted-foreground text-sm font-semibold">
                  {" "}
                  {tableData.reduce((total, cart) => total + parseFloat(calculateAmount(cart)), 0).toFixed(2)}
                </p>
              </div>

              <div className="flex items-start justify-between border-b border-slate-200/60 pb-4">
                <p className="mt-2 text-xs font-medium leading-none text-green-600">Overall Discount:</p>
                <p className="text-muted-foreground text-sm font-semibold text-green-600">
                {tableData.reduce((total, cart) => total + parseFloat(calculateAmount(cart)), 0).toFixed(2)}
                </p>
              </div>

              <div className="flex items-start justify-between">
                <p className="mt-2 text-xs font-bold leading-none text-red-600">Order Total:</p>
                <p className="text-muted-foreground text-sm font-semibold text-red-600">
                {tableData.reduce((total, cart) => total + parseFloat(calculateAmount(cart)), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-1">
            <Button
              className="w-full"
              variant="outline"
            >
              <ShoppingCart /> Add to cart
            </Button>
            <Button
              // onClick={handleProceedToPay}
              className="w-full"
            >
              <Check /> Proceed To Pay
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OrderCreationPage;
