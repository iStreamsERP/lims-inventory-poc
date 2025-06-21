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
import { State } from "country-state-city";
import { useAuth } from "@/contexts/AuthContext";
import { convertDataModelToStringData } from "@/utils/dataModelConverter";
import { callSoapService } from "@/api/callSoapService";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AddDeliveryAddressDialog({
  isNewAddressDialogOpen,
  setIsNewAddressDialogOpen,
  countries,
  orderForm,
  fetchPreviousAddresses,
}) {
  const { userData } = useAuth();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [newAddressForm, setNewAddressForm] = useState(initialNewAddressForm());
  const [isNewAddressLocating, setIsNewAddressLocating] = useState(false);
  const [newAddressLocationError, setNewAddressLocationError] = useState(null);

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

  const getCurrentLocationForNewAddress = () => {
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
          console.log(data);

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
              GPS_LOCATION: `${latitude}, ${longitude}`,
              GPS_LATITUDE: latitude.toString(),
              GPS_LONGITUDE: longitude.toString(),
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

    if (coordinates) {
      const { lat, lng } = coordinates;

      handleNewAddressChange("GPS_LOCATION", `${lat}, ${lng}`);
      handleNewAddressChange("GPS_LATITUDE", lat.toString());
      handleNewAddressChange("GPS_LONGITUDE", lng.toString());
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

  const handleNewAddressChange = (field, value) => {
    setNewAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveNewAddress = async () => {
    try {
      const salesOrderPayload = {
        UserName: userData.userEmail,
        DModelData: convertDataModelToStringData("SALES_ORDER_MASTER", {
          ...orderForm,
          DELIVERY_ADDRESS: newAddressForm.address,
          GPS_LOCATION: newAddressForm.GPS_LOCATION,
          GPS_LATITUDE: newAddressForm.GPS_LATITUDE,
          GPS_LONGITUDE: newAddressForm.GPS_LONGITUDE,
        }),
      };

      const response = await callSoapService(userData.clientURL, "DataModel_SaveData", salesOrderPayload);

      // ✅ Fetch updated addresses
      if (typeof fetchPreviousAddresses === "function") {
        fetchPreviousAddresses();
      }
    } catch (error) {
      console.error("Failed to save to SALES_ORDER_MASTER:", error);
    }

    setIsNewAddressDialogOpen(false);
    setNewAddressForm({
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      GPS_LOCATION: "",
      GPS_LATITUDE: "",
      GPS_LONGITUDE: "",
    });
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
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsNewAddressDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveWithValidation}>Save Address</Button>
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

function initialNewAddressForm() {
  return {
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    GPS_LOCATION: "",
    GPS_LATITUDE: "",
    GPS_LONGITUDE: "",
  };
}
