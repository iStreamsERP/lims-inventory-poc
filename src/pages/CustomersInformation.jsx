import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

const CustomersInformation = () => {
  const [newContact, setNewContact] = useState({
    id: null,
    name: "",
    designation: "",
    contactFor: "",
    email: "",
    phone: "",
    alternativePhone: "",
  });

  const [data, SetData] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (newContact.name && newContact.email && newContact.phone) {
      SetData((prevData) => {
        if (newContact.id) {
          return prevData.map((item) => (item.id === newContact.id ? newContact : item));
        } else {
          return [...prevData, { ...newContact, id: prevData.length + 1 }];
        }
      });
      setNewContact({ name: "", designation: "", contactFor: "", email: "", phone: "", alternativePhone: "" });
      setDialogOpen(false);
    } else {
      alert("Please fill in all required fields!");
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);

    if (!newContact.id) {
      setNewContact({ name: "", designation: "", contactFor: "", email: "", phone: "", alternativePhone: "" });
    }
  };

  const handleDeleteContact = (id) => {
    SetData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleEditContact = (id) => {
    const contactToEdit = data.find((item) => item.id === id);
    if (contactToEdit) {
      setNewContact(contactToEdit);
      setDialogOpen(true);
    }
  };

  return (

    <div className="flex flex-col gap-y-4">
      <h1 className="title">Customer Information</h1>
      <div className="flex w-full flex-col gap-4">
        <form>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <Card className="w-full lg:w-[70%]">
              <CardHeader>
                <CardTitle>Add Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 overflow-y-auto">
                  <div className="flex w-full flex-col gap-2 md:flex-row">
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="CLIENT_NAME">Company Name</Label>
                      <Input
                        id="CLIENT_NAME"
                        placeholder="Name of your Company"
                      />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="EMAIL_ADDRESS">Email</Label>
                      <Input
                        id="EMAIL_ADDRESS"
                        placeholder="Enter Email"
                      />
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="NATURE_OF_BUSINESS">Select Business</Label>
                      <Select>
                        <SelectTrigger id="NATURE_OF_BUSINESS">
                          <SelectValue placeholder="Select Business" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 md:flex-row">
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="TRN_VAT_NO">VAT/GST/TAX No</Label>
                      <Input
                        id="TRN_VAT_NO"
                        placeholder="Enter Tax.no"
                      />
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="GROUP_NAME">Group of</Label>
                      <Input
                        id="GROUP_NAME"
                        placeholder="Enter Group Name"
                      />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="TELEPHONE_NO">Phone Number</Label>
                      <Input
                        id="TELEPHONE_NO"
                        placeholder="Enter Phone Number"
                      />
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 md:flex-row">
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="CITY_NAME">City</Label>
                      <Input
                        id="CITY_NAME"
                        placeholder="Enter City Name"
                      />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="COUNTRY">Select Country</Label>
                      <Select>
                        <SelectTrigger id="COUNTRY">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="usa">USA</SelectItem>
                          <SelectItem value="uk">UK</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="WEB_ADDRESS">Website</Label>
                      <Input
                        id="WEB_ADDRESS"
                        placeholder="Enter Website"
                      />
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 md:flex-row">
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="COMMUNICATION_ADDRESS">Comm Address</Label>
                      <Textarea
                        id="COMMUNICATION_ADDRESS"
                        placeholder="Communication Address"
                      />
                    </div>

                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="INVOICE_ADDRESS">Invoice Address</Label>
                      <Textarea
                        id="INVOICE_ADDRESS"
                        placeholder="Invoice Address"
                      />
                    </div>
                    <div className="w-full space-y-1.5 md:w-1/2">
                      <Label htmlFor="DELIVERY_ADDRESS">Delivery Address</Label>
                      <Textarea
                        id="DELIVERY_ADDRESS"
                        placeholder="Delivery Address"
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
              <CardContent className="h-[350px] overflow-y-scroll">
                <div className="flex flex-col flex-wrap gap-4">
                  {data &&
                    data.map((item) => (
                      <Card
                        className="flex h-[100px] w-full flex-col justify-center gap-2 p-3"
                        key={item.email}
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-bold leading-none text-gray-700">{item.name}</p>
                            <p className="mb-1 text-xs font-semibold text-gray-500">{item.designation}</p>
                            <p className="text-xs text-gray-600">{item.email}</p>
                            <p className="text-xs text-blue-600">+91 {item.phone}</p>
                          </div>
                          <div className="flex flex-row gap-2">
                            <SquarePen
                              size={14}
                              className="cursor-pointer text-blue-700"
                              onClick={() => handleEditContact(item.id)}
                            />
                            <Trash2
                              size={14}
                              className="cursor-pointer text-red-700"
                              onClick={() => handleDeleteContact(item.id)}
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
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-1/2">Add Contact</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form>
                      <DialogHeader>
                        <DialogTitle>{newContact.name ? "Edit Contact" : "Add Contact"}</DialogTitle>
                        <DialogDescription>Enter the contact details and click save.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="NAME">Name</Label>
                          <Input
                            id="NAME"
                            placeholder="Contact Name"
                            value={newContact.name || ""}
                            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="DESIGNATION">Designation</Label>
                          <Input
                            id="DESIGNATION"
                            placeholder="Designation"
                            value={newContact.designation || ""}
                            onChange={(e) => setNewContact({ ...newContact, designation: e.target.value })}
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="CONTACT_FOR">Contact for</Label>
                          <Select
                            id="CONTACT_FOR"
                            value={newContact.contactFor || ""}
                            onValueChange={(value) => setNewContact({ ...newContact, contactFor: value })}
                          >
                            <SelectTrigger id="CONTACT_FOR">
                              <SelectValue placeholder="Contact for" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="enquiry">Enquiry</SelectItem>
                              <SelectItem value="transportation">Transportation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="EMAIL_ADDRESS">Email</Label>
                          <Input
                            id="EMAIL_ADDRESS"
                            placeholder="Contact Email"
                            value={newContact.email || ""}
                            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          />
                        </div>

                        <div className="flex w-full flex-col space-y-1.5">
                          <Label htmlFor="MOBILE_NO">Mobile Number</Label>
                          <Input
                            id="MOBILE_NO"
                            placeholder="Mobile No"
                            value={newContact.phone || ""}
                            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          />
                        </div>

                        <div className="flex w-full flex-col space-y-1.5">
                          <Label htmlFor="ALTERNATIVE_PHONE">Alternative Phone</Label>
                          <Input
                            id="ALTERNATIVE_PHONE"
                            placeholder="Alternative Phone"
                            value={newContact.alternativePhone || ""}
                            onChange={(e) => setNewContact({ ...newContact, alternativePhone: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="secondary"
                          onClick={handleSaveContact}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveContact}>Save</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </div>



  );
};

export default CustomersInformation;
