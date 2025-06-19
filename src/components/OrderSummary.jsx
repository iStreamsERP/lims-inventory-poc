import React from "react";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { formatPrice } from "@/utils/formatPrice";

const OrderSummary = ({ isViewMode = false, totalItem = 0, subtotal = 0, discount, total = 0, isLoading = false, onProceed }) => {
  const savingsAmount = subtotal - (subtotal - discount);

  return (
    <Card className="sticky top-0 space-y-4 p-6">
      <div className="flex justify-between text-sm">
        <span>Subtotal ({totalItem} Items)</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Discount</span>
        <span className="text-green-500">-{formatPrice(discount)}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-medium">
        <span>Total Amount</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-sm font-medium text-green-600">
        <span>You will save {formatPrice(savingsAmount)} on this order</span>
      </div>
      {!isViewMode && (
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={onProceed}
            disabled={isLoading}
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </Card>
  );
};

export default OrderSummary;
