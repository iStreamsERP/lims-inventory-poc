import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { CheckIcon, ChevronDown, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const CustomersInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Err, SetErr] = useState({});
  const [customer, setCustomer] = useState({
    id: null, // ID will be assigned dynamically
    name: "",
    email: "",
    businessType: "",
    othernatureofbuisness: [],
    vatNumber: "",
    groupofcompany: "",
    phone: "",
    website: "",
    country: "",
    state: "",
    city: "",
    communicationAddress: "",
    invoiceAddress: "",
    deliveryAddress: "",
    contacts: [],
  });

  const [contact, setContact] = useState({
    id: null, // ID will be assigned dynamically
    contactname: "",
    contactdesignation: "",
    contactcontactFor: "",
    contactemail: "",
    contactphone: "",
    contactalternativePhone: "",
  });

  const othernatureofbuisness = [
    { value: "IT", label: "IT" },
    { value: "Finance", label: "Finance" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Retail", label: "Retail" },
  ];
  const businessType = [
    { value: "IT", label: "IT" },
    { value: "Finance", label: "Finance" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Education", label: "Education" },
    { value: "Retail", label: "Retail" },
  ];
  const country = [
    { value: "Nigeria", label: "Nigeria" },
    { value: "Ghana", label: "Ghana" },
    { value: "Togo", label: "Togo" },
    { value: "Benin", label: "Benin" },
  ];

  const validate = () => {
    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "Customer name is required.";
    }

    if (!customer.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!customer.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(customer.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!customer.vatNumber.trim()) {
      newErrors.vatNumber = "VatNumber Is Required.";
    }
    if (!customer.invoiceAddress.trim()) {
      newErrors.invoiceAddress = "InvoiceAddress is required.";
    }

    return newErrors;
  };

  useEffect(() => {
    if (location.state?.customer) {
      setCustomer((prev) => ({
        ...prev,
        ...location.state.customer,
      }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
    SetErr((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSelectChange = (value) => {
    setCustomer((prev) => ({
      ...prev,
      country: [value], // Replace the entire array with the selected value
    }));
  };

  const handleSelectedChange = (value) => {
    setCustomer((prev) => ({
      ...prev,
      businessType: [value], // Replace the entire array with the selected value
    }));
  };
  const handleMultiSelectChange = (value) => {
    setCustomer((prev) => {
      const updatedList = prev.othernatureofbuisness.includes(value)
        ? prev.othernatureofbuisness.filter((item) => item !== value)
        : [...prev.othernatureofbuisness, value];

      return {
        ...prev,
        othernatureofbuisness: updatedList,
      };
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addContact = () => {
    setCustomer((prev) => {
      const nextContactId = editingContactId ? editingContactId : prev.contacts.length + 1; // Assign ID as index+1

      const updatedContacts = editingContactId
        ? prev.contacts.map((c) => (c.id === editingContactId ? { ...contact, id: editingContactId } : c))
        : [...prev.contacts, { ...contact, id: nextContactId }];

      return {
        ...prev,
        contacts: updatedContacts,
      };
    });

    setIsDialogOpen(false);
    setEditingContactId(null);
    setContact({
      id: null,
      contactname: "",
      contactdesignation: "",
      contactcontactFor: "",
      contactemail: "",
      contactphone: "",
      contactalternativePhone: "",
    });
  };

  const removeContact = (id) => {
    setCustomer((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.id !== id),
    }));
  };

  const editContact = (id) => {
    const selectedContact = customer.contacts.find((c) => c.id === id);
    setContact(selectedContact);
    setEditingContactId(id);
    setIsDialogOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      SetErr(validationErrors);
      console.log("Validation failed", validationErrors);
      return;
    }

    let savedCustomers = JSON.parse(localStorage.getItem("customersData")) || [];
    let updatedCustomer;

    if (location.state?.customer) {
      updatedCustomer = { ...customer, id: location.state.customer.id };
      savedCustomers = savedCustomers.map((cust) => (cust.id === location.state.customer.id ? updatedCustomer : cust));
    } else {
      updatedCustomer = { ...customer, id: savedCustomers.length + 1 };
      savedCustomers.push(updatedCustomer);
    }

    localStorage.setItem("customersData", JSON.stringify(savedCustomers));
    navigate("/customers-table");
  };
  return (
    <div className="flex w-full flex-col gap-4">
      <form>
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <Card className="w-full lg:w-[70%]">
            <CardHeader>
              <CardTitle>{location.state?.customer ? "Edit Customer" : "Add Customer"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 p-1">
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="name">Customer / Company Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Name of your Company"
                      value={customer.name}
                      onChange={handleInputChange}
                      required
                    />
                    {Err.name && <p className="text-sm text-red-500">{Err.name}</p>}
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Enter Email"
                      value={customer.email}
                      onChange={handleInputChange}
                      required
                    />
                    {Err.email && <p className="text-sm text-red-500">{Err.email}</p>}
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <div className="mt-3 w-full md:w-1/2">
                    <Label className="block text-sm font-medium">Select Nature Of Business</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-between overflow-hidden"
                        >
                          {customer.businessType.length > 0 ? (
                            customer.businessType[0] // Display only the selected option
                          ) : (
                            <span className="font-normal text-gray-500">Select Business</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-56 rounded-md bg-white p-2 shadow-md">
                        {businessType.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
                          >
                            <Checkbox
                              id={option.value}
                              checked={customer.businessType.includes(option.value)}
                              onCheckedChange={() => handleSelectedChange(option.value)} // Ensure only one option is selected
                            />
                            <label
                              htmlFor={option.value}
                              className="flex w-full cursor-pointer justify-between text-sm"
                            >
                              {option.label}
                              {customer.businessType.includes(option.value) && (
                                <CheckIcon
                                  className="mt-1"
                                  size={12}
                                />
                              )}
                            </label>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="mt-3 w-full md:w-1/2">
                    <Label className="block text-sm font-medium">Select Other Nature Of Business</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-between overflow-hidden"
                        >
                          {customer.othernatureofbuisness.length > 0 ? (
                            customer.othernatureofbuisness.join(", ")
                          ) : (
                            <span className="font-normal text-gray-500"> Select Business</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-56 rounded-md bg-white p-2 shadow-md">
                        {othernatureofbuisness.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
                          >
                            <Checkbox
                              id={option.value}
                              checked={customer.othernatureofbuisness.includes(option.value)}
                              onCheckedChange={() => handleMultiSelectChange(option.value)}
                            />
                            <label
                              htmlFor={option.value}
                              className="flex w-full cursor-pointer justify-between text-sm"
                            >
                              {option.label}
                              <CheckIcon
                                className="mt-1"
                                size={12}
                              />
                            </label>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="vatNumber">VAT/GST/TAX No</Label>
                    <Input
                      id="vatNumber"
                      placeholder="Enter Tax.no"
                      value={customer.vatNumber}
                      name="vatNumber"
                      onChange={handleInputChange}
                    />
                    {Err.vatNumber && <p className="text-sm text-red-500">{Err.vatNumber}</p>}
                  </div>

                  <div className="w-full md:w-1/2">
                    <Label htmlFor="groupofcompany">Group of Company</Label>
                    <Input
                      id="groupofcompany"
                      name="groupofcompany"
                      placeholder="Enter Group Name"
                      value={customer.groupofcompany}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="phone">Phone<span className="text-xs text-gray-400"> (with country code, e.g., +91XXXXXXXXXX)</span></Label>
                    <Input
                      id="phone"
                      placeholder="e.g. +91XXXXXXXXXX"
                      name="phone"
                      value={customer.phone}
                      onChange={handleInputChange}
                    />
                    {Err.phone && <p className="text-sm text-red-500">{Err.phone}</p>}
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="Enter Website"
                      value={customer.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <div className="mt-3 w-full md:w-1/2">
                    <Label className="block text-sm font-medium">Select Contry</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex w-full items-center justify-between overflow-hidden"
                        >
                          {customer.country.length > 0 ? (
                            customer.country[0] // Display only the selected option
                          ) : (
                            <span className="font-normal text-gray-500">Select Country</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-56 rounded-md bg-white p-2 shadow-md">
                        {country.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100"
                          >
                            <Checkbox
                              id={option.value}
                              checked={customer.country.includes(option.value)}
                              onCheckedChange={() => handleSelectChange(option.value)} // Ensure only one option is selected
                            />
                            <label
                              htmlFor={option.value}
                              className="flex w-full cursor-pointer justify-between text-sm"
                            >
                              {option.label}
                              {customer.country.includes(option.value) && (
                                <CheckIcon
                                  className="mt-1"
                                  size={12}
                                />
                              )}
                            </label>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Enter City Name"
                      value={customer.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter City Name"
                      value={customer.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 md:flex-row">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="communicationAddress">Communication Address</Label>
                    <Textarea
                      id="communicationAddress"
                      placeholder="Communication Address"
                      name="communicationAddress"
                      value={customer.communicationAddress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="w-full md:w-1/2">
                    <Label htmlFor="invoiceAddress">Invoice Address</Label>
                    <Textarea
                      id="invoiceAddress"
                      placeholder="Invoice Address"
                      name="invoiceAddress"
                      value={customer.invoiceAddress}
                      onChange={handleInputChange}
                    />
                    {Err.invoiceAddress && <p className="text-sm text-red-500">{Err.invoiceAddress}</p>}
                  </div>

                  <div className="w-full md:w-1/2">
                    <Label htmlFor="deliveryAddress">Delivery Address</Label>
                    <Textarea
                      id="deliveryAddress"
                      placeholder="Delivery Address"
                      name="deliveryAddress"
                      value={customer.deliveryAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Contacts Card - 30% width on medium screens and above */}
          <Card className="w-full lg:w-[30%]">
            <CardHeader>
              <CardTitle>Add Contacts</CardTitle>
            </CardHeader>
            <CardContent className="h-[530px] overflow-y-scroll">
              <div className="flex flex-col flex-wrap gap-4">
                {customer.contacts.map((item) => (
                  <Card
                    className="flex h-[100px] w-full flex-col justify-center gap-2 p-3"
                    key={item.contactemail}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold leading-none text-gray-700">{item.contactname}</p>
                        <p className="mb-1 text-xs font-semibold text-gray-500">{item.contactdesignation}</p>
                        <p className="text-xs text-gray-600">{item.contactemail}</p>
                        <p className="text-xs text-blue-600">+91 {item.contactphone}</p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <SquarePen
                          size={14}
                          className="cursor-pointer text-blue-700"
                          onClick={() => editContact(item.id)}
                        />
                        <Trash2
                          size={14}
                          className="cursor-pointer text-red-700"
                          onClick={() => removeContact(item.id)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter
              className="flex items-center justify-center"
              id="addContact"
            >
              <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="w-1/2"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={customer.name === "" || customer.email === ""}
                  >
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form>
                    <DialogHeader>
                      <DialogTitle>{contact.contactname ? "Edit Contact" : "Add Contact"}</DialogTitle>
                      <DialogDescription>Enter the contact details and click save.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="contactname">Name</Label>
                        <Input
                          id="contactname"
                          name="contactname"
                          placeholder="Contact Name"
                          value={contact.contactname}
                          onChange={handleContactChange}
                        />
                        {Err.contactname && <p className="text-sm text-red-500">{Err.contactname}</p>}
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="contactdesignation"
                          placeholder="Designation"
                          name="contactdesignation"
                          value={contact.contactdesignation}
                          onChange={handleContactChange}
                        />
                        {Err.contactdesignation && <p className="text-sm text-red-500">{Err.contactdesignation}</p>}
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="contactcontactFor">Contact for</Label>
                        <Select
                          id="contactcontactFor"
                          value={contact.contactcontactFor || ""}
                          onValueChange={(value) => setContact((prev) => ({ ...prev, contactcontactFor: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Contact for" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="enquiry">Enquiry</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                          </SelectContent>
                        </Select>
                        {Err.contactcontactFor && <p className="text-sm text-red-500">{Err.contactcontactFor}</p>}
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="contactemail">Email</Label>
                        <Input
                          id="contactemail"
                          name="contactemail"
                          placeholder="Contact Email"
                          value={contact.contactemail}
                          onChange={handleContactChange}
                        />
                        {Err.contactemail && <p className="text-sm text-red-500">{Err.contactemail}</p>}
                      </div>

                      <div className="flex w-full flex-col space-y-1.5">
                        <Label htmlFor="contactphone">
                          Mobile Number<span className="text-xs text-gray-400"> (with country code, e.g., +91XXXXXXXXXX)</span>
                        </Label>
                        <Input
                          id="contactphone"
                          name="contactphone"
                          placeholder="e.g. +91XXXXXXXXXX"
                          value={contact.contactphone}
                          onChange={handleContactChange}
                        />
                        {Err.contactphone && <p className="text-sm text-red-500">{Err.contactphone}</p>}
                      </div>

                      <div className="flex w-full flex-col space-y-1.5">
                        <Label htmlFor="contactalternativePhone">Alternative Phone<span className="text-xs text-gray-400"> (with country code, e.g., +91XXXXXXXXXX)</span></Label>
                        <Input
                          id="contactalternativePhone"
                          name="contactalternativePhone"
                          placeholder="e.g. +91XXXXXXXXXX"
                          value={contact.contactalternativePhone}
                          onChange={handleContactChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={addContact}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <div className="mt-3 flex w-full justify-center">
          <Button
            className="mt-3 w-1/4"
            onClick={handleSave}
            type="button"
          >
            {location.state?.customer ? "Update Customer" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomersInformation;
