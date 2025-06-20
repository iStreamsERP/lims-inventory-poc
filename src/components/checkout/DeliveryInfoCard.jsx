import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

export default function DeliveryInfoCard({
  previousAddresses,
  isLoadingAddresses,
  selectedAddress,
  setSelectedAddress,
  setOrderForm,
  setIsNewAddressDialogOpen,
}) {
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
          <h4 className="mb-3 text-sm font-medium">Previous Delivery Addresses</h4>
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
                      setOrderForm((prev) => ({ ...prev, DELIVERY_ADDRESS: address }));
                    }}
                  >
                    Deliver Here
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
