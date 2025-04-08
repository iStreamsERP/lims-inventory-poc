import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

const AddContact = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, SetError] = useState({});

    const [customer, setCustomer] = useState({
        contacts: [],
    });

    const [contactFormData, setContactFormData] = useState({
        CLIENT_ID: null,
        SERIAL_NO: "",
        NAME: "",
        DESIGNATION: "",
        TELEPHONE_NO: "",
        FAX_NO: "",
        EMAIL_ADDRESS: "",
        ADDRESS: "",
        CONTACT_FOR: "",
        MOBILE_NO: "",
        ALTERNATIVE_CONTACT: "",
    });

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactFormData((prev) => ({
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
        setContactFormData({
            CLIENT_ID: null,
            SERIAL_NO: "",
            NAME: "",
            DESIGNATION: "",
            TELEPHONE_NO: "",
            FAX_NO: "",
            EMAIL_ADDRESS: "",
            ADDRESS: "",
            CONTACT_FOR: "",
            MOBILE_NO: "",
            ALTERNATIVE_CONTACT: "",
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

    return (
        <Card className="w-full lg:w-[30%]">
            <CardHeader>
                <CardTitle>Add Contacts</CardTitle>
            </CardHeader>
            <CardContent className="h-[530px] overflow-y-scroll z-[999]">
                <div className="flex flex-col flex-wrap gap-4">
                    {customer.contacts.map((item) => (
                        <Card
                            className="flex h-[100px] w-full flex-col justify-center gap-2 p-3"
                            key={item.contactemail}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm font-bold leading-none text-gray-700">{item.NAME}</p>
                                    <p className="mb-1 text-xs font-semibold text-gray-500">{item.DESIGNATION}</p>
                                    <p className="text-xs text-gray-600">{item.EMAIL_ADDRESS}</p>
                                    <p className="text-xs text-blue-600">+91 {item.TELEPHONE_NO}</p>
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
                        >
                            Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form>
                            <DialogHeader>
                                <DialogTitle>{contactFormData.NAME ? "Edit Contact" : "Add Contact"}</DialogTitle>
                                <DialogDescription>Enter the contact details and click save.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="NAME">Name</Label>
                                    <Input
                                        id="NAME"
                                        name="NAME"
                                        placeholder="Contact Name"
                                        value={contactFormData.NAME}
                                        onChange={handleContactChange}
                                    />
                                    {error.NAME && <p className="text-sm text-red-500">{error.NAME}</p>}
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="DESIGNATION">Designation</Label>
                                    <Input
                                        id="DESIGNATION"
                                        placeholder="Designation"
                                        name="DESIGNATION"
                                        value={contactFormData.DESIGNATION}
                                        onChange={handleContactChange}
                                    />
                                    {error.DESIGNATION && <p className="text-sm text-red-500">{error.DESIGNATION}</p>}
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="CONTACT_FOR">Contact for</Label>
                                    <Select
                                        id="CONTACT_FOR"
                                        value={contactFormData.CONTACT_FOR || ""}
                                        onValueChange={(value) => setContactFormData((prev) => ({ ...prev, CONTACT_FOR: value }))}
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
                                    {error.CONTACT_FOR && <p className="text-sm text-red-500">{error.CONTACT_FOR}</p>}
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="EMAIL_ADDRESS">Email</Label>
                                    <Input
                                        id="EMAIL_ADDRESS"
                                        name="EMAIL_ADDRESS"
                                        placeholder="Contact Email"
                                        value={contactFormData.EMAIL_ADDRESS}
                                        onChange={handleContactChange}
                                    />
                                    {error.EMAIL_ADDRESS && <p className="text-sm text-red-500">{error.EMAIL_ADDRESS}</p>}
                                </div>

                                <div className="flex w-full flex-col space-y-1.5">
                                    <Label htmlFor="TELEPHONE_NO">
                                        Mobile Number<span className="text-xs text-gray-400"> (with country code, e.g., +91XXXXXXXXXX)</span>
                                    </Label>
                                    <Input
                                        id="TELEPHONE_NO"
                                        name="TELEPHONE_NO"
                                        placeholder="e.g. +91XXXXXXXXXX"
                                        value={contactFormData.TELEPHONE_NO}
                                        onChange={handleContactChange}
                                    />
                                    {error.TELEPHONE_NO && <p className="text-sm text-red-500">{error.TELEPHONE_NO}</p>}
                                </div>

                                <div className="flex w-full flex-col space-y-1.5">
                                    <Label htmlFor="ALTERNATIVE_CONTACT">Alternative Phone<span className="text-xs text-gray-400"> (with country code, e.g., +91XXXXXXXXXX)</span></Label>
                                    <Input
                                        id="ALTERNATIVE_CONTACT"
                                        name="ALTERNATIVE_CONTACT"
                                        placeholder="e.g. +91XXXXXXXXXX"
                                        value={contactFormData.ALTERNATIVE_CONTACT}
                                        onChange={handleContactChange}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
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
    )
}

export default AddContact
