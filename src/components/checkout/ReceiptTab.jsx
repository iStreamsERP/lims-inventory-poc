import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { convertServiceDate } from "@/utils/dateUtils";
import { formatPrice } from "@/utils/formatPrice";

export default function ReceiptTab({ orderForm, paymentMethod, orderItems, orderTotals, navigate }) {
  return (
    <Card>
      <CardHeader>
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
          <div>
            <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span>{orderForm?.ORDER_NO || "Pending"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{convertServiceDate(orderForm?.ORDER_DATE)}</span>
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

          <div>
            <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Billing Address</h3>
            <div className="text-sm">
              <p>{orderForm?.CLIENT_NAME}</p>
              <p>{orderForm?.CLIENT_ADDRESS}</p>
              <p>
                {orderForm?.CITY_NAME}, {orderForm?.STATE_NAME} {orderForm?.zipCode}
              </p>
              <p>{orderForm?.COUNTRY}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 border-b pb-2 text-lg font-semibold">Delivery Address</h3>
            <div className="text-sm">
              <p>{orderForm?.DELIVERY_ADDRESS}</p>
              {orderForm?.DELIVERY_CONTACT_PERSON && <p>Contact: {orderForm.DELIVERY_CONTACT_PERSON}</p>}
              {orderForm?.DELIVERY_CONTACT_NO && <p>Phone: {orderForm.DELIVERY_CONTACT_NO}</p>}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border">
          <div className="border-b p-4">
            <h3 className="font-semibold">Order Summary</h3>
          </div>
          <div className="p-4 text-sm">
            <div className="flex justify-between border-b py-2 font-medium">
              <span>Product</span>
              <span>Total</span>
            </div>

            {orderItems?.map((item, idx) => (
              <div
                key={idx}
                className="border-b py-4"
              >
                <div className="flex justify-between">
                  <span>
                    {item.DESCRIPTION} × {item.QTY}
                  </span>
                  <span>{formatPrice(item.RATE * item.QTY)}</span>
                </div>
              </div>
            ))}

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(orderTotals.totalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">-{formatPrice(orderTotals.discountValue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>{formatPrice(orderTotals.gstAmount)}</span>
              </div>

              <div className="flex justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(orderTotals.totalPayable)}</span>
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
  );
}
