import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, CircleHelp, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function ProceedToCheckPage() {
  const [activeTab, setActiveTab] = useState("billing");

  const goToNext = () => {
    if (activeTab === "billing") setActiveTab("confirmation");
    else if (activeTab === "confirmation") setActiveTab("recipts");
  };

  const goToPrev = () => {
    if (activeTab === "recipts") setActiveTab("confirmation");
    else if (activeTab === "confirmation") setActiveTab("billing");
  };

  return (
    <>
      {/* <div className="item-center flex flex-col gap-2 lg:flex-row">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of your project"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of your project"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of your project"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Select>
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </div> */}
      <h1 className="mb-8 text-center text-3xl font-bold text-blue-600">CHECKOUT</h1>
      <div>
        <Tabs
          defaultValue="billing"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >

          <TabsList className="grid w-full grid-cols-3  ">
            <TabsTrigger value="billing">Bill / Payment</TabsTrigger>
            <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
            <TabsTrigger value="recipts">Your Recipts</TabsTrigger>
          </TabsList>
          <TabsContent value="billing">
            <div className="flex flex-col gap-2 gap-y-4 lg:flex-row ">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Update your billing information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="w-full space-y-1">
                      <Label htmlFor="firstname">First Name</Label>
                      <Input
                        id="firstname"
                        placeholder="first name"
                        type="text"
                        className="w-full"
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input
                        id="lastname"
                        type="text"
                        placeholder="last name"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="w-full space-y-1">
                      <Label htmlFor="email">Eamil Id</Label>
                      <Input
                        id="email"
                        placeholder="Email Id"
                        type="text"
                        className="w-full"
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="text"
                        placeholder="Phone"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="w-full space-y-1">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        type="text"
                        className="w-full"
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="State"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="w-full space-y-1">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        type="text"
                        className="w-full"
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <Label htmlFor="zipcode">Zip / Postal Code</Label>
                      <Input
                        id="zipcode"
                        type="text"
                        placeholder="Enter Zip Code"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="w-full space-y-1 lg:w-1/2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="address"
                        type="text"
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex w-full flex-col gap-2" >
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle>Payment Method</CardTitle>
                      <Badge
                        variant={"secondary"}
                        className="text-sm"
                      >
                        Add New Payment
                      </Badge>
                    </div>
                    <CardDescription>Update your payment details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem value="item-1">
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
                      <AccordionItem value="item-2">
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
                                <Label htmlFor="cardnumber">Card Type</Label>
                                <Input
                                  id="cardnumber"
                                  placeholder="Card Number"
                                  type="text"
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:flex-row">
                              <div className="w-full space-y-1">
                                <Label htmlFor="cardnumber">Card Number</Label>
                                <Input
                                  id="cardnumber"
                                  placeholder="Card Number"
                                  type="text"
                                  className="w-full"
                                />
                              </div>
                              <div className="w-full space-y-1">
                                <Label htmlFor="cardname">Name Of The Card</Label>
                                <Input
                                  id="cardname"
                                  placeholder="cardname"
                                  type="text"
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:flex-row">
                              <div className="w-full space-y-1">
                                <Label htmlFor="cardnumber">CVV</Label>
                                <Input
                                  id="cardnumber"
                                  placeholder="CVV"
                                  type="text"
                                  className="w-full"
                                />
                              </div>

                              <div className="w-full space-y-1">
                                <Label htmlFor="cardnumber">Expiry Date</Label>
                                <Input
                                  id="cardnumber"
                                  placeholder="Expiry Date"
                                  type="date"
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
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
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Cash On Delevery</AccordionTrigger>
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
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Your Order</CardTitle>
                    <CardDescription>Check your order details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="col-span-2 flex flex-col space-y-4">
                      <Card className="relative flex w-full items-start gap-4 p-4">
                        <button className="absolute right-2 top-2 text-gray-400 hover:text-white">
                          <X size={18} />
                        </button>

                        <div className="h-full w-32 rounded-lg bg-slate-900 p-2 ">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Jeans.jpg"
                            alt="{item.name}"
                            className="h-24 w-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-lg font-semibold">Jean</p>
                          <p className="text-sm text-gray-400">Size: M</p>
                        </div>

                        <div className="mt-14 flex items-end pt-3">
                          <p className="text-3xl font-semibold">₹7891</p>
                        </div>
                      </Card>
                    </div>
                    <Card className="flex w-full flex-col gap-4 p-4">
                      <CardTitle>Order Summary</CardTitle>
                      <div className="space-y-2">
                        <div className="flex w-full items-center justify-between">
                          <p className="text-sm">Subtotal</p>
                          <p className="text-sm font-medium">₹7891</p>
                        </div>

                        <div className="flex w-full items-center justify-between">
                          <p className="text-sm">Discount</p>
                          <p className="text-sm font-medium text-green-600">-₹237</p>
                        </div>

                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <p className="text-sm">Tax</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleHelp size={14} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Tax calculated at 200%</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-sm text-gray-400">₹9898</p>
                        </div>

                        <Separator />

                        <div className="flex w-full items-center justify-between">
                          <p className="text-lg font-semibold">Total</p>
                          <p className="text-lg font-semibold">₹1119</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-2">
                        <Button variant="outline">Save my order</Button>
                      </div>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={goToNext}
                className="gap-2"
              >
                Continue to Confirmation <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="confirmation">
            <Card>
              <CardHeader>
                <CardTitle>Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="w-full space-y-2">
                <div className="flex flex-col sm:space-x-4 lg:flex-row lg:gap-9">
                  <div className="flex w-full flex-col gap-1 space-y-1">
                    <h1 className="mb-4 border-b pb-1 text-lg font-semibold text-gray-600">Billing Address</h1>
                    <p className="text-sm font-semibold text-gray-400">Gopi Vinayak</p>
                    <p className="text-xs font-semibold text-gray-400">123 Address #10</p>
                    <p className="text-xs font-semibold text-gray-400">Phoenix,AZ 85005</p>
                    <p className="text-xs font-semibold text-gray-400">United States Of America</p>
                  </div>
                  <div className="flex w-full flex-col gap-2 space-y-1">
                    <h1 className="mb-4 border-b pb-1 text-lg font-semibold text-gray-600">Payment Details</h1>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-300">Card Type</p>
                      <p className="text-sm font-semibold text-gray-400">Visa</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-300">Card Number</p>
                      <p className="text-sm font-semibold text-gray-400">xxxx-xxxx-xxxx-1234</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-300">Expiration Date</p>
                      <p className="text-sm font-semibold text-gray-400">04-12-2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full flex-col gap-2 space-y-1">
                  <h1 className="border-b text-lg font-semibold text-gray-600">Your Order</h1>

                  <div className="flex justify-between bg-gray-100 p-3">
                    <p className="text-sm font-semibold text-gray-600">SubTotal</p>
                    <p className="text-sm font-semibold text-gray-600">$29.95</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <div className="flex justify-end">
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  onClick={goToPrev}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Billing
                </Button>
                <Button
                  onClick={goToNext}
                  className="gap-2"
                >
                  Confirm & Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="recipts">
            <Card>
              <CardHeader>
                <CardTitle>Your Recipts</CardTitle>
                <CardDescription>Thankyou for shopping with us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col sm:space-x-4 lg:flex-row lg:gap-9">
                  <div className="flex w-full flex-col gap-2 space-y-1">
                    <h1 className="mb-4 border-b pb-1 text-lg font-semibold text-gray-600">Order Summary</h1>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-300">Order</p>
                      <p className="text-sm font-semibold text-gray-400">#155244371</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-300">Date</p>
                      <p className="text-sm font-semibold text-gray-400">Wednesday,October 23 2024</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-300">Card Number</p>
                      <p className="text-sm font-semibold text-gray-400">xxxx-xxxx-xxxx-1234</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-300">Order Total</p>
                      <p className="text-sm font-semibold text-gray-400">$29.95</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 space-y-1">
                    <h1 className="mb-4 border-b pb-1 text-lg font-semibold text-gray-600">Billing Address</h1>
                    <p className="text-sm font-semibold text-gray-400">Gopi Vinayak</p>
                    <p className="text-xs font-semibold text-gray-400">123 Address #10</p>
                    <p className="text-xs font-semibold text-gray-400">Phoenix,AZ 85005</p>
                    <p className="text-xs font-semibold text-gray-400">United States Of America</p>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">
                  <div className="flex w-full flex-col gap-2 space-y-1 pt-4">
                    <h1 className="border-b text-lg font-semibold text-gray-600">Your Order</h1>

                    <div className="flex justify-between bg-gray-100 p-3">
                      <p className="text-sm font-semibold text-gray-600">SubTotal</p>
                      <p className="text-sm font-semibold text-gray-600">$29.95</p>
                    </div>
                  </div>
                  <div className="mt-8 flex w-1/2 flex-col justify-center space-y-1">
                    <p className="leading-0 text-center text-sm font-semibold text-gray-600">Order Total</p>
                    <p className="leading-0 w-full text-center text-7xl font-bold text-green-500">$29.95</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col justify-center gap-2">
                <Button>Save </Button>
              </CardFooter>
            </Card>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={goToPrev}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Confirmation
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
