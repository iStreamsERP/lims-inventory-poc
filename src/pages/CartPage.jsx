import CartItemImage from "@/components/CartItemImage";
import OrderSummary from "@/components/OrderSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { formatPrice } from "@/utils/formatPrice";
import { Minus, MoveRight, Plus, X } from "lucide-react";
import { toWords } from "number-to-words";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { cart, removeItem, updateItemQuantity, clearCart } = useCart();

  // Initialize masterFormData with default values
  const [masterFormData, setMasterFormData] = useState({
    COMPANY_CODE: userData.companyCode,
    BRANCH_CODE: userData.branchCode,
    SALES_ORDER_SERIAL_NO: -1,
    ORDER_NO: "ORDER-" + new Date().getTime(),
    ORDER_DATE: new Date().toISOString().split("T")[0],
    CLIENT_ID: null,
    CLIENT_NAME: "",
    CLIENT_ADDRESS: "",
    CLIENT_CONTACT: "",
    EMP_NO: userData?.userEmployeeNo || "",
    ORDER_CATEGORY: "",
    TOTAL_VALUE: 0,
    DISCOUNT_VALUE: 0,
    NET_VALUE: 0,
    AMOUNT_IN_WORDS: "",
    CURRENCY_NAME: "Rupees",
    NO_OF_DECIMALS: 0,
    EXCHANGE_RATE: 0,
    ORDER_VALUE_IN_LC: 0,
    MODE_OF_PAYMENT: "",
    CREDIT_DAYS: 0,
    ADVANCE_AMOUNT: 0,
    MODE_OF_TRANSPORT: "",
    DELIVERY_DATE: "",
    DELIVERY_ADDRESS: "",
    TERMS_AND_CONDITIONS: "",
    DELETED_STATUS: "F",
    DELETED_DATE: "",
    DELETED_USER: "",
    USER_NAME: userData.userEmail,
    ENT_DATE: "",
  });

  const [detailsFormData, setDetailsFormData] = useState({
    COMPANY_CODE: 1,
    BRANCH_CODE: 1,
    SALES_ORDER_SERIAL_NO: masterFormData.SALES_ORDER_SERIAL_NO,
    ORDER_NO: "",
    ORDER_DATE: new Date().toISOString().split("T")[0],
    SERIAL_NO: -1,
    ITEM_CODE: "",
    SUB_MATERIAL_NO: "",
    DESCRIPTION: "",
    UOM_SALES: "",
    UOM_STOCK: "",
    CONVERSION_RATE: 1,
    QTY: 0,
    QTY_STOCK: 0,
    CONVRATE_TO_MASTER: 0,
    QTY_TO_MASTER: 0,
    RATE: 0,
    VALUE: 0,
    DISCOUNT_VALUE: 0,
    DISCOUNT_RATE: 0,
    NET_VALUE: 0,
    VALUE_IN_LC: 0,
    DELETED_STATUS: 0,
    USER_NAME: userData.userEmail,
    ENT_DATE: "",
    TRANSPORT_CHARGE: "",
  });

  // Cart totals
  const totalItem = cart.reduce((sum, i) => sum + i.itemQty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.finalSaleRate * i.itemQty, 0);
  const discount = masterFormData.DISCOUNT_VALUE;
  const total = subtotal - discount;

  const getOrderCategoryFromCart = () => {
    const categories = cart.map((item) => item.ITEM_GROUP);
    const category = Array.from(new Set(categories));

    if (category.length === 1) {
      return category[0];
    }
    return "ALL";
  };

  useEffect(() => {
    setMasterFormData((fd) => ({
      ...fd,
      TOTAL_VALUE: subtotal,
      NET_VALUE: total,
      ORDER_CATEGORY: getOrderCategoryFromCart(),
      AMOUNT_IN_WORDS: toWords(Number(total)),
    }));
  }, [subtotal, cart, total]);

  const handleProceedToCheckout = async () => {
    try {
      setLoading(true);

      // Update masterFormData with latest values before saving
      const updatedMasterData = {
        ...masterFormData,
        TOTAL_VALUE: subtotal,
        NET_VALUE: total,
        AMOUNT_IN_WORDS: toWords(Number(total)),
      };

      const payload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", updatedMasterData),
      };

      const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);

      const m = response.match(/Serial No\s*'(\d+)'/);
      const newSerialNo = m ? parseInt(m[1], 10) : null;

      if (typeof response === "string" && response.trim().startsWith("Error")) {
        throw new Error(response);
      }

      if (!newSerialNo) {
        throw new Error("Could not parse new order serial number from response");
      }

      // Save each cart item as a DETAIL record
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const lineValue = item.finalSaleRate * item.itemQty;

        const detailModel = {
          ...detailsFormData,
          COMPANY_CODE: updatedMasterData.COMPANY_CODE,
          BRANCH_CODE: updatedMasterData.BRANCH_CODE,
          SALES_ORDER_SERIAL_NO: newSerialNo,
          ORDER_NO: updatedMasterData.ORDER_NO,
          ORDER_DATE: updatedMasterData.ORDER_DATE,
          SERIAL_NO: -1,
          ITEM_CODE: item.ITEM_CODE,
          SUB_MATERIAL_NO: item.SUB_MATERIAL_NO,
          DESCRIPTION: item.ITEM_NAME,
          UOM_SALES: item.UOM_STOCK,
          UOM_STOCK: item.UOM_STOCK,
          CONVERSION_RATE: 1,
          QTY: item.itemQty,
          QTY_STOCK: item.itemQty,
          CONVRATE_TO_MASTER: 1,
          QTY_TO_MASTER: item.itemQty,
          RATE: item.finalSaleRate,
          VALUE: lineValue,
          DISCOUNT_VALUE: 0,
          DISCOUNT_RATE: 0,
          NET_VALUE: lineValue,
          VALUE_IN_LC: lineValue,
          TRANSPORT_CHARGE: 0,
          DELETED_STATUS: "F",
          USER_NAME: userData.userEmail,
          ENT_DATE: "",
        };

        const detailPayload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("SALES_ORDER_DETAILS", detailModel),
        };

        await callSoapService(userData.clientURL, "DataModel_SaveData", detailPayload);
      }

      toast({
        title: "Order created Successfully",
        description: `Order #${newSerialNo} has been saved`,
      });

      navigate("/proceed-to-check", {
        state: {
          newSerialNo,
        },
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error saving data. Please try again.",
        description: error?.message || "Unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-sm text-gray-500">Review items and proceed to checkout.</p>
        </div>
        <Link
          to="/categories"
          className="flex items-center gap-2 text-sm font-semibold hover:underline"
        >
          Continue Shopping <MoveRight size={16} />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="col-span-2 space-y-6 md:max-h-[59vh] md:overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-sm text-gray-400">Your cart is empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.ITEM_CODE}-${item.SUB_MATERIAL_NO}-${idx}`}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[2fr_1fr_1fr]">
                  <div className="flex items-start gap-3">
                    <CartItemImage
                      ITEM_CODE={item.ITEM_CODE}
                      SUB_MATERIAL_NO={item.SUB_MATERIAL_NO}
                    />
                    <div>
                      {item.ITEM_GROUP && (
                        <Badge variant="outline">
                          <p className="text-xs text-gray-500">{item.ITEM_GROUP}</p>
                        </Badge>
                      )}
                      <h3 className="text-lg font-medium">{item.ITEM_NAME || item.ITEM_NAME}</h3>
                      {item.saleUom && <p className="text-xs text-gray-500">Range: {item.saleUom}</p>}
                      {item.ITEM_FINISH && <p className="text-xs text-gray-500">Color: {item.ITEM_FINISH}</p>}
                      {item.ITEM_SIZE && <p className="text-xs text-gray-500">Size: {item.ITEM_SIZE}</p>}
                      {item.ITEM_TYPE && <p className="text-xs text-gray-500">Variant: {item.ITEM_TYPE}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-8"
                      onClick={() => {
                        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
                        updateItemQuantity(lineKey, item.itemQty - 1);
                      }}
                      disabled={item.itemQty <= 1}
                    >
                      <Minus size={14} />
                    </Button>
                    <span>{item.itemQty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-8"
                      onClick={() => {
                        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
                        updateItemQuantity(lineKey, item.itemQty + 1);
                      }}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>

                  <div className="font-semibold md:text-right">
                    {formatPrice(item.finalSaleRate * item.itemQty)}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => {
                        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
                        removeItem(lineKey);
                      }}
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <OrderSummary
            isViewMode={false}
            totalItem={totalItem}
            subtotal={subtotal}
            discount={discount}
            total={total}
            isLoading={loading}
            onProceed={handleProceedToCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
