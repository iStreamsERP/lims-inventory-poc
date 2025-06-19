import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
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
  const [isEnabled, setIsEnabled] = useState(false);
  const [clientContacts, setClientContacts] = useState([]);

  // Validation Schema
  const contactSchema = Yup.object({
    NAME: Yup.string().required('Name is required'),
    DESIGNATION: Yup.string().required('Designation is required'),
    CONTACT_FOR: Yup.string().required('Contact purpose is required'),
    EMAIL_ADDRESS: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    TELEPHONE_NO: Yup.string()
      .required('Phone number is required')
      .matches(/^\+\d{1,3}\d{6,14}$/, 'Format: +[country code][number]'),
    ALTERNATIVE_CONTACT: Yup.string()
      .matches(/^\+\d{1,3}\d{6,14}$|^$/, 'Format: +[country code][number]'),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: initialFormData,
    validationSchema: contactSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const convertedDataModel = convertDataModelToStringData(
          "CLIENT_CONTACTS",
          values
        );

        const payload = {
          UserName: userData.userEmail,
          DModelData: convertedDataModel,
        };

        const response = await callSoapService(
          userData.clientURL,
          "DataModel_SaveData",
          payload
        );

        toast({
          title: response,
        });

        await fetchClientContacts();
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error saving data. Please try again.",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (clientId !== -1) {
      setIsEnabled(true);
      formik.setFieldValue('CLIENT_ID', clientId);
      fetchClientContacts();
    }
  }, [clientId]);

  const fetchClientContacts = async () => {
    try {
      const payload = {
        DataModelName: "CLIENT_CONTACTS",
        WhereCondition: `CLIENT_ID = ${clientId}`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setClientContacts(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `"Error fetching client contacts." ${error}`,
      });
    }
  };

  const handleDelete = async (contact) => {
    setLoading(true);
    const result = window.confirm("Are you sure you want to delete this contact? This action cannot be undone.");

    if (!result) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        UserName: userData.userEmail,
        DataModelName: "CLIENT_CONTACTS",
        WhereCondition: `CLIENT_ID = ${clientId} AND SERIAL_NO = ${contact.SERIAL_NO}`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_DeleteData", payload);

      toast({
        variant: "destructive",
        title: response,
      });

      await fetchClientContacts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error deleting contact: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserDialogClose = () => {
    setIsDialogOpen(false);
    formik.resetForm();
    formik.setFieldValue('CLIENT_ID', clientId);
    fetchClientContacts();
  };

  const handleEdit = (contact) => {
    setIsDialogOpen(true);
    formik.setValues({
      CLIENT_ID: clientId,
      SERIAL_NO: contact.SERIAL_NO,
      NAME: contact.NAME,
      DESIGNATION: contact.DESIGNATION,
      TELEPHONE_NO: contact.TELEPHONE_NO,
      EMAIL_ADDRESS: contact.EMAIL_ADDRESS,
      CONTACT_FOR: contact.CONTACT_FOR,
      ALTERNATIVE_CONTACT: contact.ALTERNATIVE_CONTACT,
    });
  };

  return (
    <Card className="w-full lg:w-[30%]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-gray-400" />
          Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="z-[999] h-[450px] overflow-y-scroll">
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
                  <p
                    className="cursor-pointer text-sm text-gray-600 hover:underline"
                    onClick={() => window.open(`mailto:${contact.EMAIL_ADDRESS}`)}
                  >
                    {contact.EMAIL_ADDRESS}
                  </p>
                  <p
                    className="cursor-pointer text-sm text-blue-600 hover:underline"
                    onClick={() => window.open(`tel:${contact.TELEPHONE_NO}`)}
                  >
                    {contact.TELEPHONE_NO}
                  </p>
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

      <CardFooter className="flex items-center justify-center">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleUserDialogClose();
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                formik.resetForm();
                formik.setFieldValue('CLIENT_ID', clientId);
                setIsDialogOpen(true);
              }}
              disabled={!isEnabled}
            >
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[50%] max-h-[90%] overflow-y-auto z-[999]">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>Contact</DialogTitle>
                <DialogDescription>Enter the contact details and click save.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="w-full flex flex-col space-y-1.5">
                  <Label htmlFor="NAME">Name<span className="text-red-500">*</span></Label>
                  <Input
                    id="NAME"
                    name="NAME"
                    placeholder="Contact Name"
                    value={formik.values.NAME}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.NAME && formik.errors.NAME && (
                    <p className="text-sm text-red-500">{formik.errors.NAME}</p>
                  )}
                </div>

                <div className="w-full flex flex-col space-y-1.5">
                  <Label htmlFor="DESIGNATION">Designation<span className="text-red-500">*</span></Label>
                  <Input
                    id="DESIGNATION"
                    placeholder="Designation"
                    name="DESIGNATION"
                    value={formik.values.DESIGNATION}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.DESIGNATION && formik.errors.DESIGNATION && (
                    <p className="text-sm text-red-500">{formik.errors.DESIGNATION}</p>
                  )}
                </div>

                <div className="w-full flex flex-col space-y-1.5">
                  <Label htmlFor="CONTACT_FOR">Contact for<span className="text-red-500">*</span></Label>
                  <Select
                    id="CONTACT_FOR"
                    value={formik.values.CONTACT_FOR || ""}
                    onValueChange={(value) =>
                      formik.setFieldValue("CONTACT_FOR", value)
                    }
                    onBlur={() => formik.setFieldTouched("CONTACT_FOR", true)}
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
                  {formik.touched.CONTACT_FOR && formik.errors.CONTACT_FOR && (
                    <p className="text-sm text-red-500">{formik.errors.CONTACT_FOR}</p>
                  )}
                </div>

                <div className="w-full flex flex-col space-y-1.5">
                  <Label htmlFor="EMAIL_ADDRESS">Email<span className="text-red-500">*</span></Label>
                  <Input
                    id="EMAIL_ADDRESS"
                    name="EMAIL_ADDRESS"
                    placeholder="Contact Email"
                    value={formik.values.EMAIL_ADDRESS}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.EMAIL_ADDRESS && formik.errors.EMAIL_ADDRESS && (
                    <p className="text-sm text-red-500">{formik.errors.EMAIL_ADDRESS}</p>
                  )}
                </div>

                <div className="w-full flex flex-col space-y-1.5">
                  <Label htmlFor="TELEPHONE_NO">
                    Mobile Number<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="TELEPHONE_NO"
                    name="TELEPHONE_NO"
                    placeholder="e.g. +91XXXXXXXXXX"
                    value={formik.values.TELEPHONE_NO}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.TELEPHONE_NO && formik.errors.TELEPHONE_NO && (
                    <p className="text-sm text-red-500">{formik.errors.TELEPHONE_NO}</p>
                  )}
                </div>

                <div className="w-full flex flex-col space-y-1.5">
                  <Label htmlFor="ALTERNATIVE_CONTACT">
                    Alternative Phone
                  </Label>
                  <Input
                    id="ALTERNATIVE_CONTACT"
                    name="ALTERNATIVE_CONTACT"
                    placeholder="e.g. +91XXXXXXXXXX"
                    value={formik.values.ALTERNATIVE_CONTACT}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.ALTERNATIVE_CONTACT && formik.errors.ALTERNATIVE_CONTACT && (
                    <p className="text-sm text-red-500">{formik.errors.ALTERNATIVE_CONTACT}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUserDialogClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formik.isValid}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default AddContact;