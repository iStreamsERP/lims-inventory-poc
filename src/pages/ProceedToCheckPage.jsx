import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { callSoapService } from "@/services/callSoapService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { formatPrice } from "@/utils/formatPrice";
import { Checkbox } from "@radix-ui/react-checkbox";
import { City, Country, State } from "country-state-city";
import { ArrowLeft, ArrowRight, ClipboardCheck, CreditCard, Edit, ShoppingCart, Truck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProceedToCheckPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { cart } = location.state || {};
  const newOrderNo = location.state?.newOrderNo || "";

  console.log(cart, newOrderNo);
  

  // Cache refs to prevent unnecessary re-fetches
  const addressesFetched = useRef(false);
  const countriesLoaded = useRef(false);

  // Memoize static data
  const countries = useMemo(() => Country.getAllCountries(), []);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [activeTab, setActiveTab] = useState("billing");
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderDate, setOrderDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState({
    type: "card",
    cardType: "Visa",
    last4: "1234",
    expiry: "04-12-2025",
  });

  // Geolocation states
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [orderForm, setOrderForm] = useState({
    COMPANY_CODE: userData.companyCode,
    BRANCH_CODE: userData.branchCode,
    SALES_ORDER_SERIAL_NO: -1,
    ORDER_NO: newOrderNo || "",
    ORDER_DATE: new Date().toISOString().split("T")[0],
    CLIENT_ID: "",
    CLIENT_NAME: "",
    CLIENT_ADDRESS: "",
    CLIENT_CONTACT: "",
    EMP_NO: userData?.userEmployeeNo || "",
    ORDER_CATEGORY: "",
    TOTAL_VALUE: 0,
    DISCOUNT_VALUE: 10,
    NET_VALUE: 0,
    AMOUNT_IN_WORDS: "",
    CURRENCY_NAME: "Rupees",
    NO_OF_DECIMALS: 0,
    EXCHANGE_RATE: 0,
    ORDER_VALUE_IN_LC: 0,
    MODE_OF_PAYMENT: "Static",
    CREDIT_DAYS: 0,
    ADVANCE_AMOUNT: 0,
    MODE_OF_TRANSPORT: "",
    DELIVERY_DATE: "",
    DELIVERY_ADDRESS: "",
    TERMS_AND_CONDITIONS: "",
    DELETED_STATUS: "F",
    DELETED_DATE: "",
    DELETED_USER: "",
    USER_NAME: userData.userEmail,
    ENT_DATE: "",
    zipCode: "",
    EMAIL_ADDRESS: "",
    COUNTRY: "",
    STATE_NAME: "",
    CITY_NAME: "",
  });

  // Dialog states
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isNewAddressDialogOpen, setIsNewAddressDialogOpen] = useState(false);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [saveToClientMaster, setSaveToClientMaster] = useState(false);
  const [addBillingToClient, setAddBillingToClient] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // New Address Form State
  const [newAddressForm, setNewAddressForm] = useState({
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
  });
  const [saveNewAddressToClient, setSaveNewAddressToClient] = useState(false);
  const [isNewAddressLocating, setIsNewAddressLocating] = useState(false);
  const [newAddressLocationError, setNewAddressLocationError] = useState(null);

  // Memoized calculations to prevent unnecessary re-renders
  const orderTotals = useMemo(() => {
    const subtotal = cart?.reduce((sum, item) => sum + item.finalSaleRate * item.itemQty, 0) || 0;
    const discountValue = orderForm.DISCOUNT_VALUE;
    const taxableAmount = subtotal - discountValue;
    const taxRate = 0.18;
    const taxAmount = taxableAmount * taxRate;
    const orderTotal = taxableAmount + taxAmount;

    return { subtotal, discountValue, taxableAmount, taxAmount, orderTotal };
  }, [cart, orderForm.DISCOUNT_VALUE]);

  // Memoized states based on selected country
  const availableStates = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry);
  }, [selectedCountry]);

  // Memoized cities based on selected state
  const availableCities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState);
  }, [selectedCountry, selectedState]);

  // Optimized fetch functions with caching
  const fetchSalesOrderData = useCallback(async () => {
    if (!newOrderNo) return;

    try {
      const payload = {
        DataModelName: "SALES_ORDER_MASTER",
        WhereCondition: `SALES_ORDER_SERIAL_NO = '${newOrderNo}'`,
        Orderby: "",
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      if (response && response[0]) {
        setOrderForm((prev) => ({ ...prev, ...response[0] }));
      }
    } catch (error) {
      console.error("Error fetching sales order data:", error);
    }
  }, [newOrderNo, userData.clientURL]);

  const fetchPreviousAddresses = useCallback(async () => {
    if (!orderForm.CLIENT_ID || addressesFetched.current) return;

    setIsLoadingAddresses(true);
    try {
      const payload = {
        SQLQuery: `SELECT DELIVERY_ADDRESS FROM CLIENT_MASTER WHERE CLIENT_ID = '${orderForm.CLIENT_ID}' 
                   UNION 
                   SELECT DISTINCT DELIVERY_ADDRESS FROM SALES_ORDER_MASTER WHERE CLIENT_ID = '${orderForm.CLIENT_ID}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      if (Array.isArray(response)) {
        const validAddresses = response.map((item) => item?.DELIVERY_ADDRESS?.trim()).filter((addr) => addr && addr.length > 0);

        setPreviousAddresses([...new Set(validAddresses)]);
        addressesFetched.current = true;
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setPreviousAddresses([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [orderForm.CLIENT_ID, userData.clientURL]);

  // Debounced location fetching
  const fetchAddressFromCoords = useCallback(async () => {
    if (!currentLocation) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLocation.lat}&lon=${currentLocation.lng}`);
      const data = await response.json();

      if (data.address) {
        const address = data.address;
        const deliveryAddress = [
          address.road || "",
          address.house_number || "",
          address.city || address.town || address.village || "",
          address.state || "",
          address.country || "",
          address.postcode || "",
        ]
          .filter(Boolean)
          .join(", ");

        setOrderForm((prev) => ({
          ...prev,
          DELIVERY_ADDRESS: deliveryAddress,
        }));
      }
    } catch (error) {
      setLocationError("Failed to fetch address details");
    }
  }, [currentLocation]);

  // Optimized event handlers
  const handleBillingChange = useCallback((field, value) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNewAddressChange = useCallback((field, value) => {
    setNewAddressForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePaymentMethodChange = useCallback((method) => {
    setPaymentMethod((prev) => ({ ...prev, type: method }));
  }, []);

  // Optimized navigation
  const goToNext = useCallback(() => {
    if (activeTab === "billing") setActiveTab("confirmation");
    else if (activeTab === "confirmation") setActiveTab("receipts");
  }, [activeTab]);

  const goToPrev = useCallback(() => {
    if (activeTab === "confirmation") setActiveTab("billing");
    else if (activeTab === "receipts") setActiveTab("confirmation");
    else navigate("/cart-page");
  }, [activeTab, navigate]);

  // Optimized location handler
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        setLocationError("Unable to retrieve your location: " + error.message);
      },
      { timeout: 10000, enableHighAccuracy: false }, // Optimize geolocation options
    );
  }, []);

  // Effects with proper dependencies
  useEffect(() => {
    fetchSalesOrderData();
  }, [fetchSalesOrderData]);

  useEffect(() => {
    fetchPreviousAddresses();
  }, [fetchPreviousAddresses]);

  useEffect(() => {
    fetchAddressFromCoords();
  }, [fetchAddressFromCoords]);

  // Optimized state updates
  useEffect(() => {
    if (selectedCountry && availableStates.length > 0) {
      setStates(availableStates);
      setCities([]);
      setSelectedState("");
    }
  }, [selectedCountry, availableStates]);

  useEffect(() => {
    if (selectedState && availableCities.length > 0) {
      setCities(availableCities);
    }
  }, [selectedState, availableCities]);

  // Update order totals when cart changes (optimized)
  useEffect(() => {
    if (cart && cart.length > 0) {
      const total = orderTotals.subtotal;
      setOrderForm((prev) => ({
        ...prev,
        TOTAL_VALUE: total,
        NET_VALUE: total - prev.DISCOUNT_VALUE,
      }));
    }
  }, [cart, orderTotals.subtotal]);

  // Optimized form submission
  const handleBillingSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const payload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", orderForm),
      };

      try {
        const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
        console.log(response);
      } catch (error) {
        console.error("Failed to save billing details:", error);
      }

      setIsBillingModalOpen(false);
    },
    [orderForm, userData.userEmail, userData.clientURL],
  );

  const handlePlaceOrder = useCallback(async () => {
    if (saveToClientMaster && orderForm.CLIENT_ID) {
      try {
        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("CLIENT_MASTER", {
            ...orderForm,
            DELIVERY_ADDRESS: orderForm.DELIVERY_ADDRESS,
          }),
        };
        await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
      } catch (error) {
        console.error("Failed to save delivery address:", error);
      }
    }

    const newOrderId = Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setOrderDate(new Date());
    setActiveTab("receipts");
  }, [saveToClientMaster, orderForm, userData.userEmail, userData.clientURL]);

  const handleAddressSelect = useCallback(() => {
    if (selectedAddress) {
      setOrderForm((prev) => ({
        ...prev,
        DELIVERY_ADDRESS: selectedAddress,
      }));
    }
    setIsDeliveryDialogOpen(false);
  }, [selectedAddress]);

  // Optimized new address location handler
  const getCurrentLocationForNewAddress = useCallback(() => {
    if (!navigator.geolocation) {
      setNewAddressLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsNewAddressLocating(true);
    setNewAddressLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          if (data.address) {
            const addr = data.address;
            const country = countries.find((c) => c.isoCode === (addr.country_code ? addr.country_code.toUpperCase() : ""));
            const state = country ? State.getStatesOfCountry(country.isoCode).find((s) => s.name === addr.state || s.isoCode === addr.state) : null;
            const city = addr.city || addr.town || addr.village || addr.county;

            const fullAddress = [addr.road || "", addr.house_number || "", city, addr.state, country?.name || addr.country, addr.postcode || ""]
              .filter(Boolean)
              .join(", ");

            setNewAddressForm((prev) => ({
              ...prev,
              address: fullAddress,
              country: country?.name || "",
              state: state?.name || "",
              city: city || "",
              zipCode: addr.postcode || "",
            }));
          }
        } catch (error) {
          setNewAddressLocationError("Failed to fetch address details");
        } finally {
          setIsNewAddressLocating(false);
        }
      },
      (error) => {
        setIsNewAddressLocating(false);
        setNewAddressLocationError("Unable to retrieve your location: " + error.message);
      },
      { timeout: 10000, enableHighAccuracy: false },
    );
  }, [countries]);

  const handleSaveNewAddress = useCallback(async () => {
    setOrderForm((prev) => ({
      ...prev,
      DELIVERY_ADDRESS: newAddressForm.address,
    }));

    try {
      const salesOrderPayload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", {
          ...orderForm,
          DELIVERY_ADDRESS: newAddressForm.address,
        }),
      };

      await callSoapService(userData.clientURL, "DataModel_SaveData", salesOrderPayload);
    } catch (error) {
      console.error("Failed to save to SALES_ORDER_MASTER:", error);
    }

    if (saveNewAddressToClient && orderForm.CLIENT_ID) {
      try {
        const clientPayload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("CLIENT_MASTER", {
            ...orderForm,
            DELIVERY_ADDRESS: newAddressForm.address,
          }),
        };
        await callSoapService(userData.clientURL, "DataModel_SaveData", clientPayload);
      } catch (error) {
        console.error("Failed to save to CLIENT_MASTER:", error);
      }
    }

    // Reset cache and refetch
    addressesFetched.current = false;
    fetchPreviousAddresses();

    setIsNewAddressDialogOpen(false);
    setNewAddressForm({
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
    });
  }, [newAddressForm, userData.userEmail, userData.clientURL, orderForm, saveNewAddressToClient, fetchPreviousAddresses]);

  // Memoized validation
  const canProceedFromBilling = useMemo(() => {
    return paymentMethod.type && orderForm.DELIVERY_ADDRESS;
  }, [paymentMethod.type, orderForm.DELIVERY_ADDRESS]);

  return (
    <div className="mx-auto max-w-7xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="billing"
            className="flex items-center gap-2"
          >
            <CreditCard size={16} /> Bill & Payment
          </TabsTrigger>
          <TabsTrigger
            value="confirmation"
            className="flex items-center gap-2"
          >
            <ClipboardCheck size={16} /> Confirmation
          </TabsTrigger>
          <TabsTrigger
            value="receipts"
            className="flex items-center gap-2"
          >
            <ShoppingCart size={16} /> Your Receipt
          </TabsTrigger>
        </TabsList>

        {/* Rest of your JSX remains the same, just replace the calculations with memoized values */}
        {/* For example, replace subtotal with orderTotals.subtotal, etc. */}

        {/* BILLING TAB */}
        <TabsContent value="billing">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* LEFT COLUMN - ADDRESSES */}
            <div className="flex-1 space-y-4">
              {/* BILLING ADDRESS CARD */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Billing Information</CardTitle>
                    <Dialog
                      open={isBillingModalOpen}
                      onOpenChange={setIsBillingModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit
                            size={16}
                            className="mr-1"
                          />{" "}
                          Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80%] overflow-y-auto sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Edit Billing Information</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleBillingSubmit}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="CLIENT_NAME">Client Name</Label>
                              <Input
                                id="CLIENT_NAME"
                                value={orderForm.CLIENT_NAME}
                                onChange={(e) => handleBillingChange("CLIENT_NAME", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="EMAIL_ADDRESS">Email</Label>
                              <Input
                                id="EMAIL_ADDRESS"
                                value={orderForm.EMAIL_ADDRESS}
                                onChange={(e) => handleBillingChange("EMAIL_ADDRESS", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="CLIENT_CONTACT">Phone</Label>
                              <Input
                                id="CLIENT_CONTACT"
                                value={orderForm.CLIENT_CONTACT}
                                onChange={(e) => handleBillingChange("CLIENT_CONTACT", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="COUNTRY">Country</Label>
                              <Select
                                value={orderForm.COUNTRY}
                                onValueChange={(value) => {
                                  const countryObj = countries.find((c) => c.name === value);
                                  if (countryObj) {
                                    setSelectedCountry(countryObj.isoCode);
                                  }
                                  handleBillingChange("COUNTRY", value);
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem
                                      key={country.isoCode}
                                      value={country.name}
                                    >
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="STATE_NAME">State</Label>
                              <Select
                                value={orderForm.STATE_NAME}
                                onValueChange={(value) => {
                                  const stateObj = states.find((s) => s.name === value);
                                  if (stateObj) {
                                    setSelectedState(stateObj.isoCode);
                                  }
                                  handleBillingChange("STATE_NAME", value);
                                }}
                                disabled={!selectedCountry}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                  {states.map((state) => (
                                    <SelectItem
                                      key={state.isoCode}
                                      value={state.name}
                                    >
                                      {state.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="CITY_NAME">City</Label>
                              <Select
                                value={orderForm.CITY_NAME}
                                onValueChange={(value) => handleBillingChange("CITY_NAME", value)}
                                disabled={!selectedState}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                  {cities.map((city, index) => (
                                    <SelectItem
                                      key={index}
                                      value={city.name}
                                    >
                                      {city.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="zipCode">Zip Code</Label>
                              <Input
                                id="zipCode"
                                value={orderForm?.zipCode}
                                onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="CLIENT_ADDRESS">Address</Label>
                              <Textarea
                                id="CLIENT_ADDRESS"
                                value={orderForm.CLIENT_ADDRESS}
                                onChange={(e) => handleBillingChange("CLIENT_ADDRESS", e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>

                          {/* ADD TO CLIENT MASTER CHECKBOX */}
                          <div className="flex items-center space-x-2 pt-4">
                            <Checkbox
                              id="add-to-client"
                              checked={addBillingToClient}
                              onCheckedChange={(checked) => setAddBillingToClient(checked)}
                            />
                            <Label htmlFor="add-to-client">Add to Client Master</Label>
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsBillingModalOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{orderForm.CLIENT_NAME}</p>
                    <p>{orderForm.CLIENT_ADDRESS}</p>
                    <p>
                      {orderForm.CITY_NAME}, {orderForm.STATE_NAME} {orderForm?.zipCode}
                    </p>
                    <p>{orderForm.COUNTRY}</p>
                    <p className="pt-2">Phone: {orderForm.CLIENT_CONTACT}</p>
                    <p>Email: {orderForm.EMAIL_ADDRESS}</p>
                  </div>
                </CardContent>
              </Card>

              {/* DELIVERY ADDRESS CARD */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Truck size={18} /> Delivery Information
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Previous Addresses Section */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-medium">Previous Delivery Addresses</h4>
                    {isLoadingAddresses ? (
                      <p className="text-sm text-gray-500">Loading addresses...</p>
                    ) : previousAddresses.length > 0 ? (
                      <div className="space-y-3">
                        {previousAddresses.map((address, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded border p-3"
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id={`address-${index}`}
                                name="delivery-address"
                                checked={selectedAddress === address}
                                onChange={() => setSelectedAddress(address)}
                                className="mr-3 h-4 w-4"
                              />
                              <label
                                htmlFor={`address-${index}`}
                                className="text-sm"
                              >
                                {address}
                              </label>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAddress(address);
                                setOrderForm((prev) => ({ ...prev, DELIVERY_ADDRESS: address }));
                              }}
                            >
                              Deliver Here
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No previous addresses found</p>
                    )}
                  </div>

                  {/* Add New Address Button */}
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsNewAddressDialogOpen(true)}
                    >
                      Add New Address
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PAYMENT METHOD CARD*/}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>Payment Method</CardTitle>
                  </div>
                  <CardDescription>Select your payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    value={paymentMethod.type}
                    onValueChange={handlePaymentMethodChange}
                  >
                    <AccordionItem value="wallet">
                      <AccordionTrigger>Phonepay / Wallet</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <Label htmlFor="wallet">Select Wallet</Label>
                          <Select>
                            <SelectTrigger
                              id="wallet"
                              className="w-full"
                            >
                              <SelectValue placeholder="Choose a Wallet" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phonepe">PhonePe</SelectItem>
                              <SelectItem value="gpay">Google Pay</SelectItem>
                              <SelectItem value="paytm">Paytm</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="space-y-1">
                            <Label htmlFor="upi">Enter UPI ID</Label>
                            <Input
                              id="upi"
                              placeholder="e.g. username@upi"
                              type="text"
                            />
                          </div>

                          <Button className="mt-2 w-full">Verify & Pay</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="card">
                      <AccordionTrigger>Credit / Debit / Atm Card</AccordionTrigger>
                      <AccordionContent className="mb-2 p-2">
                        <h1 className="mb-3 text-sm font-semibold">Details</h1>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="w-full space-y-1">
                              <Label htmlFor="cardholdername">Cardholder Name</Label>
                              <Input
                                id="cardholdername"
                                placeholder="Cardholder Name"
                                type="text"
                                className="w-full"
                              />
                            </div>
                            <div className="w-full space-y-1">
                              <Label htmlFor="cardtype">Card Type</Label>
                              <Select
                                value={paymentMethod.cardType}
                                onValueChange={(value) => setPaymentMethod((prev) => ({ ...prev, cardType: value }))}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Card Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Visa">Visa</SelectItem>
                                  <SelectItem value="MasterCard">MasterCard</SelectItem>
                                  <SelectItem value="Amex">American Express</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="w-full space-y-1">
                              <Label htmlFor="cardnumber">Card Number</Label>
                              <Input
                                id="cardnumber"
                                placeholder="1234 5678 9012 3456"
                                type="text"
                                className="w-full"
                              />
                            </div>
                            <div className="w-full space-y-1">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                type="text"
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="w-full space-y-1">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                type="text"
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="netbanking">
                      <AccordionTrigger>Net Banking</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <Label htmlFor="bank">Select Your Bank</Label>
                          <Select>
                            <SelectTrigger
                              id="bank"
                              className="w-full"
                            >
                              <SelectValue placeholder="Choose a Bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sbi">State Bank of India</SelectItem>
                              <SelectItem value="hdfc">HDFC Bank</SelectItem>
                              <SelectItem value="icici">ICICI Bank</SelectItem>
                              <SelectItem value="axis">Axis Bank</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button className="w-full">Proceed to Net Banking</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="cod">
                      <AccordionTrigger>Cash On Delivery</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Checkbox id="cod-confirm" />
                            <Label
                              htmlFor="cod-confirm"
                              className="text-sm"
                            >
                              I confirm that I will pay the exact amount at the time of delivery.
                            </Label>
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="E.g. Please call before delivery, keep change ready, etc."
                            />
                          </div>

                          <Button className="mt-2 w-full">Confirm COD Order</Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN - PAYMENT & ORDER SUMMARY */}
            <div className="flex-1 space-y-4">
              {/* ORDER SUMMARY CARD */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart?.length || 0} Items)</span>
                      <span>{formatPrice(orderTotals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Discount</span>
                      <span>-{formatPrice(orderTotals.discountValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(orderTotals.taxAmount)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(orderTotals.orderTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrev}
            >
              Back to Cart
            </Button>
            <Button
              onClick={goToNext}
              className="gap-2"
              disabled={!paymentMethod.type || !orderForm.DELIVERY_ADDRESS}
            >
              Continue to Confirmation <ArrowRight size={16} />
            </Button>
          </div>
        </TabsContent>

        {/* CONFIRMATION TAB */}
        <TabsContent value="confirmation">
          <Card>
            <CardHeader>
              <CardTitle>Order Confirmation</CardTitle>
              <CardDescription>Review your details before payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* BILLING ADDRESS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Billing Address</h3>
                  <div className="text-sm">
                    <p className="font-medium">{orderForm.CLIENT_NAME}</p>
                    <p>{orderForm.CLIENT_ADDRESS}</p>
                    <p>
                      {orderForm.CITY_NAME}, {orderForm.STATE_NAME} {orderForm?.zipCode}
                    </p>
                    <p>{orderForm.COUNTRY}</p>
                    <p className="pt-2">Phone: {orderForm.CLIENT_CONTACT}</p>
                    <p>Email: {orderForm.EMAIL_ADDRESS}</p>
                  </div>
                </div>

                {/* DELIVERY ADDRESS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Delivery Address</h3>
                  <div className="text-sm">
                    <p>{orderForm.DELIVERY_ADDRESS}</p>
                  </div>
                </div>

                {/* PAYMENT DETAILS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Payment Details</h3>
                  <div className="text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Method:</span>
                      <span className="capitalize">
                        {paymentMethod.type === "card"
                          ? `${paymentMethod.cardType} Card`
                          : paymentMethod.type === "wallet"
                            ? "Digital Wallet"
                            : paymentMethod.type === "netbanking"
                              ? "Net Banking"
                              : "Cash on Delivery"}
                      </span>
                    </div>
                    {paymentMethod.type === "card" && (
                      <>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Card:</span>
                          <span>•••• •••• •••• 1234</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Expiry:</span>
                          <span>04/25</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-yellow-600">Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
                <div className="rounded-lg border text-sm">
                  <div className="max-h-[300px] overflow-y-auto p-4">
                    {cart?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between border-b py-2 last:border-0"
                      >
                        <span>
                          {item.itemName || item.ITEM_NAME} × {item.itemQty}
                        </span>
                        <span className="font-medium">{formatPrice(item.finalSaleRate * item.itemQty)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 p-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderTotals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-green-600">-{formatPrice(orderTotals.discountValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(orderTotals.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(orderTotals.orderTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 md:w-auto"
                onClick={handlePlaceOrder}
              >
                Confirm & Pay Now
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrev}
              className="gap-2"
            >
              <ArrowLeft size={16} /> Back to Billing
            </Button>
            <Button
              onClick={goToNext}
              className="gap-2"
              disabled={!orderId}
            >
              Continue to Receipt <ArrowRight size={16} />
            </Button>
          </div>
        </TabsContent>

        {/* RECEIPTS TAB */}
        <TabsContent value="receipts">
          <Card>
            <CardHeader className="bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-green-800">Order Confirmed!</CardTitle>
                  <CardDescription>Thank you for your purchase</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* ORDER DETAILS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span>#{orderId || "155244371"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{orderDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-green-600">Completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="capitalize">
                        {paymentMethod.type === "card"
                          ? `${paymentMethod.cardType} Card`
                          : paymentMethod.type === "wallet"
                            ? "Digital Wallet"
                            : paymentMethod.type === "netbanking"
                              ? "Net Banking"
                              : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BILLING ADDRESS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Billing Address</h3>
                  <div className="text-sm">
                    <p>{orderForm?.CLIENT_NAME}</p>
                    <p>{orderForm?.CLIENT_ADDRESS}</p>
                    <p>
                      {orderForm?.CITY_NAME}, {orderForm?.STATE_NAME} {orderForm?.zipCode}
                    </p>
                    <p>{orderForm?.COUNTRY}</p>
                  </div>
                </div>

                {/* DELIVERY ADDRESS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Delivery Address</h3>
                  <div className="text-sm">
                    <p>{orderForm?.DELIVERY_ADDRESS}</p>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="mt-8 overflow-hidden rounded-lg border">
                <div className="border-b bg-gray-50 p-4">
                  <h3 className="font-semibold">Order Summary</h3>
                </div>
                <div className="p-4 text-sm">
                  <div className="flex justify-between border-b py-2 font-medium">
                    <span>Product</span>
                    <span>Total</span>
                  </div>

                  {cart?.map((item, idx) => (
                    <div
                      key={idx}
                      className="border-b py-4"
                    >
                      <div className="flex justify-between">
                        <span>
                          {item.itemName || item.ITEM_NAME} × {item.itemQty}
                        </span>
                        <span>{formatPrice(item.finalSaleRate * item.itemQty)}</span>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderTotals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-green-600">-{formatPrice(orderTotals.discountValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(orderTotals.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(orderTotals.orderTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button variant="outline">Download Invoice</Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/categories")}
                >
                  Continue Shopping
                </Button>
                <Button>Track Order</Button>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-4 flex justify-start">
            <Button
              variant="outline"
              onClick={goToPrev}
              className="gap-2"
            >
              <ArrowLeft size={16} /> Back to Confirmation
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* DELIVERY ADDRESS POPUP */}
      <Dialog
        open={isDeliveryDialogOpen}
        onOpenChange={setIsDeliveryDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Delivery Address</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto">
              {isLoadingAddresses ? (
                <p className="text-center text-gray-500">Loading addresses...</p>
              ) : previousAddresses.length > 0 ? (
                <div className="space-y-2">
                  {previousAddresses.map((address, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2"
                    >
                      <input
                        type="radio"
                        id={`address-${index}`}
                        name="delivery-address"
                        value={address}
                        checked={selectedAddress === address}
                        onChange={() => setSelectedAddress(address)}
                        className="mt-1"
                      />
                      <Label
                        htmlFor={`address-${index}`}
                        className="block"
                      >
                        {address}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No previous addresses found</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-to-client"
                checked={saveToClientMaster}
                onCheckedChange={(checked) => setSaveToClientMaster(checked)}
              />
              <Label htmlFor="save-to-client">Save to Client Master</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeliveryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddressSelect}
              disabled={!selectedAddress}
            >
              Select Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NEW ADDRESS POPUP */}
      <Dialog
        open={isNewAddressDialogOpen}
        onOpenChange={setIsNewAddressDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Delivery Address</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="new-address">Address</Label>
              <Textarea
                id="new-address"
                value={newAddressForm.address}
                onChange={(e) => handleNewAddressChange("address", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="new-country">Country</Label>
                <Select
                  value={newAddressForm.country}
                  onValueChange={(value) => {
                    handleNewAddressChange("country", value);
                    handleNewAddressChange("state", "");
                    handleNewAddressChange("city", "");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.isoCode}
                        value={country.name}
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-state">State</Label>
                <Select
                  value={newAddressForm.state}
                  onValueChange={(value) => {
                    handleNewAddressChange("state", value);
                    handleNewAddressChange("city", "");
                  }}
                  disabled={!newAddressForm.country}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAddressForm.country &&
                      State.getStatesOfCountry(countries.find((c) => c.name === newAddressForm.country)?.isoCode).map((state) => (
                        <SelectItem
                          key={state.isoCode}
                          value={state.name}
                        >
                          {state.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-city">City</Label>
                <Select
                  value={newAddressForm.city}
                  onValueChange={(value) => handleNewAddressChange("city", value)}
                  disabled={!newAddressForm.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAddressForm.country &&
                      newAddressForm.state &&
                      City.getCitiesOfState(
                        countries.find((c) => c.name === newAddressForm.country).isoCode,
                        State.getStatesOfCountry(countries.find((c) => c.name === newAddressForm.country).isoCode).find(
                          (s) => s.name === newAddressForm.state,
                        )?.isoCode,
                      ).map((city) => (
                        <SelectItem
                          key={city.name}
                          value={city.name}
                        >
                          {city.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-zip">Zip Code</Label>
                <Input
                  id="new-zip"
                  value={newAddressForm.zipCode}
                  onChange={(e) => handleNewAddressChange("zipCode", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={getCurrentLocationForNewAddress}
                disabled={isNewAddressLocating}
              >
                {isNewAddressLocating ? "Detecting Location..." : "Use Current Location"}
              </Button>
              {newAddressLocationError && <p className="mt-2 text-sm text-red-500">{newAddressLocationError}</p>}
            </div>

            {orderForm.CLIENT_ID && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-new-address"
                  checked={saveNewAddressToClient}
                  onCheckedChange={(checked) => setSaveNewAddressToClient(checked)}
                />
                <Label htmlFor="save-new-address">Save to Client Master</Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewAddressDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewAddress}
              disabled={!newAddressForm.address}
            >
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
