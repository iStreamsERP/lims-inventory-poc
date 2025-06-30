import { callSoapService } from "@/api/callSoapService";
import AddDeliveryAddressDialog from "@/components/checkout/AddDeliveryAddressDialog";
import BillingInfoCard from "@/components/checkout/BillingInfoCard";
import CustomerSelector from "@/components/checkout/CustomerSelector";
import DeliveryInfoCard from "@/components/checkout/DeliveryInfoCard";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import PaymentMethodCard from "@/components/checkout/PaymentMethodCard";
import ReceiptTab from "@/components/checkout/ReceiptTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchClientDetails, fetchOrderDetails, fetchOrderMaster } from "@/services/orderService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { City, Country, State } from "country-state-city";
import { ArrowRight, CreditCard, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProceedToCheckPage() {
  const { userData } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const salesOrderSerialNo = location.state?.newSerialNo || "";

  // State declarations
  const [orderForm, setOrderForm] = useState({});
  const [orderItems, setOrderItems] = useState([]);

  const [clientDetails, setClientDetails] = useState({});
  const [selectedClientName, setSelectedClientName] = useState("");
  const [openClient, setOpenClient] = useState(false);

  const [countries] = useState(Country.getAllCountries());
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [activeTab, setActiveTab] = useState("billing");

  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({ type: "card", cardType: "Visa" });
  const [isNewAddressDialogOpen, setIsNewAddressDialogOpen] = useState(false);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addBillingToClient, setAddBillingToClient] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const nonCodMethods = useMemo(() => ["wallet", "card", "netbanking"], []);

  // Refs and memoized values
  const availableStates = useMemo(() => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []), [selectedCountry]);
  const availableCities = useMemo(
    () => (selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : []),
    [selectedCountry, selectedState],
  );

  const orderTotals = useMemo(
    () => calculateOrderTotals(orderItems, orderForm.DISCOUNT_VALUE, orderForm.DISCOUNT_PTG, orderForm.TRANSPORT_CHARGE),
    [orderItems, orderForm.DISCOUNT_VALUE, orderForm.DISCOUNT_PTG, orderForm.TRANSPORT_CHARGE],
  );

  useEffect(() => {
    setIsPaymentSuccess(false);
  }, [paymentMethod.type]);

  // Mock payment function
  const initiateMockPayment = useCallback(() => {
    setIsProcessingPayment(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsProcessingPayment(false);

      // For demo purposes - 80% success rate
      const success = Math.random() < 0.8;
      setIsPaymentSuccess(success);

      if (success) {
        toast({
          title: "Payment Successful",
          description: `Your payment via ${paymentMethod.type === "card" ? paymentMethod.cardType : paymentMethod.type} has been processed`,
        });

        setActiveTab("receipts");
      } else {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "Transaction declined. Please try another method",
        });
      }
    }, 2000);
  }, [toast, paymentMethod]);

  // Retrieve the order data when the component mounts or salesOrderSerialNo changes
  const getOrderData = async () => {
    if (!salesOrderSerialNo || !userData?.clientURL) return;

    try {
      // 1. Fetch master
      const master = await fetchOrderMaster(userData.clientURL, salesOrderSerialNo);
      if (!master) {
        throw new Error("Empty order master response");
      }

      setOrderForm(master);
      setSelectedAddress(master.DELIVERY_ADDRESS || "");
      setSelectedClientName(master.CLIENT_NAME || "");

      // 2. Fetch client details if client exists
      if (master.CLIENT_ID) {
        const client = await fetchClientDetails(userData.clientURL, master.CLIENT_ID);
        if (client) {
          setClientDetails({
            COUNTRY: client.COUNTRY || "",
            STATE_NAME: client.STATE_NAME || "",
            CITY_NAME: client.CITY_NAME || "",
          });

          // Set country/state from client data
          const countryObj = countries.find((c) => c.name === client.COUNTRY);
          if (countryObj) setSelectedCountry(countryObj.isoCode);

          if (client.STATE_NAME && countryObj) {
            const stateObj = State.getStatesOfCountry(countryObj.isoCode).find((s) => s.name === client.STATE_NAME);
            if (stateObj) setSelectedState(stateObj.isoCode);
          }

          // Fetch previous addresses
          fetchPreviousAddresses(master.CLIENT_ID);
        }
      }

      // 3. Fetch details
      const details = await fetchOrderDetails(userData.clientURL, salesOrderSerialNo);
      if (!details) {
        throw new Error("Empty order details response");
      }

      setOrderItems(details);

      // Fetch previous addresses if client exists
      if (master.CLIENT_ID) {
        fetchPreviousAddresses(master.CLIENT_ID);
      }
    } catch (error) {
      console.error("Failed to fetch order data:", error);
      toast({
        variant: "destructive",
        title: "Order Error",
        description: "Could not load order data",
      });
    }
  };

  useEffect(() => {
    getOrderData();
  }, [salesOrderSerialNo, userData?.clientURL]);

  const saveOrderForm = useCallback(
    async (formData) => {
      if (!formData.SALES_ORDER_SERIAL_NO || formData.SALES_ORDER_SERIAL_NO === -1) return;

      try {
        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", formData),
        };
        await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
        return true;
      } catch (error) {
        console.error("Failed to save order form:", error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save order data. Please try again.",
        });
        return false;
      }
    },
    [userData, toast],
  );

  const handleSelectClient = useCallback(
    async (client) => {
      if (!client) return;

      const newForm = {
        ...orderForm,
        CLIENT_ID: client?.CLIENT_ID,
        CLIENT_NAME: client?.CLIENT_NAME,
        CLIENT_ADDRESS: client?.INVOICE_ADDRESS || "",
        CLIENT_CONTACT_DETAILS: client?.TELEPHONE_NO || "",
        DELIVERY_ADDRESS: client?.DELIVERY_ADDRESS || "",
        EMAIL_ADDRESS: client?.EMAIL_ADDRESS || "",
      };

      const newClientDetails = {
        COUNTRY: client.COUNTRY || "",
        STATE_NAME: client.STATE_NAME || "",
        CITY_NAME: client.CITY_NAME || "",
      };

      setOrderForm(newForm);
      setClientDetails(newClientDetails);
      await saveOrderForm(newForm);
      setSelectedClientName(client.CLIENT_NAME);
      setOpenClient(false);

      const selectedCountryObj = countries.find((c) => c.name === client.COUNTRY);
      if (selectedCountryObj) setSelectedCountry(selectedCountryObj.isoCode);

      if (selectedCountryObj && client.STATE_NAME) {
        const stateObj = State.getStatesOfCountry(selectedCountryObj.isoCode).find((s) => s.name === client.STATE_NAME);
        if (stateObj) setSelectedState(stateObj.isoCode);
      }

      await fetchPreviousAddresses(client.CLIENT_ID);
    },
    [orderForm, saveOrderForm, countries],
  );

  const fetchPreviousAddresses = useCallback(
    async (clientId) => {
      if (!clientId) return;

      setIsLoadingAddresses(true);
      try {
        const payload = {
          SQLQuery: `SELECT DELIVERY_ADDRESS FROM CLIENT_MASTER WHERE CLIENT_ID = '${clientId}' 
                   UNION 
                   SELECT DISTINCT DELIVERY_ADDRESS FROM SALES_ORDER_MASTER WHERE CLIENT_ID = '${clientId}'`,
        };

        const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

        if (Array.isArray(response)) {
          const validAddresses = response.map((item) => item?.DELIVERY_ADDRESS?.trim()).filter((addr) => addr && addr.length > 0);

          setPreviousAddresses([...new Set(validAddresses)]);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        setPreviousAddresses([]);
      } finally {
        setIsLoadingAddresses(false);
      }
    },
    [userData.clientURL],
  );

  const handlePlaceOrder = useCallback(async () => {
    if (orderForm.CLIENT_ID) {
      try {
        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("CLIENT_MASTER", {
            ...orderForm,
            DELIVERY_ADDRESS: orderForm.DELIVERY_ADDRESS,
          }),
        };
        await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
      } catch (error) {
        console.error("Failed to save delivery address:", error);
        toast({
          variant: "destructive",
          title: "Address Save Failed",
          description: "Could not save delivery address to client profile",
        });
      }
    }

    // Final save before proceeding
    const saved = await saveOrderForm(orderForm);
    if (saved) {
      setActiveTab("receipts");
    }
  }, [orderForm, userData, saveOrderForm]);

  const handleBillingSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        if (addBillingToClient && orderForm.CLIENT_ID) {
          const payload = {
            UserName: userData.userEmail,
            DModelData: convertDataModelToStringData("CLIENT_MASTER", {
              CLIENT_ID: orderForm.CLIENT_ID,
              INVOICE_ADDRESS: orderForm.CLIENT_ADDRESS,
              COUNTRY: orderForm.COUNTRY,
              STATE_NAME: orderForm.STATE_NAME,
              CITY_NAME: orderForm.CITY_NAME,
            }),
          };
          await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
        }

        await saveOrderForm(orderForm);

        toast({
          title: "Billing Updated",
          description: "Billing information saved successfully",
        });
      } catch (error) {
        console.error("Failed to save billing details:", error);
        toast({
          variant: "destructive",
          title: "Billing Update Failed",
          description: error.message,
        });
      }

      setIsBillingModalOpen(false);
    },
    [orderForm, userData, addBillingToClient, saveOrderForm],
  );

  const updateDeliveryAddress = useCallback(
    async (address) => {
      let payload = {};
      if (typeof address === "string") {
        payload = {
          DELIVERY_ADDRESS: address,
          GPS_LOCATION: orderForm.DELIVERY_ADDRESS === address ? orderForm.GPS_LOCATION : "",
          GPS_LATITUDE: orderForm.DELIVERY_ADDRESS === address ? orderForm.GPS_LATITUDE : "",
          GPS_LONGITUDE: orderForm.DELIVERY_ADDRESS === address ? orderForm.GPS_LONGITUDE : "",
        };
      } else if (typeof address === "object") {
        payload = {
          ...address,
        };
      }

      const newForm = { ...orderForm, ...payload };
      setOrderForm(newForm);
      await saveOrderForm(newForm);
    },
    [orderForm, saveOrderForm],
  );

  const handleSaveNewAddress = useCallback(
    async (newAddress) => {
      await updateDeliveryAddress(newAddress);
      setIsNewAddressDialogOpen(false);
      if (orderForm.CLIENT_ID) {
        fetchPreviousAddresses(orderForm.CLIENT_ID);
      }
    },
    [updateDeliveryAddress, orderForm.CLIENT_ID, fetchPreviousAddresses],
  );

  const canProceedToReceipt = useMemo(() => {
    const hasPaymentMethod = !!paymentMethod.type;
    const hasDeliveryAddress = !!orderForm.DELIVERY_ADDRESS;
    const hasBillingAddress = !!orderForm.CLIENT_ADDRESS;
    const hasClient = !!orderForm.CLIENT_ID;
    const isNonCod = nonCodMethods.includes(paymentMethod.type);
    const paymentOk = isNonCod ? isPaymentSuccess : true;

    return hasPaymentMethod && hasDeliveryAddress && hasBillingAddress && hasClient && paymentOk;
  }, [paymentMethod, orderForm, isPaymentSuccess]);

  // Navigation
  const goToNext = useCallback(() => {
    if (activeTab === "billing") setActiveTab("receipts");
  }, [activeTab]);

  const goToPrev = useCallback(() => {
    if (activeTab === "receipts") setActiveTab("billing");
    else navigate("/cart-page");
  }, [activeTab, navigate]);

  return (
    <div className="mx-auto max-w-7xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="billing"
            className="flex items-center gap-2"
          >
            <CreditCard size={16} /> Bill & Payment
          </TabsTrigger>
          <TabsTrigger
            value="receipts"
            className="flex items-center gap-2"
          >
            <ShoppingCart size={16} /> Your Receipt
          </TabsTrigger>
        </TabsList>

        {/* BILLING TAB */}
        <TabsContent value="billing">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="flex-1 space-y-2">
              <CustomerSelector
                selectedClientName={selectedClientName}
                openClient={openClient}
                setOpenClient={setOpenClient}
                handleSelectClient={handleSelectClient}
              />

              <BillingInfoCard
                orderForm={orderForm}
                clientDetails={clientDetails}
                isBillingModalOpen={isBillingModalOpen}
                setIsBillingModalOpen={setIsBillingModalOpen}
                handleBillingChange={(field, value) => setOrderForm((prev) => ({ ...prev, [field]: value }))}
                handleClientDetailsChange={(field, value) => setClientDetails((prev) => ({ ...prev, [field]: value }))}
                setSelectedCountry={setSelectedCountry}
                setSelectedState={setSelectedState}
                countries={countries}
                states={availableStates}
                cities={availableCities}
                addBillingToClient={addBillingToClient}
                setAddBillingToClient={setAddBillingToClient}
                handleBillingSubmit={handleBillingSubmit}
              />

              <DeliveryInfoCard
                previousAddresses={previousAddresses}
                isLoadingAddresses={isLoadingAddresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                setIsNewAddressDialogOpen={setIsNewAddressDialogOpen}
                onSelectAddress={updateDeliveryAddress}
              />
            </div>

            <div className="flex-1 space-y-2">
              <OrderSummaryCard
                itemCount={orderTotals.itemCount}
                totalValue={orderTotals.totalValue}
                discountPercent={orderTotals.discountPercent}
                discountValue={orderTotals.discountValue}
                subtotal={orderTotals.subtotal}
                transportCharges={orderTotals.transportCharges}
                taxableAmount={orderTotals.taxableAmount}
                gstRate={orderTotals.gstRate}
                gstAmount={orderTotals.gstAmount}
                totalPayable={orderTotals.totalPayable}
                showCharges={true}
                isViewMode={true}
              />

              <PaymentMethodCard
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                initiateMockPayment={initiateMockPayment}
                isProcessingPayment={isProcessingPayment}
              />
            </div>
          </div>

          {/* <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrev}
            >
              Back to Cart
            </Button>
            <Button
              onClick={handlePlaceOrder}
              className="gap-2"
              disabled={!canProceedToReceipt || isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Place Order"}
              {!isProcessingPayment && <ArrowRight size={16} />}
            </Button>
          </div> */}
        </TabsContent>

        <TabsContent value="receipts">
          <ReceiptTab
            orderForm={orderForm}
            paymentMethod={paymentMethod}
            orderItems={orderItems}
            orderTotals={orderTotals}
            goToPrev={goToPrev}
            navigate={navigate}
          />
        </TabsContent>
      </Tabs>

      <AddDeliveryAddressDialog
        isNewAddressDialogOpen={isNewAddressDialogOpen}
        setIsNewAddressDialogOpen={setIsNewAddressDialogOpen}
        countries={countries}
        orderForm={orderForm}
        fetchPreviousAddresses={() => fetchPreviousAddresses(orderForm.CLIENT_ID)}
        onSave={handleSaveNewAddress}
      />
    </div>
  );
}

// Helper functions
function calculateOrderTotals(orderItems, discountValue, discountPercent, transportCharges) {
  const totalValue =
    orderItems?.reduce((sum, item) => {
      const rate = item.RATE || 0;
      const qty = item.QTY || 0;
      return sum + rate * qty;
    }, 0) || 0;

  const subtotal = totalValue - discountValue;

  const taxableAmount = subtotal + transportCharges;
  const gstRate = 0.18;
  const gstAmount = taxableAmount * gstRate;

  const totalPayable = taxableAmount + gstAmount;

  return {
    itemCount: orderItems.length,
    totalValue,
    discountPercent,
    discountValue,
    subtotal,
    transportCharges,
    taxableAmount,
    gstRate,
    gstAmount,
    totalPayable,
  };
}
