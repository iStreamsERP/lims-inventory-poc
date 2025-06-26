import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "../ui/button";

export default function OrderSummaryCard({
  itemCount,
  totalValue,
  discountPercent,
  discountValue,
  subtotal,
  transportCharges,
  taxableAmount,
  gstRate,
  gstAmount,
  totalPayable,
  showCharges = false,
  isViewMode = false,
  onProceed,
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Review your items</CardDescription>
        </div>

        {showCharges && <Button variant="outline">Apply Discount</Button>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Total (Before Discount) ({itemCount} Items)</span>
            <span>{formatPrice(totalValue)}</span>
          </div>
          {showCharges && (
            <>
              <div className="flex justify-between text-sm text-green-500">
                <span>Discount ({discountPercent}%)</span>
                <span>-{formatPrice(discountValue)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Subtotal (After Discount)</span>
                <span>-{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Transport Charges</span>
                <span>-{formatPrice(transportCharges)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Taxable Amount</span>
                <span>{formatPrice(taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST / Tax ({gstRate}%)</span>
                <span>{formatPrice(gstAmount)}</span>
              </div>
            </>
          )}

          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total Payable </span>
            <span>{formatPrice(totalPayable)}</span>
          </div>

          <Separator />
          <div className="flex justify-between text-sm font-medium text-green-600">
            <span>You will save on this order</span>
          </div>

          {!isViewMode && (
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={onProceed}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
