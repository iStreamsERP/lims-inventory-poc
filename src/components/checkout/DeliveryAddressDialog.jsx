import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function DeliveryAddressDialog({
  isDeliveryDialogOpen,
  setIsDeliveryDialogOpen,
  isLoadingAddresses,
  previousAddresses,
  selectedAddress,
  setSelectedAddress,
  saveToClientMaster,
  setSaveToClientMaster,
  handleAddressSelect
}) {
  return (
    <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Delivery Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto">
            {isLoadingAddresses ? (
              <p className="text-center text-gray-500">Loading addresses...</p>
            ) : previousAddresses.length > 0 ? (
              <div className="space-y-2">
                {previousAddresses.map((address, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="delivery-address"
                      value={address}
                      checked={selectedAddress === address}
                      onChange={() => setSelectedAddress(address)}
                      className="mt-1"
                    />
                    <Label htmlFor={`address-${index}`} className="block">
                      {address}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No previous addresses found</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="save-to-client"
              checked={saveToClientMaster}
              onCheckedChange={checked => setSaveToClientMaster(checked)}
            />
            <Label htmlFor="save-to-client">Save to Client Master</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeliveryDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddressSelect} disabled={!selectedAddress}>
            Select Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}