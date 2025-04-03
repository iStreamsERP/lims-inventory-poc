import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerTable = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("customersData");
    if (savedData) {
      setCustomers(JSON.parse(savedData)); // Load stored data
    }
  }, []);

  const deleteCustomer = (index) => {
    const updatedCustomers = customers.filter((_, i) => i !== index);
    setCustomers(updatedCustomers);
    localStorage.setItem("customersData", JSON.stringify(updatedCustomers)); // Save to localStorage
  };

  const editCustomer = (customer) => {
    navigate("/customers-information", { state: { customer } });
  };

  // Filter customers based on search term
  const filteredCustomers = customers
    .filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.groupofcompany.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.website.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.country.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.state.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.vatNumber.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.communicationAddress.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.invoiceAddress.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())||
      customer.othernatureofbuisness.some((nature) => nature.toLowerCase().includes(searchTerm.toLowerCase()))
      

    )
    .sort((a, b) => {
      const aIncludes = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bIncludes = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      return bIncludes - aIncludes; // Prioritize exact matches first
    });

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Customer Table</h1>
      <div>
        <div className="mb-2 grid grid-cols-12 gap-2">
          {/* Button Section */}
          <div className="col-span-12 flex w-full justify-end text-xs md:col-span-2 md:col-start-7 lg:col-span-2 lg:col-start-7">
            <Button
              className="btn-sm w-full text-xs sm:w-full md:ms-0 md:w-32 lg:ms-4 lg:w-32"
              onClick={() => navigate("/customers-information")}
            >
              <PlusIcon size={64} />
              Add Customer
            </Button>
          </div>

          {/* Input Field */}
          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <Input
              type="text"
              placeholder="Search customers..."
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table className="whitespace-nowrap">
          <ScrollArea className="max-h-[68vh] w-full rounded-md border p-4">
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead className="text-start">Email</TableHead>
                <TableHead className="text-start">Nature Of Business</TableHead>
                <TableHead className="text-start">Other Nature Of Business</TableHead>
                <TableHead className="text-start">Phone Number</TableHead>
                <TableHead className="text-start">Country</TableHead>
                <TableHead className="text-start">City</TableHead>
                <TableHead className="text-start">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {filteredCustomers.length === 0 ? (
              <TableBody className="text-start">
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="w-full py-5 h-full text-center text-gray-500"
                  >
                    -- No Customers Found --
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {filteredCustomers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.businessType}</TableCell>
                    <TableCell>
                      {customer.othernatureofbuisness.map((item, i) => (
                        <span key={i}>{item + ", "}</span>
                      ))}
                    </TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell className="text-center text-xs">
                      <Button
                        variant="gost"
                        className="me-2 bg-transparent p-0 text-blue-500"
                        onClick={() => editCustomer(customer)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="gost"
                        className="bg-transparent p-0 text-red-500"
                        onClick={() => deleteCustomer(index)}
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
  );
};

export default CustomerTable;
