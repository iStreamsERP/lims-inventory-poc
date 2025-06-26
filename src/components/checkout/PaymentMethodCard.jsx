import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function PaymentMethodCard({ paymentMethod, setPaymentMethod, initiateMockPayment, isProcessingPayment }) {
  const [selectedWallet, setSelectedWallet] = useState("");
  const [phonePeUPI, setPhonePeUPI] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handlePayment = () => {
    if (paymentMethod.type === "wallet" && !phonePeUPI) {
      alert("Please enter your UPI ID");
      return;
    }
    initiateMockPayment();
  };

  const handleCardChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Choose your preferred payment option</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={paymentMethod.type}
          onValueChange={(type) => setPaymentMethod(prev => ({ ...prev, type }))}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
            <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
          </TabsList>

          {/* Wallet */}
          <TabsContent
            value="wallet"
            className="space-y-4"
          >
            <Label>Select Wallet</Label>
            <Select onValueChange={setSelectedWallet}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a Wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phonepe">PhonePe</SelectItem>
                <SelectItem value="gpay">Google Pay</SelectItem>
                <SelectItem value="paytm">Paytm</SelectItem>
              </SelectContent>
            </Select>
            {selectedWallet === "phonepe" && (
              <>
                <Label>PhonePe UPI ID</Label>
                <Input
                  placeholder="e.g. username@ybl"
                  value={phonePeUPI}
                  onChange={(e) => setPhonePeUPI(e.target.value)}
                />
              </>
            )}
            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay with ${selectedWallet || 'Wallet'}`
              )}
            </Button>
          </TabsContent>

          {/* Card */}
          <TabsContent
            value="card"
            className="space-y-4"
          >
            <Label>Cardholder Name</Label>
            <Input 
              placeholder="Cardholder Name" 
              value={cardDetails.cardName}
              onChange={(e) => handleCardChange('cardName', e.target.value)}
            />

            <Label>Card Type</Label>
            <Select
              value={paymentMethod.cardType}
              onValueChange={(value) => setPaymentMethod(prev => ({ ...prev, cardType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Card Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="MasterCard">MasterCard</SelectItem>
                <SelectItem value="Amex">American Express</SelectItem>
              </SelectContent>
            </Select>

            <Label>Card Number</Label>
            <Input 
              placeholder="1234 5678 9012 3456" 
              value={cardDetails.cardNumber}
              onChange={(e) => handleCardChange('cardNumber', e.target.value)}
            />

            <div className="flex gap-4">
              <div className="w-full">
                <Label>CVV</Label>
                <Input 
                  placeholder="123" 
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardChange('cvv', e.target.value)}
                />
              </div>
              <div className="w-full">
                <Label>Expiry Date</Label>
                <Input 
                  placeholder="MM/YY" 
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardChange('expiry', e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </TabsContent>

          {/* Net Banking */}
          <TabsContent
            value="netbanking"
            className="space-y-4"
          >
            <Label>Select Your Bank</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sbi">State Bank of India</SelectItem>
                <SelectItem value="hdfc">HDFC Bank</SelectItem>
                <SelectItem value="icici">ICICI Bank</SelectItem>
                <SelectItem value="axis">Axis Bank</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="w-full" 
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Net Banking"
              )}
            </Button>
          </TabsContent>

          {/* COD */}
          <TabsContent
            value="cod"
            className="space-y-4"
          >
            <div className="flex items-start gap-2">
              <Checkbox id="cod-confirm" />
              <Label
                htmlFor="cod-confirm"
                className="text-sm"
              >
                I will pay the exact amount at delivery.
              </Label>
            </div>
            <Label>Additional Notes (Optional)</Label>
            <Textarea placeholder="E.g. Call before delivery, bring change, etc." />
            <Button 
              className="w-full" 
              onClick={() => setPaymentMethod(prev => ({ ...prev, type: "cod" }))}
            >
              Confirm Order
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}