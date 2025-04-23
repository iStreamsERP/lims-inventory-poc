import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { deleteDataModelService, getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { SquarePen, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

const AddContact = ({ clientId }) => {
    const initialFormData = {
        CLIENT_ID: clientId,
        SERIAL_NO: -1,
        NAME: "",
        DESIGNATION: "",
        TELEPHONE_NO: "",
        EMAIL_ADDRESS: "",
        CONTACT_FOR: "",
        ALTERNATIVE_CONTACT: "",
    };

    const { userData } = useAuth();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, SetError] = useState({});
    const [isEnabled, setIsEnabled] = useState(false);

    const [clientContacts, setClientContacts] = useState([]);

    const [contactFormData, setContactFormData] = useState(initialFormData);

    useEffect(() => {
        if (clientId !== -1) {
            setIsEnabled(true);
            setContactFormData((prev) => ({
                ...prev,
                CLIENT_ID: clientId,
            }));
            fetchClientContacts();
        }
    }, [clientId]);

    const fetchClientContacts = async () => {
        try {
            const clientContactsPayload = {
                DataModelName: "CLIENT_CONTACTS",
                WhereCondition: `CLIENT_ID = ${clientId}`,
                Orderby: "",
            }
            const getClientContactsResponse = await getDataModelService(clientContactsPayload, userData.currentUserLogin, userData.clientURL);

            setClientContacts(getClientContactsResponse);
        } catch (error) {
            toast({
                variant: "destructive",
                title: `"Error fetching client contacts." ${error}`,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async (contact) => {
        setLoading(true);
        const result = window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")

        if (!result) {
            setLoading(false);
            return;
        }

        try {
            const deleteDataModelServicePayload = {
                UserName: userData.currentUserLogin,
                DataModelName: "CLIENT_CONTACTS",
                WhereCondition: `CLIENT_ID = ${clientId} AND SERIAL_NO = ${contact.SERIAL_NO}`,
            }
            const deleteDataModelServiceResponse = await deleteDataModelService(deleteDataModelServicePayload, userData.currentUserLogin, userData.clientURL);

            toast({
                variant: "destructive",
                title: deleteDataModelServiceResponse,
            })

            await fetchClientContacts();
        } catch (error) {
            setError({ fetch: error.message });
            toast({
                variant: "destructive",
                title: `Error fetching client: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }



    }

    const handleUserDialogClose = () => {
        setContactFormData(initialFormData);
        setIsDialogOpen(false);
        fetchClientContacts();
    };

    const handleEdit = async (contact) => {
        setIsDialogOpen(true)
        setContactFormData({
            CLIENT_ID: clientId,
            SERIAL_NO: contact.SERIAL_NO,
            NAME: contact.NAME,
            DESIGNATION: contact.DESIGNATION,
            TELEPHONE_NO: contact.TELEPHONE_NO,
            EMAIL_ADDRESS: contact.EMAIL_ADDRESS,
            CONTACT_FOR: contact.CONTACT_FOR,
            ALTERNATIVE_CONTACT: contact.ALTERNATIVE_CONTACT,
        })
    }

    const handleSumbit = async () => {
        try {
            setLoading(true);

            const convertedDataModel = convertDataModelToStringData("CLIENT_CONTACTS", contactFormData);
            console.log(convertedDataModel);

            const clientContactsPayload = {
                UserName: userData.currentUserLogin,
                DModelData: convertedDataModel,
            }

            const clientContactsSaveResponse = await saveDataService(clientContactsPayload, userData.currentUserLogin, userData.clientURL);

            toast({
                title: clientContactsSaveResponse,
            })

            await fetchClientContacts();

            setContactFormData({
                CLIENT_ID: clientId,
                SERIAL_NO: -1,
                NAME: "",
                DESIGNATION: "",
                TELEPHONE_NO: "",
                EMAIL_ADDRESS: "",
                CONTACT_FOR: "",
                ALTERNATIVE_CONTACT: "",
            });

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error saving data. Please try again.", error,
            })
        } finally {
            setIsDialogOpen(false);
            setLoading(false);
        }
    };

    return (
        <Card className="w-full lg:w-[30%]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="text-gray-400" />Contacts</CardTitle>
            </CardHeader>
            <CardContent className="h-[450px] overflow-y-scroll z-[999]">
                <div className="flex flex-col flex-wrap gap-4">
                    {clientContacts.map((contact) => (
                        <Card
                            className="flex h-[100px] w-full flex-col justify-center gap-2 p-3"
                            key={contact.SERIAL_NO}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-xl font-semibold leading-none">{contact.NAME}</p>
                                    <p className="mb-2 text-xs font-semibold text-gray-500">{contact.DESIGNATION}</p>
                                    <p className="text-sm text-gray-600 hover:underline cursor-pointer" onClick={() => window.open(`mailto:${contact.EMAIL_ADDRESS}`)}>{contact.EMAIL_ADDRESS}</p>
                                    <p className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => window.open(`tel:${contact.TELEPHONE_NO}`)}>{contact.TELEPHONE_NO}</p>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <SquarePen
                                        size={18}
                                        className="cursor-pointer text-blue-700"
                                        onClick={() => handleEdit(contact)}
                                    />
                                    <Trash2
                                        size={18}
                                        className="cursor-pointer text-red-700"
                                        onClick={() => handleDelete(contact)}
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
                    onOpenChange={(open) => {
                        if (!open) handleUserDialogClose();
                        setIsDialogOpen(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            disabled={!isEnabled}
                        >
                            Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form>
                            <DialogHeader>
                                <DialogTitle>Contact</DialogTitle>
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                    onClick={handleSumbit}
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
