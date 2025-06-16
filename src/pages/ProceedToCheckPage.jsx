import { useLocation, useNavigate } from "react-router-dom";
import { Accordion } from "@/components/ui/accordion";
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

export default function ProceedToCheckPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { cart, selectedClient, subtotal, totalItem, discount } = location.state || {};

  const [activeTab, setActiveTab] = useState("billing");
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(true);

  // Initialize state with customer data from cart
  const [billingDetails, setBillingDetails] = useState({
    firstName: selectedClient?.CLIENT_NAME?.split(" ")[0] || "",
    lastName: selectedClient?.CLIENT_NAME?.split(" ").slice(1).join(" ") || "",
    email: userData?.userEmail || "",
    phone: selectedClient?.TELEPHONE_NO || "",
    country: selectedClient?.COUNTRY || "",
    state: selectedClient?.STATE || "",
    city: selectedClient?.CITY_NAME || "",
    zipCode: "",
    address: "",
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    ...billingDetails,
  });

  const [paymentMethod, setPaymentMethod] = useState({
    type: "card",
    cardType: "Visa",
    last4: "1234",
    expiry: "04-12-2025",
  });

  // Calculate order totals
  const shippingCharge = 40;
  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const orderTotal = subtotal - discount + shippingCharge + taxAmount;

  // Fixed tab navigation logic
  const goToNext = () => {
    if (activeTab === "billing") setActiveTab("confirmation");
    else if (activeTab === "confirmation") setActiveTab("receipts");
  };

  const goToPrev = () => {
    if (activeTab === "confirmation") setActiveTab("billing");
    else if (activeTab === "receipts") setActiveTab("confirmation");
    else navigate("/cart-page"); // Explicitly go to cart page
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would update state with form values
    setIsBillingModalOpen(false);
  };

  const handleDeliveryChange = (field, value) => {
    setDeliveryDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Handle case when user navigates directly without cart data
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart-page", { replace: true });
    }
  }, [cart, navigate]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Tabs
        value={activeTab}
        className="w-full"
      >
        {/* Disabled tab navigation - visual indicators only */}
        <TabsList className="pointer-events-none grid w-full grid-cols-3">
          <TabsTrigger
            value="billing"
            className="flex items-center gap-2"
            data-state={activeTab === "billing" ? "active" : "inactive"}
          >
            <CreditCard size={16} /> Bill & Payment
          </TabsTrigger>
          <TabsTrigger
            value="confirmation"
            className="flex items-center gap-2"
            data-state={activeTab === "confirmation" ? "active" : "inactive"}
          >
            <ClipboardCheck size={16} /> Confirmation
          </TabsTrigger>
          <TabsTrigger
            value="receipts"
            className="flex items-center gap-2"
            data-state={activeTab === "receipts" ? "active" : "inactive"}
          >
            <ShoppingCart size={16} /> Your Receipt
          </TabsTrigger>
        </TabsList>

        {/* BILLING TAB */}
        <TabsContent value="billing">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* LEFT COLUMN - ADDRESSES */}
            <div className="flex-1 space-y-6">
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
                          className="space-y-4 py-4"
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="firstname">First Name</Label>
                              <Input
                                id="firstname"
                                defaultValue={billingDetails.firstName}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastname">Last Name</Label>
                              <Input
                                id="lastname"
                                defaultValue={billingDetails.lastName}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                defaultValue={billingDetails.email}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                defaultValue={billingDetails.phone}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Input
                                id="country"
                                defaultValue={billingDetails.country}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Input
                                id="state"
                                defaultValue={billingDetails.state}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                defaultValue={billingDetails.city}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipcode">Zip Code</Label>
                              <Input
                                id="zipcode"
                                defaultValue={billingDetails.zipCode}
                                className="w-full"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                defaultValue={billingDetails.address}
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
                            <Button type="submit">Save Changes</Button>
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
                  )}

                  {isSameAddress && (
                    <div className="text-sm text-gray-600">
                      <p>Same as billing address</p>
                      <p className="pt-2 italic">No additional details needed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN - PAYMENT & ORDER SUMMARY */}
            <div className="flex-1 space-y-6">
              {/* PAYMENT METHOD CARD */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>Payment Method</CardTitle>
                    <Badge
                      variant="secondary"
                      className="text-sm"
                    >
                      Add New Payment
                    </Badge>
                  </div>
                  <CardDescription>Update your payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                  >
                    {/* Payment options - same as before */}
                  </Accordion>
                </CardContent>
              </Card>

              {/* ORDER SUMMARY CARD */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
                    {cart?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
                            <CartItemImage
                              itemCode={item.itemCode}
                              subProductNo={item.subProductNo}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.itemName || item.ITEM_NAME}</p>
                            <p className="text-sm text-gray-500">Qty: {item.itemQty}</p>
                          </div>
                        </div>
                        <div className="font-semibold">{formatPrice(item.finalSaleRate * item.itemQty)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
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
                      <span>{formatPrice(shippingCharge)}</span>
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
                      <span>
                        {paymentMethod.cardType} ending in {paymentMethod.last4}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Expiry:</span>
                      <span>{paymentMethod.expiry}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-green-600">Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
                <div className="rounded-lg border text-lg">
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

                  <div className="space-y-2 bg-gray-50 p-4">
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
                      <span>{formatPrice(shippingCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
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
              <Button className="w-full bg-green-600 hover:bg-green-700 md:w-auto">Confirm & Pay Now</Button>
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
                      <span>#155244371</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-green-600">Completed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span>
                        {paymentMethod.cardType} •••• {paymentMethod.last4}
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
                <div className="p-4">
                  <div className="flex justify-between border-b py-2">
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
                      <span>{formatPrice(shippingCharge)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
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
