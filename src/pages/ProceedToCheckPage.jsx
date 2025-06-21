import BillingInfoCard from "@/components/checkout/BillingInfoCard";
import ConfirmationTab from "@/components/checkout/ConfirmationTab";
import CustomerSelector from "@/components/checkout/CustomerSelector";
import DeliveryAddressDialog from "@/components/checkout/DeliveryAddressDialog";
import DeliveryInfoCard from "@/components/checkout/DeliveryInfoCard";
import NewAddressDialog from "@/components/checkout/NewAddressDialog";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard";
import PaymentMethodCard from "@/components/checkout/PaymentMethodCard";
import ReceiptTab from "@/components/checkout/ReceiptTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { callSoapService } from "@/services/callSoapService";
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
  const [orderId, setOrderId] = useState(null);
  const [orderDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState({ type: "card", cardType: "Visa" });
  const [orderForm, setOrderForm] = useState(initialOrderForm(userData, salesOrderSerialNo));
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [isNewAddressDialogOpen, setIsNewAddressDialogOpen] = useState(false);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [saveToClientMaster, setSaveToClientMaster] = useState(false);
  const [addBillingToClient, setAddBillingToClient] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState(initialNewAddressForm());
  const [saveNewAddressToClient, setSaveNewAddressToClient] = useState(false);
  const [isNewAddressLocating, setIsNewAddressLocating] = useState(false);
  const [newAddressLocationError, setNewAddressLocationError] = useState(null);

  // Refs and memoized values
  const addressesFetched = useRef(false);
  const availableStates = useMemo(() => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []), [selectedCountry]);
  const availableCities = useMemo(
    () => (selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : []),
    [selectedCountry, selectedState],
  );
  const orderTotals = useMemo(() => calculateOrderTotals(orderItems, orderForm.DISCOUNT_VALUE), [orderItems, orderForm.DISCOUNT_VALUE]);

  // Initialization
  useEffect(() => {
    fetchOrderItems();
  }, []);

  const fetchOrderItems = useCallback(async () => {
    if (!salesOrderSerialNo) return;
    try {
      const payload = {
        DataModelName: "SALES_ORDER_DETAILS",
        WhereCondition: `SALES_ORDER_SERIAL_NO = '${salesOrderSerialNo}'`,
        Orderby: "",
      };
      const response = await callSoapService(userData.clientURL, "DataModel_GetData", payload);
      setOrderItems(response || []);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  }, [salesOrderSerialNo, userData.clientURL]);

  // Event handlers
  const handleSelectClient = useCallback(async (client) => {
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

    await fetchPreviousAddresses();
    addressesFetched.current = false;
  }, []);

  const fetchPreviousAddresses = useCallback(async () => {
    if (!orderForm.CLIENT_ID || addressesFetched.current) return;

    setIsLoadingAddresses(true);
    try {
      const payload = {
        SQLQuery: `SELECT DELIVERY_ADDRESS FROM CLIENT_MASTER WHERE CLIENT_ID = '${orderForm.CLIENT_ID}' 
                   UNION 
                   SELECT DISTINCT DELIVERY_ADDRESS FROM SALES_ORDER_MASTER WHERE CLIENT_ID = '${orderForm.CLIENT_ID}'`,
      };

      const response = await callSoapService(userData.clientURL, "DataModel_GetDataFrom_Query", payload);

      if (Array.isArray(response)) {
        const validAddresses = response.map((item) => item?.DELIVERY_ADDRESS?.trim()).filter((addr) => addr && addr.length > 0);

        setPreviousAddresses([...new Set(validAddresses)]);
        addressesFetched.current = true;
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setPreviousAddresses([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [orderForm.CLIENT_ID, userData.clientURL]);

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

    setOrderId(salesOrderSerialNo); // Use actual order number instead of random
    setOrderDate(new Date());
    setActiveTab("receipts");
  }, [saveToClientMaster, orderForm, userData.userEmail, userData.clientURL, salesOrderSerialNo]);

  const handleBillingSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const payload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", orderForm),
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

  const getCurrentLocationForNewAddress = useCallback(() => {
    if (!navigator.geolocation) {
      setNewAddressLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsNewAddressLocating(true);
    setNewAddressLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          if (data.address) {
            const addr = data.address;
            const country = countries.find((c) => c.isoCode === (addr.country_code ? addr.country_code.toUpperCase() : ""));
            const state = country ? State.getStatesOfCountry(country.isoCode).find((s) => s.name === addr.state || s.isoCode === addr.state) : null;
            const city = addr.city || addr.town || addr.village || addr.county;

            const fullAddress = [addr.road || "", addr.house_number || "", city, addr.state, country?.name || addr.country, addr.postcode || ""]
              .filter(Boolean)
              .join(", ");

            setNewAddressForm((prev) => ({
              ...prev,
              address: fullAddress,
              country: country?.name || "",
              state: state?.name || "",
              city: city || "",
              zipCode: addr.postcode || "",
            }));
          }
        } catch (error) {
          setNewAddressLocationError("Failed to fetch address details");
        } finally {
          setIsNewAddressLocating(false);
        }
      },
      (error) => {
        setIsNewAddressLocating(false);
        setNewAddressLocationError("Unable to retrieve your location: " + error.message);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }, [countries]);

  const handleSaveNewAddress = useCallback(async () => {
    setOrderForm((prev) => ({
      ...prev,
      DELIVERY_ADDRESS: newAddressForm.address,
    }));

    try {
      const salesOrderPayload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", {
          ...orderForm,
          DELIVERY_ADDRESS: newAddressForm.address,
        }),
      };

      await callSoapService(userData.clientURL, "DataModel_SaveData", salesOrderPayload);
    } catch (error) {
      console.error("Failed to save to SALES_ORDER_MASTER:", error);
    }

    if (saveNewAddressToClient && orderForm.CLIENT_ID) {
      try {
        const clientPayload = {
          UserName: userData.userEmail,
          DModelData: convertDataModelToStringData("CLIENT_MASTER", {
            ...orderForm,
            DELIVERY_ADDRESS: newAddressForm.address,
          }),
        };
        await callSoapService(userData.clientURL, "DataModel_SaveData", clientPayload);
      } catch (error) {
        console.error("Failed to save to CLIENT_MASTER:", error);
      }
    }

    // Reset cache and refetch
    addressesFetched.current = false;
    fetchPreviousAddresses();

    setIsNewAddressDialogOpen(false);
    setNewAddressForm({
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
    });
  }, [newAddressForm, userData.userEmail, userData.clientURL, orderForm, saveNewAddressToClient, fetchPreviousAddresses]);

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
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedState={selectedState}
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
                setOrderForm={setOrderForm}
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
            orderId={orderId}
          />
        </TabsContent>

        <TabsContent value="receipts">
          <ReceiptTab
            orderForm={orderForm}
            paymentMethod={paymentMethod}
            orderItems={orderItems}
            orderTotals={orderTotals}
            orderId={orderId}
            orderDate={orderDate}
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

      <NewAddressDialog
        isNewAddressDialogOpen={isNewAddressDialogOpen}
        setIsNewAddressDialogOpen={setIsNewAddressDialogOpen}
        newAddressForm={newAddressForm}
        handleNewAddressChange={(field, value) => setNewAddressForm((prev) => ({ ...prev, [field]: value }))}
        countries={countries}
        getCurrentLocationForNewAddress={getCurrentLocationForNewAddress}
        isNewAddressLocating={isNewAddressLocating}
        newAddressLocationError={newAddressLocationError}
        saveNewAddressToClient={saveNewAddressToClient}
        setSaveNewAddressToClient={setSaveNewAddressToClient}
        handleSaveNewAddress={handleSaveNewAddress}
        orderForm={orderForm}
      />
    </div>
  );
}

// Helper functions
function initialOrderForm(userData, salesOrderSerialNo) {
  return {
    COMPANY_CODE: userData.companyCode,
    BRANCH_CODE: userData.branchCode,
    SALES_ORDER_SERIAL_NO: -1,
    ORDER_NO: salesOrderSerialNo || "",
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

function initialNewAddressForm() {
  return {
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
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
