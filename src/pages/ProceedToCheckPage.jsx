import { callSoapService } from "@/api/callSoapService";
import AddDeliveryAddressDialog from "@/components/checkout/AddDeliveryAddressDialog";
import BillingInfoCard from "@/components/checkout/BillingInfoCard";
import ConfirmationTab from "@/components/checkout/ConfirmationTab";
import CustomerSelector from "@/components/checkout/CustomerSelector";
import DeliveryAddressDialog from "@/components/checkout/DeliveryAddressDialog";
import DeliveryInfoCard from "@/components/checkout/DeliveryInfoCard";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import PaymentMethodCard from "@/components/checkout/PaymentMethodCard";
import ReceiptTab from "@/components/checkout/ReceiptTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchOrderDetails } from "@/services/orderService";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { City, Country, State } from "country-state-city";
import { ArrowRight, ClipboardCheck, CreditCard, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProceedToCheckPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { toast } = useToast();
  const salesOrderSerialNo = location.state?.newSerialNo || "";

  // State declarations
  const [orderItems, setOrderItems] = useState([]);
  const [openCustomer, setOpenCustomer] = useState(false);

  const [countries] = useState(Country.getAllCountries());
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [activeTab, setActiveTab] = useState("billing");

  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({ type: "card", cardType: "Visa" });
  const [orderForm, setOrderForm] = useState(initialOrderForm(userData, salesOrderSerialNo));
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isNewAddressDialogOpen, setIsNewAddressDialogOpen] = useState(false);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [saveToClientMaster, setSaveToClientMaster] = useState(false);
  const [addBillingToClient, setAddBillingToClient] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Refs and memoized values
  const availableStates = useMemo(() => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []), [selectedCountry]);
  const availableCities = useMemo(
    () => (selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : []),
    [selectedCountry, selectedState],
  );
  const orderTotals = useMemo(() => calculateOrderTotals(orderItems, orderForm.DISCOUNT_VALUE), [orderItems, orderForm.DISCOUNT_VALUE]);

  // Retrive the order items when the component mounts or salesOrderSerialNo changes
  useEffect(() => {
    const getOrderItems = async () => {
      if (!salesOrderSerialNo || !userData?.clientURL) return;
      const items = await fetchOrderDetails(userData.clientURL, salesOrderSerialNo);
      setOrderItems(items);
    };

    getOrderItems();
  }, [salesOrderSerialNo, userData?.clientURL]);

  // Event handlers
  const handleSelectClient = useCallback(
    async (client) => {
      if (!client) return;
      setOrderForm((prev) => ({
        ...prev,
        CLIENT_ID: client?.CLIENT_ID,
        CLIENT_NAME: client?.CLIENT_NAME,
        CLIENT_ADDRESS: client?.INVOICE_ADDRESS || "",
        CLIENT_CONTACT: client?.TELEPHONE_NO || "",
        DELIVERY_ADDRESS: client?.DELIVERY_ADDRESS || "",
        EMAIL_ADDRESS: client?.EMAIL_ADDRESS || "",
        COUNTRY: client.COUNTRY || "",
        STATE_NAME: client.STATE_NAME || "",
        CITY_NAME: client.CITY_NAME || "",
        zipCode: client.zipCode || "",
      }));
      setOpenCustomer(false);

      const selectedCountryObj = countries.find((c) => c.name === client.COUNTRY);
      if (selectedCountryObj) setSelectedCountry(selectedCountryObj.isoCode);

      const selectedStateObj = selectedCountryObj
        ? State.getStatesOfCountry(selectedCountryObj.isoCode).find((s) => s.name === client.STATE_NAME)
        : null;
      if (selectedStateObj) setSelectedState(selectedStateObj.isoCode);

      await fetchPreviousAddresses(client.CLIENT_ID);
    },
    [orderForm.CLIENT_ID],
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
    if (saveToClientMaster && orderForm.CLIENT_ID) {
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
      }
    }

    setActiveTab("receipts");
  }, [saveToClientMaster, orderForm, userData.userEmail, userData.clientURL, salesOrderSerialNo]);

  const handleBillingSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", {
            SALES_ORDER_SERIAL_NO: orderForm.SALES_ORDER_SERIAL_NO,
            CLIENT_ADDRESS: orderForm.CLIENT_ADDRESS,
          }),
        };

        const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);

        // Update CLIENT_MASTER if requested
        if (addBillingToClient && orderForm.CLIENT_ID) {
          const clientPayload = {
            UserName: userData.userEmail,
            DModelData: convertDataModelToStringData("CLIENT_MASTER", {
              CLIENT_ID: orderForm.CLIENT_ID,
              INVOICE_ADDRESS: orderForm.CLIENT_ADDRESS,
              COUNTRY: orderForm.COUNTRY,
              STATE_NAME: orderForm.STATE_NAME,
              CITY_NAME: orderForm.CITY_NAME,
              zipCode: orderForm.zipCode,
            }),
          };
          const response = await callSoapService(userData.clientURL, "DataModel_SaveData", clientPayload);
        }
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
    [orderForm, userData, addBillingToClient],
  );

  const handleAddressSelect = useCallback(() => {
    if (selectedAddress) {
      setOrderForm((prev) => ({
        ...prev,
        DELIVERY_ADDRESS: selectedAddress,
      }));
    }
    setIsDeliveryDialogOpen(false);
  }, [selectedAddress]);

  // Navigation
  const goToNext = useCallback(() => {
    if (activeTab === "billing") setActiveTab("confirmation");
    else if (activeTab === "confirmation") setActiveTab("receipts");
  }, [activeTab]);

  const goToPrev = useCallback(() => {
    if (activeTab === "confirmation") setActiveTab("billing");
    else if (activeTab === "receipts") setActiveTab("confirmation");
    else navigate("/cart-page");
  }, [activeTab, navigate]);

  return (
    <div className="mx-auto max-w-7xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="billing"
            className="flex items-center gap-2"
          >
            <CreditCard size={16} /> Bill & Payment
          </TabsTrigger>
          <TabsTrigger
            value="confirmation"
            className="flex items-center gap-2"
          >
            <ClipboardCheck size={16} /> Confirmation
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
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1 space-y-4">
              <CustomerSelector
                openCustomer={openCustomer}
                setOpenCustomer={setOpenCustomer}
                handleSelectClient={handleSelectClient}
              />

              <BillingInfoCard
                orderForm={orderForm}
                isBillingModalOpen={isBillingModalOpen}
                setIsBillingModalOpen={setIsBillingModalOpen}
                handleBillingChange={(field, value) => setOrderForm((prev) => ({ ...prev, [field]: value }))}
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
                orderForm={orderForm}
                setIsNewAddressDialogOpen={setIsNewAddressDialogOpen}
              />

              <PaymentMethodCard
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            <div className="flex-1 space-y-4">
              <OrderSummaryCard
                orderItems={orderItems}
                orderForm={orderForm}
                orderTotals={orderTotals}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrev}
            >
              Back to Cart
            </Button>
            <Button
              onClick={goToNext}
              className="gap-2"
              disabled={!paymentMethod.type || !orderForm.DELIVERY_ADDRESS}
            >
              Continue to Confirmation <ArrowRight size={16} />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="confirmation">
          <ConfirmationTab
            orderForm={orderForm}
            paymentMethod={paymentMethod}
            orderItems={orderItems}
            orderTotals={orderTotals}
            handlePlaceOrder={handlePlaceOrder}
            goToPrev={goToPrev}
            goToNext={goToNext}
          />
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

      <DeliveryAddressDialog
        isDeliveryDialogOpen={isDeliveryDialogOpen}
        setIsDeliveryDialogOpen={setIsDeliveryDialogOpen}
        isLoadingAddresses={isLoadingAddresses}
        previousAddresses={previousAddresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        saveToClientMaster={saveToClientMaster}
        setSaveToClientMaster={setSaveToClientMaster}
        handleAddressSelect={handleAddressSelect}
      />

      <AddDeliveryAddressDialog
        isNewAddressDialogOpen={isNewAddressDialogOpen}
        setIsNewAddressDialogOpen={setIsNewAddressDialogOpen}
        countries={countries}
        orderForm={orderForm}
        fetchPreviousAddresses={() => fetchPreviousAddresses(orderForm.CLIENT_ID)}
      />
    </div>
  );
}

// Helper functions
function initialOrderForm(userData, salesOrderSerialNo) {
  return {
    COMPANY_CODE: userData.companyCode,
    BRANCH_CODE: userData.branchCode,
    SALES_ORDER_SERIAL_NO: salesOrderSerialNo || -1,
    ORDER_NO: "",
    ORDER_DATE: new Date().toISOString().split("T")[0],
    CLIENT_ID: "",
    CLIENT_NAME: "",
    CLIENT_ADDRESS: "",
    CLIENT_CONTACT: "",
    INVOICE_ADDRESS: "",
    EMP_NO: userData?.userEmployeeNo || "",
    TOTAL_VALUE: 0,
    DISCOUNT_VALUE: 0,
    NET_VALUE: 0,
    CURRENCY_NAME: "Rupees",
    zipCode: "",
    EMAIL_ADDRESS: "",
    COUNTRY: "",
    STATE_NAME: "",
    CITY_NAME: "",
    DELIVERY_ADDRESS: "",
    DELIVERY_CONTACT_PERSON: "",
    DELIVERY_CONTACT_NO: "",
    GPS_LOCATION: "",
    GPS_LATITUDE: "",
    GPS_LONGITUDE: "",
    USER_NAME: userData.userEmail,
  };
}

function calculateOrderTotals(orderItems, discountValue) {
  const subtotal =
    orderItems?.reduce((sum, item) => {
      const rate = item.NET_VALUE || 0;
      const qty = item.QTY || 0;
      return sum + rate * qty;
    }, 0) || 0;

  const taxableAmount = subtotal - discountValue;
  const taxRate = 0.18;
  const taxAmount = taxableAmount * taxRate;
  const orderTotal = taxableAmount + taxAmount;

  return { subtotal, discountValue, taxableAmount, taxAmount, orderTotal };
}
