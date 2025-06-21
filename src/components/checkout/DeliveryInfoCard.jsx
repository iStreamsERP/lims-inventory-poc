import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { callSoapService } from "@/api/callSoapService";
import { useAuth } from "@/contexts/AuthContext";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { ClipLoader } from "react-spinners";
import { useState } from "react";

export default function DeliveryInfoCard({
  previousAddresses,
  isLoadingAddresses,
  selectedAddress,
  setSelectedAddress,
  setIsNewAddressDialogOpen,
  orderForm,
}) {
  const { userData } = useAuth();
  const [loadingAddress, setLoadingAddress] = useState(null);

  const handleSubmitAddress = async (address) => {
    setLoadingAddress(address);
    try {
      const payload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", {
          SALES_ORDER_SERIAL_NO: orderForm.SALES_ORDER_SERIAL_NO,
          DELIVERY_ADDRESS: address,
        }),
      };

      const response = await callSoapService(userData.clientURL, "DataModel_SaveData", payload);
    } catch (error) {
      console.error("Failed to save billing details:", error);
      toast({
        variant: "destructive",
        title: "Billing Update Failed",
        description: error.message,
      });
    } finally {
      setLoadingAddress(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck size={18} /> Delivery Information
          </CardTitle>

          <Button
            variant="outline"
            onClick={() => setIsNewAddressDialogOpen(true)}
          >
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          {isLoadingAddresses ? (
            <p className="text-sm text-gray-500">Loading addresses...</p>
          ) : previousAddresses.length > 0 ? (
            <div className="space-y-3">
              {previousAddresses.map((address, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="delivery-address"
                      checked={selectedAddress === address}
                      onChange={() => setSelectedAddress(address)}
                      className="mr-3 h-4 w-4"
                    />
                    <label
                      htmlFor={`address-${index}`}
                      className="text-sm"
                    >
                      {address}
                    </label>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedAddress(address);
                      handleSubmitAddress(address);
                    }}
                  >
                    {loadingAddress === address ? <ClipLoader size={16} /> : "Deliver Here"}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No previous addresses found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
