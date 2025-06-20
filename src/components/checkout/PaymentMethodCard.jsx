import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function PaymentMethodCard({ paymentMethod, setPaymentMethod }) {
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(prev => ({ ...prev, type: method }));
  };

  return (
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
                  <SelectTrigger id="wallet" className="w-full">
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
                  <Input id="upi" placeholder="e.g. username@upi" type="text" />
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
                    <Input id="cardholdername" placeholder="Cardholder Name" type="text" className="w-full" />
                  </div>
                  <div className="w-full space-y-1">
                    <Label htmlFor="cardtype">Card Type</Label>
                    <Select
                      value={paymentMethod.cardType}
                      onValueChange={value => setPaymentMethod(prev => ({ ...prev, cardType: value }))}
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
                    <Input id="cardnumber" placeholder="1234 5678 9012 3456" type="text" className="w-full" />
                  </div>
                  <div className="w-full space-y-1">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="text" className="w-full" />
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:flex-row">
                  <div className="w-full space-y-1">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" type="text" className="w-full" />
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
                  <SelectTrigger id="bank" className="w-full">
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
                  <Label htmlFor="cod-confirm" className="text-sm">
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
  );
}