import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatPrice";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ConfirmationTab({
  orderForm,
  paymentMethod,
  orderItems,
  orderTotals,
  handlePlaceOrder,
  goToPrev,
  goToNext,
  orderId
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Confirmation</CardTitle>
        <CardDescription>Review your details before payment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

          <div>
            <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Delivery Address</h3>
            <div className="text-sm">
              <p>{orderForm.DELIVERY_ADDRESS}</p>
            </div>
          </div>

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

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
          <div className="rounded-lg border text-sm">
            <div className="max-h-[300px] overflow-y-auto p-4">
              {orderItems?.map((item, idx) => (
                <div key={idx} className="flex justify-between border-b py-2 last:border-0">
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
  );
}