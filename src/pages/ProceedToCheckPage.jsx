import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ArrowLeft, ArrowRight, ClipboardCheck, CreditCard, Edit, ShoppingCart, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import CartItemImage from "@/components/CartItemImage";
import { formatPrice } from "@/utils/formatPrice";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Country, State, City } from "country-state-city";

export default function ProceedToCheckPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { cart, selectedClient, subtotal, totalItem, discount, deliveryCharge, otherCharges, grandTotal } = location.state || {};

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [activeTab, setActiveTab] = useState("billing");
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(true);
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

  // Initialize state with customer data from cart
  const [billingDetails, setBillingDetails] = useState({
    firstName: selectedClient?.CLIENT_NAME?.split(" ")[0] || "",
    lastName: selectedClient?.CLIENT_NAME?.split(" ").slice(1).join(" ") || "",
    email: userData?.EMAIL_ADDRESS || "",
    phone: selectedClient?.TELEPHONE_NO || "",
    country: selectedClient?.COUNTRY || "",
    state: selectedClient?.STATE_NAME || "",
    city: selectedClient?.CITY_NAME || "",
    zipCode: "",
    address: selectedClient?.INVOICE_ADDRESS || "",
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    ...billingDetails,
  });

  // Fetch current location
  const getCurrentLocation = () => {
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
    );
  };

  // Reverse geocode when location is available
  useEffect(() => {
    if (!currentLocation || isSameAddress) return;

    const fetchAddressFromCoords = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLocation.lat}&lon=${currentLocation.lng}`);
        const data = await response.json();

        if (data.address) {
          const address = data.address;
          setDeliveryDetails((prev) => ({
            ...prev,
            address: `${address.road || ""} ${address.house_number || ""}`.trim(),
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            country: address.country || "",
            zipCode: address.postcode || "",
          }));
        }
      } catch (error) {
        setLocationError("Failed to fetch address details");
      }
    };

    fetchAddressFromCoords();
  }, [currentLocation, isSameAddress]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const allStates = State.getStatesOfCountry(selectedCountry);
      setStates(allStates);
      setCities([]); // Clear cities when country changes
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const allCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(allCities);
    }
  }, [selectedState]);

  // Update delivery details when billing changes and same address is checked
  useEffect(() => {
    if (isSameAddress) {
      setDeliveryDetails({ ...billingDetails });
    }
  }, [billingDetails, isSameAddress]);

  // Calculate order totals
  const taxRate = 0.18;
  const taxableAmount = subtotal - discount;
  const taxAmount = taxableAmount * taxRate;
  const orderTotal = taxableAmount + taxAmount + deliveryCharge + otherCharges;

  // Fixed tab navigation logic
  const goToNext = () => {
    if (activeTab === "billing") setActiveTab("confirmation");
    else if (activeTab === "confirmation") setActiveTab("receipts");
  };

  const goToPrev = () => {
    if (activeTab === "confirmation") setActiveTab("billing");
    else if (activeTab === "receipts") setActiveTab("confirmation");
    else navigate("/cart-page");
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    setIsBillingModalOpen(false);
  };

  const handleBillingChange = (field, value) => {
    setBillingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeliveryChange = (field, value) => {
    setDeliveryDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod((prev) => ({ ...prev, type: method }));
  };

  const handlePlaceOrder = () => {
    // Generate random order ID
    const newOrderId = Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setOrderDate(new Date());
    setActiveTab("receipts");
  };

  // Handle case when user navigates directly without cart data
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart-page", { replace: true });
    }
  }, [cart, navigate]);

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
                            className="mr-2"
                          />{" "}
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Edit Billing Information</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleBillingSubmit}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="firstname">First Name</Label>
                              <Input
                                id="firstname"
                                value={billingDetails.firstName}
                                onChange={(e) => handleBillingChange("firstName", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastname">Last Name</Label>
                              <Input
                                id="lastname"
                                value={billingDetails.lastName}
                                onChange={(e) => handleBillingChange("lastName", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                value={billingDetails.email}
                                onChange={(e) => handleBillingChange("email", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={billingDetails.phone}
                                onChange={(e) => handleBillingChange("phone", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Select
                                value={selectedCountry}
                                onValueChange={(value) => {
                                  setSelectedCountry(value);
                                  handleBillingChange("country", countries.find((c) => c.isoCode === value).name);
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem
                                      key={country.isoCode}
                                      value={country.isoCode}
                                    >
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Select
                                value={selectedState}
                                onValueChange={(value) => {
                                  setSelectedState(value);
                                  handleBillingChange("state", states.find((s) => s.isoCode === value).name);
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
                                      value={state.isoCode}
                                    >
                                      {state.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Select
                                value={billingDetails.city}
                                onValueChange={(value) => handleBillingChange("city", value)}
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
                              <Label htmlFor="zipcode">Zip Code</Label>
                              <Input
                                id="zipcode"
                                value={billingDetails.zipCode}
                                onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="address">Address</Label>
                              <Textarea
                                id="address"
                                value={billingDetails.address}
                                onChange={(e) => handleBillingChange("address", e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsBillingModalOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              onClick={() => setIsBillingModalOpen(false)}
                            >
                              Save
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">
                      {billingDetails.firstName} {billingDetails.lastName}
                    </p>
                    <p>{billingDetails.address}</p>
                    <p>
                      {billingDetails.city}, {billingDetails.state} {billingDetails.zipCode}
                    </p>
                    <p>{billingDetails.country}</p>
                    <p className="pt-2">Phone: {billingDetails.phone}</p>
                    <p>Email: {billingDetails.email}</p>
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
                  <div className="flex items-start space-x-2 pb-4">
                    <Checkbox
                      id="same-address"
                      checked={isSameAddress}
                      onCheckedChange={(val) => setIsSameAddress(val)}
                    />
                    <Label
                      htmlFor="same-address"
                      className="cursor-pointer"
                    >
                      Same as billing address
                    </Label>
                  </div>

                  {!isSameAddress && (
                    <>
                      <div className="mb-4">
                        <Button
                          variant="outline"
                          onClick={getCurrentLocation}
                          disabled={isLocating}
                          className="w-full sm:w-auto"
                        >
                          {isLocating ? "Detecting your location..." : "Use Current Location"}
                        </Button>
                        {locationError && <p className="mt-2 text-sm text-red-500">{locationError}</p>}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="delivery-firstname">First Name</Label>
                          <Input
                            id="delivery-firstname"
                            value={deliveryDetails.firstName}
                            onChange={(e) => handleDeliveryChange("firstName", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery-lastname">Last Name</Label>
                          <Input
                            id="delivery-lastname"
                            value={deliveryDetails.lastName}
                            onChange={(e) => handleDeliveryChange("lastName", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery-phone">Phone</Label>
                          <Input
                            id="delivery-phone"
                            value={deliveryDetails.phone}
                            onChange={(e) => handleDeliveryChange("phone", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery-country">Country</Label>
                          <Input
                            id="delivery-country"
                            value={deliveryDetails.country}
                            onChange={(e) => handleDeliveryChange("country", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery-state">State</Label>
                          <Input
                            id="delivery-state"
                            value={deliveryDetails.state}
                            onChange={(e) => handleDeliveryChange("state", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery-city">City</Label>
                          <Input
                            id="delivery-city"
                            value={deliveryDetails.city}
                            onChange={(e) => handleDeliveryChange("city", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery-zip">Zip Code</Label>
                          <Input
                            id="delivery-zip"
                            value={deliveryDetails.zipCode}
                            onChange={(e) => handleDeliveryChange("zipCode", e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="delivery-address">Address</Label>
                          <Input
                            id="delivery-address"
                            value={deliveryDetails.address}
                            onChange={(e) => handleDeliveryChange("address", e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="delivery-notes">Delivery Instructions</Label>
                          <Textarea
                            id="delivery-notes"
                            placeholder="Gate code, building number, etc."
                            value={deliveryDetails.instructions || ""}
                            onChange={(e) => handleDeliveryChange("instructions", e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {isSameAddress && (
                    <div className="text-sm text-gray-600">
                      <p>Same as billing address</p>
                      <p className="pt-2 italic">No additional details needed</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* PAYMENT METHOD CARD */}
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
                      <span>Subtotal ({totalItem} Items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{formatPrice(deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Other Charges</span>
                      <span>{formatPrice(otherCharges)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(taxAmount)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(orderTotal)}</span>
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
              disabled={!paymentMethod.type}
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
                    <p className="font-medium">
                      {billingDetails.firstName} {billingDetails.lastName}
                    </p>
                    <p>{billingDetails.address}</p>
                    <p>
                      {billingDetails.city}, {billingDetails.state} {billingDetails.zipCode}
                    </p>
                    <p>{billingDetails.country}</p>
                    <p className="pt-2">Phone: {billingDetails.phone}</p>
                    <p>Email: {billingDetails.email}</p>
                  </div>
                </div>

                {/* DELIVERY ADDRESS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Delivery Address</h3>
                  {isSameAddress ? (
                    <div className="text-sm">
                      <p>Same as billing address</p>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <p className="font-medium">
                        {deliveryDetails.firstName} {deliveryDetails.lastName}
                      </p>
                      <p>{deliveryDetails.address}</p>
                      <p>
                        {deliveryDetails.city}, {deliveryDetails.state} {deliveryDetails.zipCode}
                      </p>
                      <p>{deliveryDetails.country}</p>
                      <p className="pt-2">Phone: {deliveryDetails.phone}</p>
                      {deliveryDetails.instructions && <p className="mt-2 italic">Instructions: {deliveryDetails.instructions}</p>}
                    </div>
                  )}
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
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-green-600">-{formatPrice(discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Charges</span>
                      <span>{formatPrice(otherCharges)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(orderTotal)}</span>
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
                    <p>
                      {billingDetails.firstName} {billingDetails.lastName}
                    </p>
                    <p>{billingDetails.address}</p>
                    <p>
                      {billingDetails.city}, {billingDetails.state} {billingDetails.zipCode}
                    </p>
                    <p>{billingDetails.country}</p>
                  </div>
                </div>

                {/* DELIVERY ADDRESS */}
                <div>
                  <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Delivery Address</h3>
                  {isSameAddress ? (
                    <div className="text-sm">
                      <p>Same as billing address</p>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <p>
                        {deliveryDetails.firstName} {deliveryDetails.lastName}
                      </p>
                      <p>{deliveryDetails.address}</p>
                      <p>
                        {deliveryDetails.city}, {deliveryDetails.state} {deliveryDetails.zipCode}
                      </p>
                      <p>{deliveryDetails.country}</p>
                    </div>
                  )}
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
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-green-600">-{formatPrice(discount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{formatPrice(deliveryCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Charges</span>
                      <span>{formatPrice(otherCharges)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>{formatPrice(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(orderTotal)}</span>
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
    </div>
  );
}
