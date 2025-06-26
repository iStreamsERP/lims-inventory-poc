import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";

export default function BillingInfoCard({
  orderForm,
  clientDetails,
  isBillingModalOpen,
  setIsBillingModalOpen,
  handleBillingChange,
  handleClientDetailsChange,
  setSelectedCountry,
  setSelectedState,
  countries,
  states,
  cities,
  addBillingToClient,
  setAddBillingToClient,
  handleBillingSubmit,
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Billing Information</CardTitle>

          {/* Fixed: Only show Change button when client is selected */}
          {orderForm.CLIENT_NAME && (
            <Dialog
              open={isBillingModalOpen}
              onOpenChange={setIsBillingModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">Update</Button>
              </DialogTrigger>
              <DialogContent className="z-[999] max-h-[95vh] max-w-5xl overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Edit Billing Information</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleBillingSubmit}
                  className="space-y-2"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="CLIENT_NAME">Client Name</Label>
                      <Input
                        id="CLIENT_NAME"
                        value={orderForm.CLIENT_NAME}
                        readOnly
                        className="w-full bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="EMAIL_ADDRESS">Email</Label>
                      <Input
                        id="EMAIL_ADDRESS"
                        value={orderForm.EMAIL_ADDRESS}
                        readOnly
                        className="w-full bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="CLIENT_CONTACT">Phone</Label>
                      <Input
                        id="CLIENT_CONTACT"
                        value={orderForm.CLIENT_CONTACT}
                        readOnly
                        className="w-full bg-gray-100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="COUNTRY">Country</Label>
                      <Select
                        value={clientDetails.COUNTRY}
                        onValueChange={(value) => {
                          const countryObj = countries.find((c) => c.name === value);
                          if (countryObj) setSelectedCountry(countryObj.isoCode);
                          handleClientDetailsChange("COUNTRY", value);
                        }}
                        disabled={true}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          {countries.map((country) => (
                            <SelectItem
                              key={country.isoCode}
                              value={country.name}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="STATE_NAME">State</Label>
                      <Select
                        value={orderForm.STATE_NAME}
                        onValueChange={(value) => {
                          const stateObj = states.find((s) => s.name === value);
                          if (stateObj) setSelectedState(stateObj.isoCode);
                          handleBillingChange("STATE_NAME", value);
                        }}
                        disabled={true}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          {states.map((state) => (
                            <SelectItem
                              key={state.isoCode}
                              value={state.name}
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="CITY_NAME">City</Label>
                      <Select
                        value={orderForm.CITY_NAME}
                        onValueChange={(value) => handleBillingChange("CITY_NAME", value)}
                        disabled={true}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          {cities.map((city, index) => (
                            <SelectItem
                              key={index}
                              value={city.name}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={orderForm?.zipCode}
                        onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="CLIENT_ADDRESS">Address</Label>
                      <Textarea
                        id="CLIENT_ADDRESS"
                        value={orderForm.CLIENT_ADDRESS}
                        onChange={(e) => handleBillingChange("CLIENT_ADDRESS", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="add-to-client"
                      checked={addBillingToClient}
                      onCheckedChange={setAddBillingToClient}
                    />
                    <Label htmlFor="add-to-client">Save changes to Client Master</Label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsBillingModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {orderForm.CLIENT_NAME ? (
          <div className="space-y-2 text-sm">
            <p className="text-lg font-medium">{orderForm.CLIENT_NAME}</p>
            <p>{orderForm.CLIENT_ADDRESS}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Select a customer to view billing information</p>
        )}
      </CardContent>
    </Card>
  );
}
