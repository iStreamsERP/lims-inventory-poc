import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Navigation, Loader2, RefreshCw, Search, CheckCircle, AlertCircle, X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import MapLocationPicker from "../MapLocationPicker";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Mock data for countries
const mockCountries = [
  { name: "India", isoCode: "IN" },
  { name: "United States", isoCode: "US" },
  { name: "United Kingdom", isoCode: "GB" },
  { name: "Canada", isoCode: "CA" },
  { name: "Australia", isoCode: "AU" },
];

// Enhanced NewAddressDialog Component
export default function NewAddressDialog({
  isNewAddressDialogOpen,
  setIsNewAddressDialogOpen,
  newAddressForm,
  handleNewAddressChange,
  countries = mockCountries,
  getCurrentLocationForNewAddress,
  isNewAddressLocating,
  newAddressLocationError,
  saveNewAddressToClient,
  setSaveNewAddressToClient,
  handleSaveNewAddress,
  orderForm,
}) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!newAddressForm.address || newAddressForm.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters long";
    }

    if (!newAddressForm.city || newAddressForm.city.trim().length < 2) {
      errors.city = "City is required";
    }

    if (!newAddressForm.country) {
      errors.country = "Country is required";
    }

    if (newAddressForm.zipCode && newAddressForm.zipCode.length > 0 && newAddressForm.zipCode.length < 3) {
      errors.zipCode = "ZIP code must be at least 3 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLocationSelect = (locationData) => {
    const { address, detailedAddress, coordinates } = locationData;

    // Auto-fill form with detailed address information
    if (detailedAddress) {
      const fullAddress = detailedAddress.formattedAddress || address;
      const streetAddress =
        detailedAddress.streetNumber && detailedAddress.route
          ? `${detailedAddress.streetNumber} ${detailedAddress.route}`
          : detailedAddress.route || "";

      handleNewAddressChange("address", fullAddress);
      handleNewAddressChange("streetAddress", streetAddress);
      handleNewAddressChange("neighborhood", detailedAddress.neighborhood || "");
      handleNewAddressChange("city", detailedAddress.city || "");
      handleNewAddressChange("state", detailedAddress.state || "");
      handleNewAddressChange("zipCode", detailedAddress.zipCode || "");

      // Auto-select country if found in our list
      const foundCountry = countries.find((c) => c.name.toLowerCase().includes(detailedAddress.country?.toLowerCase() || ""));
      if (foundCountry) {
        handleNewAddressChange("country", foundCountry.name);
      }

      setLocationAccuracy("high");
    } else {
      handleNewAddressChange("address", address);
      setLocationAccuracy("medium");
    }

    setSelectedMapLocation(coordinates);
    // Clear validation errors when location is selected
    setValidationErrors({});
  };

  const handleUseMapPicker = () => {
    setIsMapOpen(true);
  };

  const handleSaveWithValidation = () => {
    if (validateForm()) {
      handleSaveNewAddress();
    }
  };

  const handleFieldChange = (field, value) => {
    handleNewAddressChange(field, value);
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  return (
    <>
      <Dialog
        open={isNewAddressDialogOpen}
        onOpenChange={setIsNewAddressDialogOpen}
      >
        <DialogContent className="z-[999] max-h-[95vh] max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                Add New Delivery Address
              </div>

              <div className="grid grid-cols-1 gap-2 pr-4 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex h-8 items-center justify-center gap-2"
                  onClick={getCurrentLocationForNewAddress}
                  disabled={isNewAddressLocating}
                >
                  {isNewAddressLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                  {isNewAddressLocating ? "Detecting..." : "Auto-Detect"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex h-8 items-center justify-center gap-2"
                  onClick={handleUseMapPicker}
                >
                  <MapPin className="h-4 w-4" />
                  Pick
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div
            className="space-y-2 overflow-y-auto pr-2"
            style={{ maxHeight: "calc(95vh - 140px)" }}
          >
            {/* Location Picker Buttons */}
            <div className="space-y-2">
              {newAddressLocationError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{newAddressLocationError}</p>
                </div>
              )}
            </div>

            {/* Location Accuracy Indicator */}
            {locationAccuracy && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {locationAccuracy === "high" ? "Exact Location Selected" : "Location Selected"}
                  </p>
                  <p className="text-xs text-green-600">
                    {selectedMapLocation && `Coordinates: ${selectedMapLocation.lat.toFixed(6)}, ${selectedMapLocation.lng.toFixed(6)}`}
                  </p>
                </div>
              </div>
            )}

            {/* Address Form */}
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="new-address"
                  className="flex items-center gap-2"
                >
                  Complete Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="new-address"
                  value={newAddressForm.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  className={`w-full ${validationErrors.address ? "border-red-500" : ""}`}
                  placeholder="Enter complete address or use location picker above"
                  rows={3}
                  required
                />
                {validationErrors.address && <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>}
              </div>

              {/* Additional Address Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="new-street">Street Address</Label>
                  <Input
                    id="new-street"
                    value={newAddressForm.streetAddress || ""}
                    onChange={(e) => handleFieldChange("streetAddress", e.target.value)}
                    placeholder="House/Building number and street"
                  />
                </div>

                <div>
                  <Label htmlFor="new-neighborhood">Area/Neighborhood</Label>
                  <Input
                    id="new-neighborhood"
                    value={newAddressForm.neighborhood || ""}
                    onChange={(e) => handleFieldChange("neighborhood", e.target.value)}
                    placeholder="Locality or area name"
                  />
                </div>

                <div>
                  <Label htmlFor="new-city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="new-city"
                    value={newAddressForm.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    className={validationErrors.city ? "border-red-500" : ""}
                    placeholder="Enter city"
                    required
                  />
                  {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="new-state">State/Province</Label>
                  <Input
                    id="new-state"
                    value={newAddressForm.state}
                    onChange={(e) => handleFieldChange("state", e.target.value)}
                    placeholder="Enter state or province"
                  />
                </div>

                <div>
                  <Label htmlFor="new-country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newAddressForm.country}
                    onValueChange={(value) => {
                      handleFieldChange("country", value);
                      // Reset dependent fields when country changes
                      if (newAddressForm.country !== value) {
                        handleFieldChange("state", "");
                        handleFieldChange("city", "");
                      }
                    }}
                    
                  >
                    <SelectTrigger className={validationErrors.country ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="z-[999]">
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
                  <Label htmlFor="new-zip">ZIP/Postal Code</Label>
                  <Input
                    id="new-zip"
                    value={newAddressForm.zipCode}
                    onChange={(e) => handleNewAddressChange("zipCode", e.target.value)}
                    placeholder="Enter ZIP or postal code"
                  />
                </div>
              </div>
            </div>

            {/* Save to Client Option */}
            {orderForm?.CLIENT_ID && (
              <div className="flex items-center space-x-2 rounded-lg border p-3">
                <Checkbox
                  id="save-new-address"
                  checked={saveNewAddressToClient}
                  onCheckedChange={(checked) => setSaveNewAddressToClient(checked)}
                />
                <Label
                  htmlFor="save-new-address"
                  className="text-sm"
                >
                  Save this address to client profile for future orders
                </Label>
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsNewAddressDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveWithValidation}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MapLocationPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={selectedMapLocation}
      />
    </>
  );
}
