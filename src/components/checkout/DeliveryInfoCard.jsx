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
  onSelectAddress,
}) {
  const [loadingAddress, setLoadingAddress] = useState(null);

  const handleAddressSelect = async (address) => {
    setLoadingAddress(address);
    try {
      await onSelectAddress(address);
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
            <div className="space-y-2">
              {previousAddresses.map((address, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded border p-2 transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="delivery-address"
                      checked={selectedAddress === address}
                      onChange={() => {
                        setSelectedAddress(address);
                        handleAddressSelect(address);
                      }}
                      className="mr-1 h-4 w-4"
                    />
                    <label
                      htmlFor={`address-${index}`}
                      className="text-sm"
                    >
                      {loadingAddress === address ? <p>Loading...</p> : address}
                    </label>
                  </div>
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
