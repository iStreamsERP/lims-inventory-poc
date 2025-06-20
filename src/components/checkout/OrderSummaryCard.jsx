import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/formatPrice";

export default function OrderSummaryCard({ orderItems, orderForm, orderTotals }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({orderItems?.length || 0} Items)</span>
            <span>{formatPrice(orderForm.TOTAL_VALUE)}</span>
          </div>
          <div className="flex justify-between text-sm text-green-500">
            <span>Discount</span>
            <span>-{formatPrice(orderTotals.discountValue)}</span>
          </div>

          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(orderTotals.orderTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}