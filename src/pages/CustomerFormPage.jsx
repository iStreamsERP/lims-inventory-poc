import { useFormik } from "formik";
import * as Yup from "yup";
import AddContact from "@/components/AddContact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { callSoapService } from "@/services/callSoapService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { toTitleCase } from "@/utils/stringUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const CustomerFormPage = () => {
  const { id: clientIDParams } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [openNatureOfBusiness, setOpenNatureOfBusiness] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [openOtherNatureOfBusiness, setOpenOtherNatureOfBusiness] = useState(false);
  const [commandInputValue, setCommandInputValue] = useState("");

  const [natureOfBusiness, setNatureOfBusiness] = useState([]);
  const [otherNatureOfBusiness, setOtherNatureOfBusiness] = useState([]);
  const [locationData, setLocationData] = useState([]);

  // Validation Schema
  const validationSchema = Yup.object({
    CLIENT_NAME: Yup.string().required("Customer name is required"),
    EMAIL_ADDRESS: Yup.string().email("Invalid email address").required("Email is required"),
    NATURE_OF_BUSINESS: Yup.string().required("Primary nature of business is required"),
    TELEPHONE_NO: Yup.string()
      .required("Phone number is required")
      .matches(/^\+\d{1,4}\d{7,12}$/, "Must include country code and be valid"),
    TRN_VAT_NO: Yup.string().required("TRN/VAT is required"),
    GROUP_NAME: Yup.string().required("Group of company is required"),
    WEB_ADDRESS: Yup.string().trim().url("Invalid web address format").required("Web address of company is required"),
    COUNTRY: Yup.string().required("Country is required"),
    STATE_NAME: Yup.string().required("State is required"),
    CITY_NAME: Yup.string().required("City is required"),
    COMMUNICATION_ADDRESS: Yup.string().trim().required("Communication address is required"),
    INVOICE_ADDRESS: Yup.string().trim().required("Invoice address is required"),

    DELIVERY_ADDRESS: Yup.string().trim().required("Delivery address is required"),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      CLIENT_ID: -1,
      CLIENT_NAME: "",
      EMAIL_ADDRESS: "",
      NATURE_OF_BUSINESS: "",
      NATURE_OF_BUSINESS2: [],
      TRN_VAT_NO: "",
      GROUP_NAME: "",
      TELEPHONE_NO: "",
      WEB_ADDRESS: "",
      COUNTRY: "",
      STATE_NAME: "",
      CITY_NAME: "",
      COMMUNICATION_ADDRESS: "",
      INVOICE_ADDRESS: "",
      DELIVERY_ADDRESS: "",
      ENT_DATE: "",
      USER_NAME: userData.currentUserName,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const convertedDataModel = convertDataModelToStringData("CLIENT_MASTER", values);

        const payload = {
          UserName: userData.userEmail,
          DModelData: convertedDataModel,
        };

        const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);

        const match = response.match(/Client ID\s*'(\d+)'/);
        const newClientId = match ? parseInt(match[1], 10) : -1;

        if (newClientId !== -1) {
          formik.setFieldValue("CLIENT_ID", newClientId);
          toast({
            title: response,
          });
        }
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
    if (clientIDParams) {
      fetchClientData();
    }

    fetchLocationData();
    fetchNatureOfBusinessUsingQuery();
  }, [clientIDParams]);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const payload = {
        DataModelName: "CLIENT_MASTER",
        WhereCondition: `CLIENT_ID = ${clientIDParams}`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      const client = response?.[0] || {};

      formik.setValues({
        ...client,
        NATURE_OF_BUSINESS2: client.NATURE_OF_BUSINESS2 ? client.NATURE_OF_BUSINESS2.split(",").map((item) => item.trim()) : [],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNatureOfBusinessUsingQuery = async () => {
    setLoading(true);
    try {
      const payload = {
        SQLQuery:
          "SELECT DISTINCT NATURE_OF_BUSINESS from CLIENT_MASTER where NATURE_OF_BUSINESS IS NOT NULL AND NATURE_OF_BUSINESS &lt;&gt; '' ORDER BY NATURE_OF_BUSINESS",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);
      setNatureOfBusiness(response);
      setOtherNatureOfBusiness(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching nature of business: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const payload = {
        DataModelName: "COUNTRY_MASTER",
        WhereCondition: "",
        Orderby: "",
      };
      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setLocationData(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching location data: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">{formik.values.CLIENT_ID === -1 ? "Create Customer" : "Edit Customer"}</h1>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <Card className="h-fit w-full p-4 lg:w-[70%]">
          <form
            className="flex flex-wrap gap-2"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="w-full md:w-1/2">
                <Label htmlFor="CLIENT_NAME">Company / Customer Name<span className="text-red-500">*</span></Label>
                <Input
                  id="CLIENT_NAME"
                  name="CLIENT_NAME"
                  type="text"
                  placeholder="Company name / Your name (If you are individual)"
                  value={formik.values.CLIENT_NAME}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.CLIENT_NAME && formik.errors.CLIENT_NAME && <p className="text-sm text-red-500">{formik.errors.CLIENT_NAME}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="EMAIL_ADDRESS">Email ID<span className="text-red-500">*</span></Label>
                <Input
                  id="EMAIL_ADDRESS"
                  name="EMAIL_ADDRESS"
                  type="email"
                  placeholder="Enter your email ID"
                  value={formik.values.EMAIL_ADDRESS}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.EMAIL_ADDRESS && formik.errors.EMAIL_ADDRESS && <p className="text-sm text-red-500">{formik.errors.EMAIL_ADDRESS}</p>}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="mt-3 w-full md:w-1/2">
                <Label className="block text-sm font-medium">
                  Select Nature Of Business <span className="font-normal text-gray-500">(Primary)</span><span className="text-red-500">*</span>
                </Label>
                <Popover
                  open={openNatureOfBusiness}
                  onOpenChange={setOpenNatureOfBusiness}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openNatureOfBusiness}
                      className={cn(
                        "min-h-10 w-full justify-between gap-2 text-left font-normal",
                        !formik.values.NATURE_OF_BUSINESS && "text-gray-400",
                        formik.touched.NATURE_OF_BUSINESS && formik.errors.NATURE_OF_BUSINESS ? "border-red-500" : "",
                      )}
                    >
                      {formik.values.NATURE_OF_BUSINESS
                        ? natureOfBusiness.find((item) => item.NATURE_OF_BUSINESS === formik.values.NATURE_OF_BUSINESS)?.NATURE_OF_BUSINESS
                        : "Select nature of business"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command className="w-full justify-start">
                      <CommandInput
                        placeholder="Search nature of business"
                        className="h-9"
                        onValueChange={setCommandInputValue}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="flex items-center justify-between">
                            <span>No nature of business found.</span>
                            {commandInputValue && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const newValue = toTitleCase(commandInputValue.trim());
                                  if (newValue) {
                                    setNatureOfBusiness((prev) => [...prev, { NATURE_OF_BUSINESS: newValue }]);
                                    formik.setFieldValue("NATURE_OF_BUSINESS", newValue);
                                    formik.setFieldTouched("NATURE_OF_BUSINESS", true);
                                    setOpenNatureOfBusiness(false);
                                  }
                                }}
                              >
                                Add “{commandInputValue}”
                              </Button>
                            )}
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {natureOfBusiness.map((item, index) => (
                            <CommandItem
                              key={index}
                              value={item.NATURE_OF_BUSINESS}
                              onSelect={(currentValue) => {
                                formik.setFieldValue("NATURE_OF_BUSINESS", currentValue);
                                formik.setFieldTouched("NATURE_OF_BUSINESS", true);
                                setOpenNatureOfBusiness(false);
                              }}
                            >
                              {item.NATURE_OF_BUSINESS}
                              <Check
                                className={cn("ml-auto", formik.values.NATURE_OF_BUSINESS === item.NATURE_OF_BUSINESS ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formik.touched.NATURE_OF_BUSINESS && formik.errors.NATURE_OF_BUSINESS && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.NATURE_OF_BUSINESS}</p>
                )}
              </div>

              <div className="mt-3 w-full md:w-1/2">
                <Label className="block text-sm font-medium">Select Other Nature Of Business</Label>
                <Popover
                  open={openOtherNatureOfBusiness}
                  onOpenChange={setOpenOtherNatureOfBusiness}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openOtherNatureOfBusiness}
                      className="min-h-10 w-full justify-between gap-2 text-left font-normal text-gray-400"
                    >
                      {formik.values.NATURE_OF_BUSINESS2.length > 0
                        ? formik.values.NATURE_OF_BUSINESS2.join(", ")
                        : "Select other nature of business"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command className="w-full justify-start">
                      <CommandInput
                        placeholder="Search other nature of business"
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No other nature of business found.</CommandEmpty>
                        <CommandGroup>
                          {otherNatureOfBusiness.map((item, index) => (
                            <CommandItem
                              key={index}
                              value={item.NATURE_OF_BUSINESS}
                              onSelect={(currentValue) => {
                                const currentSelections = formik.values.NATURE_OF_BUSINESS2;
                                let newSelections;

                                if (currentSelections.includes(currentValue)) {
                                  newSelections = currentSelections.filter((val) => val !== currentValue);
                                } else {
                                  newSelections = [...currentSelections, currentValue];
                                }

                                formik.setFieldValue("NATURE_OF_BUSINESS2", newSelections);
                              }}
                            >
                              {item.NATURE_OF_BUSINESS}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formik.values.NATURE_OF_BUSINESS2.includes(item.NATURE_OF_BUSINESS) ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="w-full md:w-1/2">
                <Label htmlFor="TRN_VAT_NO">VAT/GST/TAX No<span className="text-red-500">*</span></Label>
                <Input
                  id="TRN_VAT_NO"
                  name="TRN_VAT_NO"
                  type="text"
                  placeholder="Enter VAT/GST/TAX No"
                  value={formik.values.TRN_VAT_NO}
                  onChange={formik.handleChange}
                />
                {formik.touched.TRN_VAT_NO && formik.errors.TRN_VAT_NO && <p className="mt-1 text-sm text-red-500">{formik.errors.TRN_VAT_NO}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="GROUP_NAME">Group of Company<span className="text-red-500">*</span></Label>
                <Input
                  id="GROUP_NAME"
                  name="GROUP_NAME"
                  placeholder="Enter Group Name"
                  value={formik.values.GROUP_NAME}
                  onChange={formik.handleChange}
                />
                {formik.touched.GROUP_NAME && formik.errors.GROUP_NAME && <p className="mt-1 text-sm text-red-500">{formik.errors.GROUP_NAME}</p>}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="w-full md:w-1/2">
                <Label htmlFor="TELEPHONE_NO">
                  Phone Number<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="TELEPHONE_NO"
                  name="TELEPHONE_NO"
                  type="text"
                  placeholder="e.g. +91XXXXXXXXXX"
                  value={formik.values.TELEPHONE_NO}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.TELEPHONE_NO && formik.errors.TELEPHONE_NO && <p className="text-sm text-red-500">{formik.errors.TELEPHONE_NO}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="WEB_ADDRESS">Website URL<span className="text-red-500">*</span></Label>
                <Input
                  id="WEB_ADDRESS"
                  name="WEB_ADDRESS"
                  type="url"
                  placeholder="Enter your website URL"
                  value={formik.values.WEB_ADDRESS}
                  onChange={formik.handleChange}
                />
                {formik.touched.WEB_ADDRESS && formik.errors.WEB_ADDRESS && <p className="mt-1 text-sm text-red-500">{formik.errors.WEB_ADDRESS}</p>}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="mt-3 w-full md:w-1/2">
                <Label className="block text-sm font-medium">Select Country<span className="text-red-500">*</span></Label>
                <Popover
                  open={openCountry}
                  onOpenChange={setOpenCountry}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCountry}
                      className={cn(
                        "min-h-10 w-full justify-between gap-2 text-left font-normal",
                        !formik.values.COUNTRY && "text-gray-400",
                        formik.touched.COUNTRY && formik.errors.COUNTRY ? "border-red-500" : "",
                      )}
                    >
                      {formik.values.COUNTRY
                        ? locationData.find((location) => location.COUNTRY === formik.values.COUNTRY)?.COUNTRY
                        : "Select country..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command className="w-full justify-start">
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {locationData.map((location, index) => (
                            <CommandItem
                              key={index}
                              value={location.COUNTRY}
                              onSelect={(currentValue) => {
                                formik.setFieldValue("COUNTRY", currentValue);
                                formik.setFieldTouched("COUNTRY", true);
                                setOpenCountry(false);
                              }}
                            >
                              {location.COUNTRY}
                              <Check className={cn("ml-auto", formik.values.COUNTRY === location.COUNTRY ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formik.touched.COUNTRY && formik.errors.COUNTRY && <p className="mt-1 text-sm text-red-500">{formik.errors.COUNTRY}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="STATE_NAME">State<span className="text-red-500">*</span></Label>
                <Input
                  id="STATE_NAME"
                  name="STATE_NAME"
                  type="text"
                  placeholder="Enter State Name"
                  value={formik.values.STATE_NAME}
                  onChange={formik.handleChange}
                />
                {formik.touched.STATE_NAME && formik.errors.STATE_NAME && <p className="text-sm text-red-500">{formik.errors.STATE_NAME}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="CITY_NAME">City<span className="text-red-500">*</span></Label>
                <Input
                  id="CITY_NAME"
                  name="CITY_NAME"
                  type="text"
                  placeholder="Enter City Name"
                  value={formik.values.CITY_NAME}
                  onChange={formik.handleChange}
                />
                {formik.touched.CITY_NAME && formik.errors.CITY_NAME && <p className="text-sm text-red-500">{formik.errors.CITY_NAME}</p>}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="w-full md:w-1/2">
                <Label htmlFor="COMMUNICATION_ADDRESS">Communication Address<span className="text-red-500">*</span></Label>
                <Textarea
                  id="COMMUNICATION_ADDRESS"
                  name="COMMUNICATION_ADDRESS"
                  type="text"
                  placeholder="Communication Address"
                  value={formik.values.COMMUNICATION_ADDRESS}
                  onChange={formik.handleChange}
                />
                {formik.touched.COMMUNICATION_ADDRESS && formik.errors.COMMUNICATION_ADDRESS && (
                  <p className="text-sm text-red-500">{formik.errors.COMMUNICATION_ADDRESS}</p>
                )}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="INVOICE_ADDRESS">Invoice Address<span className="text-red-500">*</span></Label>
                <Textarea
                  id="INVOICE_ADDRESS"
                  name="INVOICE_ADDRESS"
                  type="text"
                  placeholder="Invoice Address"
                  value={formik.values.INVOICE_ADDRESS}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.INVOICE_ADDRESS && formik.errors.INVOICE_ADDRESS && (
                  <p className="text-sm text-red-500">{formik.errors.INVOICE_ADDRESS}</p>
                )}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="DELIVERY_ADDRESS">Delivery Address<span className="text-red-500">*</span></Label>
                <Textarea
                  id="DELIVERY_ADDRESS"
                  placeholder="Delivery Address"
                  name="DELIVERY_ADDRESS"
                  type="text"
                  value={formik.values.DELIVERY_ADDRESS}
                  onChange={formik.handleChange}
                />
                {formik.touched.DELIVERY_ADDRESS && formik.errors.DELIVERY_ADDRESS && (
                  <p className="text-sm text-red-500">{formik.errors.DELIVERY_ADDRESS}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex w-full items-center justify-center">
              <Button
                type="submit"
                disabled={loading || !formik.isValid || !formik.dirty}
              >
                {loading ? (
                  <BeatLoader
                    color="#000"
                    size={8}
                  />
                ) : formik.values.CLIENT_ID === -1 ? (
                  "Save Customer"
                ) : (
                  "Update Customer"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <AddContact clientId={formik.values.CLIENT_ID} />
      </div>
    </div>
  );
};

export default CustomerFormPage;
