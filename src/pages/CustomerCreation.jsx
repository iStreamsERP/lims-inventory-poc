import AddContact from "@/components/AddContact";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { countryConstants, natureOfBusinessConstants, otherNatureOfBusinessConstants } from "@/constants/contactConstant";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getDataModelFromQueryService, getDataModelService, saveDataService } from "@/services/dataModelService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";


const CustomerCreation = () => {
  const { id: clientIDParams } = useParams();
  const { userData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [openNatureOfBusiness, setOpenNatureOfBusiness] = useState(false)
  const [openCountry, setOpenCountry] = useState(false)
  const [openOtherNatureOfBusiness, setOpenOtherNatureOfBusiness] = useState(false)

  const [customerFormData, setCustomerFormData] = useState({
    CLIENT_ID: -1,
    CLIENT_NAME: "",
    EMAIL_ADDRESS: "",
    NATURE_OF_BUSINESS: "",
    OTHER_NATURE_OF_BUSINESS: "",
    TRN_VAT_NO: "",
    GROUP_NAME: "",
    TELEPHONE_NO: "",
    WEB_ADDRESS: "",
    COUNTRY: "",
    STATE: "",
    CITY_NAME: "",
    COMMUNICATION_ADDRESS: "",
    INVOICE_ADDRESS: "",
    DELIVERY_ADDRESS: "",
    ENT_DATE: "",
    USER_NAME: userData.currentUserName,
  });

  const [natureOfBusiness, setNatureOfBusiness] = useState([]);
  const [otherNatureOfBusiness, setOtherNatureOfBusiness] = useState(otherNatureOfBusinessConstants);
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    if (clientIDParams) {
      fetchClientData();
    }
    fetchLocationData();
    fetchNatureOfBusinessUsingQuery();
  }, [clientIDParams]);

  const fetchNatureOfBusinessUsingQuery = async () => {
    setLoading(true);
    try {
      const natureOfBusinessPayload = {
        SQLQuery: "SELECT DISTINCT NATURE_OF_BUSINESS from CLIENT_MASTER where NATURE_OF_BUSINESS IS NOT NULL AND NATURE_OF_BUSINESS &lt;&gt; '' ORDER BY NATURE_OF_BUSINESS",
      };
      const data = await getDataModelFromQueryService(
        natureOfBusinessPayload,
        userData.currentUserLogin,
        userData.clientURL
      );
      setNatureOfBusiness(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async () => {
    setLoading(true);
    setError({});
    try {
      const locationDataPayload = {
        DataModelName: "COUNTRY_CITIES",
        WhereCondition: "",
        Orderby: "",
      };
      const data = await getDataModelService(
        locationDataPayload,
        userData.currentUserLogin,
        userData.clientURL
      );
      setLocationData(data);
    } catch (error) {
      setError({ fetch: error.message });
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClientData = async () => {
    setLoading(true);
    setError({});
    try {
      const clientDataPayload = {
        DataModelName: "CLIENT_MASTER",
        WhereCondition: `CLIENT_ID = ${clientIDParams}`,
        Orderby: "",
      };

      const data = await getDataModelService(
        clientDataPayload,
        userData.currentUserLogin,
        userData.clientURL
      );
      setCustomerFormData((prev) => ({
        ...prev,
        ...(data?.[0] || {})
      }));
    } catch (error) {
      setError({ fetch: error.message });
      toast({
        variant: "destructive",
        title: `Error fetching client: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateInput = () => {
    const newErrors = {};

    if (!customerFormData.CLIENT_NAME.trim()) {
      newErrors.CLIENT_NAME = "Customer name is required.";
    }

    if (!customerFormData.TELEPHONE_NO.trim()) {
      newErrors.TELEPHONE_NO = "Phone number is required.";
    } else if (!/^\+\d{1,4}\d{7,12}$/.test(customerFormData.TELEPHONE_NO)) {
      newErrors.TELEPHONE_NO = "Phone number must include country code and be valid.";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCustomerFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      console.log("Validation failed", validationErrors);
      return;
    }

    try {
      setLoading(true);
      const convertedDataModel = convertDataModelToStringData("CLIENT_MASTER", customerFormData);
      const clientMasterPayload = {
        userName: userData.currentUserLogin,
        dModelData: convertedDataModel,
      }

      const saveDataServiceResponse = await saveDataService(clientMasterPayload, userData.currentUserLogin, userData.clientURL);

      const match = saveDataServiceResponse.match(/Client ID\s*'(\d+)'/);
      const newClientId = match ? parseInt(match[1], 10) : -1;

      if (newClientId !== -1) {
        setCustomerFormData((prev) => ({
          ...prev,
          CLIENT_ID: newClientId,
        }));
        toast({
          title: saveDataServiceResponse,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.", error,
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">{customerFormData.CLIENT_ID === -1 ? "Create Customer" : "Edit Customer"}</h1>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <Card className="w-full lg:w-[70%] p-4 h-fit">
          <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
            <div className="flex w-full flex-col gap-2 md:flex-row">

              <div className="w-full md:w-1/2">
                <Label htmlFor="CLIENT_NAME">Company / Customer Name</Label>
                <Input
                  id="CLIENT_NAME"
                  name="CLIENT_NAME"
                  type="text"
                  placeholder="Company name / Your name (If you are individual)"
                  value={customerFormData.CLIENT_NAME}
                  onChange={handleInputChange}
                  required
                />
                {error.CLIENT_NAME && <p className="text-sm text-red-500">{error.CLIENT_NAME}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="EMAIL_ADDRESS">Email ID</Label>
                <Input
                  id="EMAIL_ADDRESS"
                  name="EMAIL_ADDRESS"
                  type="email"
                  placeholder="Enter your email ID"
                  value={customerFormData.EMAIL_ADDRESS}
                  onChange={handleInputChange}
                  required
                />
                {error.EMAIL_ADDRESS && <p className="text-sm text-red-500">{error.EMAIL_ADDRESS}</p>}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="mt-3 w-full md:w-1/2">
                <Label className="block text-sm font-medium">Select Nature Of Business <span className="text-gray-500">(Primary)</span> </Label>
                <Popover open={openNatureOfBusiness} onOpenChange={setOpenNatureOfBusiness}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openNatureOfBusiness}
                      className="w-full justify-between text-left gap-2 min-h-10"
                    >
                      {customerFormData.NATURE_OF_BUSINESS
                        ? natureOfBusiness.find(
                          (item) => item.NATURE_OF_BUSINESS === customerFormData.NATURE_OF_BUSINESS
                        )?.NATURE_OF_BUSINESS
                        : "Select nature of business..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command className="w-full justify-start">
                      <CommandInput
                        placeholder="Search nature of business..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No nature of business found.</CommandEmpty>
                        <CommandGroup>
                          {natureOfBusiness.map((item, index) => (
                            <CommandItem
                              key={index}
                              value={item.NATURE_OF_BUSINESS}
                              onSelect={(currentValue) => {
                                setCustomerFormData((prev) => ({
                                  ...prev,
                                  NATURE_OF_BUSINESS:
                                    currentValue === prev.NATURE_OF_BUSINESS
                                      ? ""
                                      : currentValue,
                                }));
                                setOpenNatureOfBusiness(false);
                                setError((prev) => ({
                                  ...prev,
                                  NATURE_OF_BUSINESS: "",
                                }));
                              }}
                            >
                              {item.NATURE_OF_BUSINESS}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  customerFormData.NATURE_OF_BUSINESS === item.NATURE_OF_BUSINESS
                                    ? "opacity-100"
                                    : "opacity-0"
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

              <div className="mt-3 w-full md:w-1/2">
                <Label className="block text-sm font-medium">Select Other Nature Of Business</Label>

                <Popover open={openOtherNatureOfBusiness} onOpenChange={setOpenOtherNatureOfBusiness}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openOtherNatureOfBusiness}
                      className="w-full justify-between text-left gap-2 min-h-10"
                    >
                      {customerFormData.OTHER_NATURE_OF_BUSINESS
                        ? otherNatureOfBusinessConstants.find(
                          (item) => item.value === customerFormData.OTHER_NATURE_OF_BUSINESS
                        )?.label
                        : "Select other nature of business..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command className="w-full justify-start">
                      <CommandInput placeholder="Search other nature of business..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No other nature of business found.</CommandEmpty>
                        <CommandGroup>
                          {otherNatureOfBusinessConstants.map((item) => (
                            <CommandItem
                              key={item.value}
                              value={item.value}
                              onSelect={(currentValue) => {
                                setCustomerFormData((prev) => ({
                                  ...prev,
                                  OTHER_NATURE_OF_BUSINESS:
                                    currentValue === prev.OTHER_NATURE_OF_BUSINESS
                                      ? ""
                                      : currentValue,
                                }));
                                setOpenOtherNatureOfBusiness(false);
                                setError((prev) => ({
                                  ...prev,
                                  OTHER_NATURE_OF_BUSINESS: "",
                                }));
                              }}
                            >
                              {item.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  customerFormData.OTHER_NATURE_OF_BUSINESS === item.value
                                    ? "opacity-100"
                                    : "opacity-0"
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
                <Label htmlFor="TRN_VAT_NO">VAT/GST/TAX No</Label>
                <Input
                  id="TRN_VAT_NO"
                  name="TRN_VAT_NO"
                  type="text"
                  placeholder="Enter VAT/GST/TAX No"
                  value={customerFormData.TRN_VAT_NO}
                  onChange={handleInputChange}
                />
                {error.TRN_VAT_NO && <p className="text-sm text-red-500">{error.TRN_VAT_NO}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="GROUP_NAME">Group of Company</Label>
                <Input
                  id="GROUP_NAME"
                  name="GROUP_NAME"
                  placeholder="Enter Group Name"
                  value={customerFormData.GROUP_NAME}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="w-full md:w-1/2">
                <Label htmlFor="TELEPHONE_NO">Phone<span className="text-xs text-gray-400"> (with country code, e.g., +91XXXXXXXXXX)</span></Label>
                <Input
                  id="TELEPHONE_NO"
                  name="TELEPHONE_NO"
                  type="text"
                  placeholder="e.g. +91XXXXXXXXXX"
                  value={customerFormData.TELEPHONE_NO}
                  onChange={handleInputChange}
                />
                {error.TELEPHONE_NO && <p className="text-sm text-red-500">{error.TELEPHONE_NO}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="WEB_ADDRESS">Website</Label>
                <Input
                  id="WEB_ADDRESS"
                  name="WEB_ADDRESS"
                  type="url"
                  placeholder="Enter your website"
                  value={customerFormData.WEB_ADDRESS}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="mt-3 w-full md:w-1/2">
                <Label className="block text-sm font-medium">Select Contry</Label>

                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCountry}
                      className="w-full justify-between text-left gap-2 min-h-10"
                    >
                      {customerFormData.COUNTRY
                        ? locationData.find((item) => item.COUNTRY === customerFormData.COUNTRY)?.COUNTRY
                        : "Select country..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command className="w-full justify-start">
                      <CommandInput placeholder="Search country..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {locationData.map((location, index) => (
                            <CommandItem
                              key={index}
                              value={location.COUNTRY}
                              onSelect={(currentValue) => {
                                setCustomerFormData((prev) => ({
                                  ...prev,
                                  COUNTRY: currentValue === prev.COUNTRY ? "" : currentValue,
                                }));
                                setOpenCountry(false);
                                setError((prev) => ({
                                  ...prev,
                                  COUNTRY: "",
                                }));
                              }}
                            >
                              {location.COUNTRY}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  customerFormData.COUNTRY === location.COUNTRY
                                    ? "opacity-100"
                                    : "opacity-0"
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

              <div className="w-full md:w-1/2">
                <Label htmlFor="STATE">State</Label>
                <Input
                  id="STATE"
                  name="STATE"
                  type="text"
                  placeholder="Enter City Name"
                  value={customerFormData.STATE}
                  onChange={handleInputChange}
                />
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="CITY_NAME">City</Label>
                <Input
                  id="CITY_NAME"
                  name="CITY_NAME"
                  type="text"
                  placeholder="Enter City Name"
                  value={customerFormData.CITY_NAME}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="w-full md:w-1/2">
                <Label htmlFor="COMMUNICATION_ADDRESS">Communication Address</Label>
                <Textarea
                  id="COMMUNICATION_ADDRESS"
                  name="COMMUNICATION_ADDRESS"
                  type="text"
                  placeholder="Communication Address"
                  value={customerFormData.COMMUNICATION_ADDRESS}
                  onChange={handleInputChange}
                />
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="INVOICE_ADDRESS">Invoice Address</Label>
                <Textarea
                  id="INVOICE_ADDRESS"
                  name="INVOICE_ADDRESS"
                  type="text"
                  placeholder="Invoice Address"
                  value={customerFormData.INVOICE_ADDRESS}
                  onChange={handleInputChange}
                />
                {error.INVOICE_ADDRESS && <p className="text-sm text-red-500">{error.INVOICE_ADDRESS}</p>}
              </div>

              <div className="w-full md:w-1/2">
                <Label htmlFor="DELIVERY_ADDRESS">Delivery Address</Label>
                <Textarea
                  id="DELIVERY_ADDRESS"
                  placeholder="Delivery Address"
                  name="DELIVERY_ADDRESS"
                  type="text"
                  value={customerFormData.DELIVERY_ADDRESS}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-4 w-full flex justify-center items-center" type="submit">
              <Button disabled={loading}>  {loading ?
                <BeatLoader color="#000" size={8} />
                : (customerFormData.CLIENT_ID === -1 ? "Save Customer" : "Update Customer")}</Button>
            </div>
          </form>
        </Card>

        <AddContact clientId={customerFormData.CLIENT_ID} />
      </div>
    </div>
  );
};

export default CustomerCreation;