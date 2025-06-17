import CartItemImage from "@/components/CartItemImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { formatPrice } from "@/utils/formatPrice";
import { Check, ChevronsUpDown, Minus, MoveRight, Plus, X } from "lucide-react";
import { toWords } from "number-to-words";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { toast } = useToast();

  const { cart, removeItem, updateItemQuantity, clearCart } = useCart();

  const [clientData, setClientData] = useState([]);
  const [value, setValue] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize masterFormData with default values
  const [masterFormData, setMasterFormData] = useState({
    COMPANY_CODE: userData.companyCode,
    BRANCH_CODE: userData.branchCode,
    SALES_ORDER_SERIAL_NO: -1,
    ORDER_NO: "",
    ORDER_DATE: new Date().toISOString().split("T")[0],
    CLIENT_ID: selectedClient?.CLIENT_ID || null,
    CLIENT_NAME: selectedClient?.CLIENT_NAME || "",
    CLIENT_ADDRESS: selectedClient?.INVOICE_ADDRESS || "",
    CLIENT_CONTACT: selectedClient?.TELEPHONE_NO || "",
    EMP_NO: userData?.userEmployeeNo || "",
    ORDER_CATEGORY: "",
    TOTAL_VALUE: 0,
    DISCOUNT_VALUE: 10,
    NET_VALUE: 0,
    AMOUNT_IN_WORDS: "",
    CURRENCY_NAME: "Rupees",
    NO_OF_DECIMALS: 0,
    EXCHANGE_RATE: 0,
    ORDER_VALUE_IN_LC: 0,
    MODE_OF_PAYMENT: "Static",
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
  const subtotal = cart.reduce((sum, i) => sum + i.finalSaleRate * i.itemQty, 0);
  const totalItem = cart.reduce((sum, i) => sum + i.itemQty, 0);

  // Industry standard calculations
  const discount = masterFormData.DISCOUNT_VALUE;
  const taxableAmount = Math.max(0, subtotal - discount);
  const deliveryCharge = 20;
  const otherCharges = 20;
  const grandTotal = taxableAmount + deliveryCharge + otherCharges;

  const getOrderCategoryFromCart = () => {
    const categories = cart.map((item) => item.itemGroup);
    const category = Array.from(new Set(categories));

    if (category.length === 1) {
      return category[0];
    }
    return "ALL";
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  useEffect(() => {
    setMasterFormData((fd) => ({
      ...fd,
      CLIENT_ID: selectedClient?.CLIENT_ID ?? null,
      CLIENT_NAME: selectedClient?.CLIENT_NAME ?? "",
      CLIENT_ADDRESS: selectedClient?.INVOICE_ADDRESS || "",
      CLIENT_CONTACT: selectedClient?.TELEPHONE_NO || "",
      TOTAL_VALUE: subtotal,
      NET_VALUE: grandTotal,
      ORDER_CATEGORY: getOrderCategoryFromCart(),
      AMOUNT_IN_WORDS: toWords(Number(grandTotal)),
    }));
  }, [selectedClient, subtotal, cart, grandTotal]);

  // Filter list based on dropdown input value
  const filteredClients = clientData.filter((client) => client.CLIENT_NAME.toLowerCase().includes(value.toLowerCase()));

  const handleSelectClient = (clientName) => {
    const client = clientData.find((c) => c.CLIENT_NAME === clientName);
    setValue(clientName);
    setSelectedClient(client || null);
    setOpenCustomer(false);
  };

  const fetchClientData = async () => {
    try {
      const payload = {
        SQLQuery: `SELECT * from CLIENT_MASTER`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      setClientData(response || []);
    } catch (error) {
      toast({ variant: "destructive", title: `Error fetching client: ${error.message}` });
    }
  };

  const handleProceed = () => {
    if (cart.length === 0 || !selectedClient) return;

    navigate("proceed-to-check", {
      state: {
        cart,
        selectedClient,
        subtotal,
        totalItem,
        discount: masterFormData.DISCOUNT_VALUE,
        deliveryCharge,
        otherCharges,
        grandTotal,
      },
    });
  };

  const handleSaveOrder = async () => {
    if (!selectedClient) {
      return toast({ variant: "destructive", title: "Please select a customer." });
    }

    try {
      setLoading(true);

      // Update masterFormData with latest values before saving
      const updatedMasterData = {
        ...masterFormData,
        TOTAL_VALUE: subtotal,
        NET_VALUE: grandTotal,
        AMOUNT_IN_WORDS: toWords(Number(grandTotal)),
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
          SERIAL_NO: -1, // Sequential line number
          ITEM_CODE: item.itemCode || item.ITEM_CODE,
          SUB_MATERIAL_NO: item.subProductNo,
          DESCRIPTION: item.itemName || item.ITEM_NAME,
          UOM_SALES: item.uomStock,
          UOM_STOCK: item.uomStock,
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
        title: "Order Saved Successfully",
        description: `Order #${newSerialNo} has been saved`,
      });

      clearCart();
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
    <main className="container mx-auto px-4">
      <div className="grid gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-sm text-gray-500">Review items and proceed to checkout.</p>
          </div>
          <Button
            variant="link"
            onClick={() => navigate("/categories")}
          >
            Continue Shopping <MoveRight />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Cart Items */}
          <div className="col-span-2 space-y-6">
            {cart.length === 0 ? (
              <p className="text-center text-sm text-gray-400">Your cart is empty.</p>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.itemCode}-${item.subProductNo}-${idx}`}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-[2fr_1fr_1fr] items-center gap-4">
                    <div className="flex items-center gap-3">
                      <CartItemImage
                        itemCode={item.itemCode}
                        subProductNo={item.subProductNo}
                      />
                      <div>
                        {item.itemGroup && (
                          <Badge
                            variant="outline"
                            className="mb-1"
                          >
                            <p className="text-xs text-gray-500">{item.itemGroup}</p>
                          </Badge>
                        )}
                        <h3 className="text-lg font-medium">{item.itemName || item.ITEM_NAME}</h3>
                        {item.saleUom && <p className="text-xs text-gray-500">Range: {item.saleUom}</p>}
                        {item.itemColor && <p className="text-xs text-gray-500">Color: {item.itemColor}</p>}
                        {item.itemSize && <p className="text-xs text-gray-500">Size: {item.itemSize}</p>}
                        {item.itemVariant && <p className="text-xs text-gray-500">Variant: {item.itemVariant}</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-8"
                        onClick={() => {
                          const lineKey = item.subProductNo ?? item.itemCode;
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
                          const lineKey = item.subProductNo ?? item.itemCode;
                          updateItemQuantity(lineKey, item.itemQty + 1);
                        }}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>

                    <div className="text-right font-semibold">
                      {formatPrice(item.finalSaleRate * item.itemQty)}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => {
                          const lineKey = item.subProductNo ?? item.itemCode;
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

          {/* Customer & Summary */}
          <div className="col-span-2 space-y-4 md:col-span-1">
            {/* Customer Selector */}
            <Card className="space-y-2 p-6">
              <h2 className="text-lg font-semibold">Select Customer</h2>

              <Popover
                open={openCustomer}
                onOpenChange={setOpenCustomer}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCustomer}
                    className="flex w-full justify-between"
                  >
                    {value || "Select customer..."}
                    <ChevronsUpDown className="opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search customer..."
                      value={value}
                      onValueChange={setValue}
                      className="h-9 px-3"
                    />
                    <CommandList>
                      <CommandEmpty>No customers found.</CommandEmpty>
                      <CommandGroup>
                        {filteredClients.map((client) => (
                          <CommandItem
                            key={client.CLIENT_ID}
                            value={client.CLIENT_NAME}
                            onSelect={handleSelectClient}
                          >
                            {client.CLIENT_NAME}
                            <Check className={`ml-auto ${value === client.CLIENT_NAME ? "opacity-100" : "opacity-0"}`} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Card>

            {/* Order Summary */}
            <Card className="sticky top-0 space-y-4 p-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItem} Items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-500">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxable Amount</span>
                <span>{formatPrice(taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Charge</span>
                <span>{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Other Charges</span>
                <span>{formatPrice(otherCharges)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Grand Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveOrder}
                  disabled={loading || cart.length === 0}
                >
                  {loading ? "Saving…" : "Save my order"}
                </Button>
                <Button
                  className="w-full"
                  onClick={handleProceed}
                  disabled={cart.length === 0 || !selectedClient}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
