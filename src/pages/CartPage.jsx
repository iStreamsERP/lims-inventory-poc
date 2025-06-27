import { callSoapService } from "@/api/callSoapService";
import CartItemImage from "@/components/CartItemImage";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { removeItem, updateItemQuantity } from "@/slices/cartSlice";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { formatPrice } from "@/utils/formatPrice";
import { toTitleCase } from "@/utils/stringUtils";
import { Minus, MoveRight, Plus, X } from "lucide-react";
import { toWords } from "number-to-words";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

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

  // Calculate cart totals
  const { totalItem, totalValue } = useMemo(() => {
    const totalItem = cart.reduce((sum, i) => sum + i.itemQty, 0);
    const totalValue = cart.reduce((sum, i) => sum + i.finalSaleRate * i.itemQty, 0);
    return { totalItem, totalValue };
  }, [cart]);

  // Get order category from cart items
  const getOrderCategory = useCallback(() => {
    const categories = [...new Set(cart.map((item) => item.ITEM_GROUP))];
    return categories.length === 1 ? categories[0] : "ALL";
  }, [cart]);

  // Prepare master data for checkout
  const prepareMasterData = useCallback(() => {
    return {
      ...masterFormData,
      TOTAL_VALUE: totalValue,
      NET_VALUE: totalValue, // Assuming no discounts
      ORDER_CATEGORY: getOrderCategory(),
      AMOUNT_IN_WORDS: toWords(Number(totalValue)),
    };
  }, [masterFormData, totalValue, getOrderCategory]);

  // Prepare detail data for a cart item
  const prepareDetailData = useCallback(
    (item, newSerialNo, masterData) => {
      const lineValue = item.finalSaleRate * item.itemQty;

      return {
        COMPANY_CODE: masterData.COMPANY_CODE,
        BRANCH_CODE: masterData.BRANCH_CODE,
        SALES_ORDER_SERIAL_NO: newSerialNo,
        ORDER_NO: masterData.ORDER_NO,
        ORDER_DATE: masterData.ORDER_DATE,
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
    },
    [userData],
  );

  // Save order details
  const saveOrderDetails = useCallback(
    async (cart, newSerialNo, masterData) => {
      for (const item of cart) {
        const detailModel = prepareDetailData(item, newSerialNo, masterData);
        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("SALES_ORDER_DETAILS", detailModel),
        };
        await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
      }
    },
    [prepareDetailData, userData],
  );

  // Handle checkout process
  const handleProceedToCheckout = useCallback(async () => {
    try {
      setLoading(true);
      const updatedMasterData = prepareMasterData();

      const payload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", updatedMasterData),
      };

      const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
      const m = response.match(/Serial No\s*'(\d+)'/);
      const newSerialNo = m ? parseInt(m[1], 10) : null;

      if (!newSerialNo) {
        throw new Error("Could not parse new order serial number from response");
      }

      await saveOrderDetails(cart, newSerialNo, updatedMasterData);

      toast({
        title: "Order created Successfully",
        description: `Order #${newSerialNo} has been saved`,
      });

      navigate("/proceed-to-check", { state: { newSerialNo } });
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
  }, [prepareMasterData, saveOrderDetails, cart, userData, navigate, toast]);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
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
        <div className="col-span-2 space-y-2 md:max-h-[59vh] md:overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-sm text-gray-400">Your cart is empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.ITEM_CODE}-${item.SUB_MATERIAL_NO}-${idx}`}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-[2fr_1fr_1fr]">
                  <div className="flex items-start gap-3">
                    <CartItemImage
                      ITEM_CODE={item.ITEM_CODE}
                      SUB_MATERIAL_NO={item.SUB_MATERIAL_NO}
                    />
                    <div>
                      <h3 className="text-lg font-medium">{item.ITEM_NAME || item.ITEM_NAME}</h3>
                      <div className="flex items-center gap-2">
                        {<p className="text-xs text-gray-500">{toTitleCase(item.ITEM_GROUP)}</p>}
                        {item.saleUom && <p className="text-xs text-gray-500">Range: {item.saleUom}</p>}
                        {item.ITEM_FINISH && <p className="text-xs text-gray-500">Color: {item.ITEM_FINISH}</p>}
                        {item.ITEM_SIZE && <p className="text-xs text-gray-500">Size: {item.ITEM_SIZE}</p>}
                        {item.ITEM_TYPE && <p className="text-xs text-gray-500">Variant: {item.ITEM_TYPE}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-start gap-2 md:justify-center">
                    <Button
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => {
                        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
                        dispatch(updateItemQuantity({ id: lineKey, qty: item.itemQty - 1 }));
                      }}
                      disabled={item.itemQty <= 1}
                    >
                      <Minus size={10} />
                    </Button>
                    <span className="ml-0 text-lg">{item.itemQty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
                        dispatch(updateItemQuantity({ id: lineKey, qty: item.itemQty + 1 }));
                      }}
                    >
                      <Plus size={10} />
                    </Button>
                  </div>

                  <div className="flex items-center justify-start gap-1 md:justify-end">
                    <p className="text-lg font-semibold">{formatPrice(item.finalSaleRate * item.itemQty)}</p>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        const lineKey = item.SUB_MATERIAL_NO ?? item.ITEM_CODE;
                        dispatch(removeItem({ id: lineKey }));
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
          <OrderSummaryCard
            itemCount={totalItem}
            totalValue={totalValue}
            totalPayable={totalValue}
            isViewMode={false}
            onProceed={handleProceedToCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
