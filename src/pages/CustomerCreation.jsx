import AddContact from "@/components/AddContact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { saveDataService } from "@/services/dataModelService";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const CustomerCreation = () => {
  const { userData } = useAuth();
  const [error, SetError] = useState({});

  const [openNatureOfBusiness, setOpenNatureOfBusiness] = useState(false)
  const [openCountry, setOpenCountry] = useState(false)
  const [openOtherNatureOfBusiness, setOpenOtherNatureOfBusiness] = useState(false)

  const [customerFormData, setCustomerFormData] = useState({
    CLIENT_ID: -1,
    CLIENT_NAME: "",
    emailAddress: "",
    natureOfBusiness: "",
    otherNatureOfBusiness: "",
    trnVatNo: "",
    groupOfCompany: "",
    telephoneNo: "",
    webAddress: "",
    country: "",
    state: "",
    cityName: "",
    communicationAddress: "",
    invoiceAddress: "",
    deliveryAddress: "",
  });

  const validateInput = () => {
    const newErrors = {};

    if (!customerFormData.CLIENT_NAME.trim()) {
      newErrors.CLIENT_NAME = "Customer name is required.";
    }

    if (!customerFormData.telephoneNo.trim()) {
      newErrors.telephoneNo = "Phone number is required.";
    } else if (!/^\+\d{1,4}\d{7,12}$/.test(customerFormData.telephoneNo)) {
      newErrors.telephoneNo = "Phone number must include country code and be valid.";
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCustomerFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    SetError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInput();
    if (Object.keys(validationErrors).length > 0) {
      SetError(validationErrors);
      console.log("Validation failed", validationErrors);
      return;
    }
    console.table(customerFormData);


    try {
      const saveDataServiceResponse = await saveDataService(customerFormData, userData.currentUserLogin, userData.clientURL);
      console.log(saveDataServiceResponse);

    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <Card className="w-full lg:w-[70%]">
          <CardHeader>
            <CardTitle>Add Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-wrap gap-2" onSubmit={handleCustomerSubmit}>
              <div className="flex w-full flex-col gap-2 md:flex-row">

                <div className="w-full md:w-1/2">
                  <Label htmlFor="CLIENT_NAME">Customer / Company Name</Label>
                  <Input
                    id="CLIENT_NAME"
                    name="CLIENT_NAME"
                    type="text"
                    placeholder="Name of your customer / company"
                    value={customerFormData.CLIENT_NAME}
                    onChange={handleInputChange}
                    required
                  />
                  {error.CLIENT_NAME && <p className="text-sm text-red-500">{error.CLIENT_NAME}</p>}
                </div>

                <div className="w-full md:w-1/2">
                  <Label htmlFor="emailAddress">Email ID</Label>
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    placeholder="Enter your email ID"
                    value={customerFormData.emailAddress}
                    onChange={handleInputChange}
                    required
                  />
                  {error.emailAddress && <p className="text-sm text-red-500">{error.emailAddress}</p>}
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 md:flex-row">
                <div className="mt-3 w-full md:w-1/2">
                  <Label className="block text-sm font-medium">Select Nature Of Business</Label>
                  <Popover open={openNatureOfBusiness} onOpenChange={setOpenNatureOfBusiness}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openNatureOfBusiness}
                        className="w-full justify-between text-left gap-2 min-h-10"
                      >
                        {customerFormData.natureOfBusiness
                          ? natureOfBusinessConstants.find(
                            (item) => item.value === customerFormData.natureOfBusiness
                          )?.label
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
                            {natureOfBusinessConstants.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={(currentValue) => {
                                  setCustomerFormData((prev) => ({
                                    ...prev,
                                    natureOfBusiness:
                                      currentValue === prev.natureOfBusiness
                                        ? ""
                                        : currentValue,
                                  }));
                                  setOpenNatureOfBusiness(false);
                                  SetError((prev) => ({
                                    ...prev,
                                    natureOfBusiness: "",
                                  }));
                                }}
                              >
                                {item.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    customerFormData.natureOfBusiness === item.value
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
                        {customerFormData.otherNatureOfBusiness
                          ? otherNatureOfBusinessConstants.find(
                            (item) => item.value === customerFormData.otherNatureOfBusiness
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
                                    otherNatureOfBusiness:
                                      currentValue === prev.otherNatureOfBusiness
                                        ? ""
                                        : currentValue,
                                  }));
                                  setOpenOtherNatureOfBusiness(false);
                                  SetError((prev) => ({
                                    ...prev,
                                    otherNatureOfBusiness: "",
                                  }));
                                }}
                              >
                                {item.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    customerFormData.otherNatureOfBusiness === item.value
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
                  <Label htmlFor="trnVatNo">VAT/GST/TAX No</Label>
                  <Input
                    id="trnVatNo"
                    name="trnVatNo"
                    type="text"
                    placeholder="Enter VAT/GST/TAX No"
                    value={customerFormData.trnVatNo}
                    onChange={handleInputChange}
                  />
                  {error.trnVatNo && <p className="text-sm text-red-500">{error.trnVatNo}</p>}
                </div>

                <div className="w-full md:w-1/2">
                  <Label htmlFor="groupOfCompany">Group of Company</Label>
                  <Input
                    id="groupOfCompany"
                    name="groupOfCompany"
                    placeholder="Enter Group Name"
                    value={customerFormData.groupOfCompany}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 md:flex-row">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="telephoneNo">Phone<span className="text-xs text-gray-400"> (with country code, e.g., +91XXXXXXXXXX)</span></Label>
                  <Input
                    id="telephoneNo"
                    name="telephoneNo"
                    type="text"
                    placeholder="e.g. +91XXXXXXXXXX"
                    value={customerFormData.telephoneNo}
                    onChange={handleInputChange}
                  />
                  {error.telephoneNo && <p className="text-sm text-red-500">{error.telephoneNo}</p>}
                </div>

                <div className="w-full md:w-1/2">
                  <Label htmlFor="webAddress">Website</Label>
                  <Input
                    id="webAddress"
                    name="webAddress"
                    type="url"
                    placeholder="Enter your website"
                    value={customerFormData.webAddress}
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
                        {customerFormData.country
                          ? countryConstants.find((item) => item.value === customerFormData.country)?.label
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
                            {countryConstants.map((country) => (
                              <CommandItem
                                key={country.value}
                                value={country.value}
                                onSelect={(currentValue) => {
                                  setCustomerFormData((prev) => ({
                                    ...prev,
                                    country: currentValue === prev.country ? "" : currentValue,
                                  }));
                                  setOpenCountry(false);
                                  SetError((prev) => ({
                                    ...prev,
                                    country: "",
                                  }));
                                }}
                              >
                                {country.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    customerFormData.country === country.value
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
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Enter City Name"
                    value={customerFormData.state}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <Label htmlFor="cityName">City</Label>
                  <Input
                    id="cityName"
                    name="cityName"
                    type="text"
                    placeholder="Enter City Name"
                    value={customerFormData.cityName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 md:flex-row">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="communicationAddress">Communication Address</Label>
                  <Textarea
                    id="communicationAddress"
                    name="communicationAddress"
                    type="text"
                    placeholder="Communication Address"
                    value={customerFormData.communicationAddress}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <Label htmlFor="invoiceAddress">Invoice Address</Label>
                  <Textarea
                    id="invoiceAddress"
                    name="invoiceAddress"
                    type="text"
                    placeholder="Invoice Address"
                    value={customerFormData.invoiceAddress}
                    onChange={handleInputChange}
                  />
                  {error.invoiceAddress && <p className="text-sm text-red-500">{error.invoiceAddress}</p>}
                </div>

                <div className="w-full md:w-1/2">
                  <Label htmlFor="deliveryAddress">Delivery Address</Label>
                  <Textarea
                    id="deliveryAddress"
                    placeholder="Delivery Address"
                    name="deliveryAddress"
                    type="text"
                    value={customerFormData.deliveryAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-4 w-full flex justify-center items-center" type="submit">
                <Button >Save Customer</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <AddContact />
      </div>
    </div>
  );
};

export default CustomerCreation;
