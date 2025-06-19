import React from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const OrderSummary = () => {
  return (
    <Card className="sticky top-0 space-y-4 p-6">
      <div className="flex justify-between text-sm">
        {/* <span>Subtotal ({totalItem} Items)</span>
                <span>{formatPrice(subtotal)}</span> */}
        <span>Subtotal </span>
        <span>22</span>
      </div>
      <div className="flex justify-between text-sm text-green-500">
        {/* <span>Discount</span>
                <span>-{formatPrice(discount)}</span> */}
        <span>Discount</span>
        <span>-22</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Taxable Amount</span>
        {/* <span>{formatPrice(taxableAmount)}</span> */}
        <span>22</span>
      </div>
      <Separator />
      <div className="flex justify-between font-bold">
        <span>Total</span>
        {/* <span>{formatPrice(total)}</span> */}
        <span>22</span>
      </div>
      <div className="space-y-3 pt-4">
        <Button
          className="w-full"
          //   onClick={handleProceed}
          //   disabled={loading || cart.length === 0}
        >
          Proceed to Checkout
        </Button>
      </div>
    </Card>
  );
};

export default OrderSummary;
