import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";
import MapLocationPicker from "../MapLocationPicker";
import { State } from "country-state-city";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AddDeliveryAddressDialog({ isNewAddressDialogOpen, setIsNewAddressDialogOpen, countries, onSave }) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [newAddressForm, setNewAddressForm] = useState(initialNewAddressForm());
  const [isNewAddressLocating, setIsNewAddressLocating] = useState(false);
  const [newAddressLocationError, setNewAddressLocationError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

          if (data.address) {
            const addr = data.address;
            const country = countries.find((c) => c.isoCode === (addr.country_code ? addr.country_code.toUpperCase() : ""));
            const state = country ? State.getStatesOfCountry(country.isoCode).find((s) => s.name === addr.state || s.isoCode === addr.state) : null;
            const city = addr.city || addr.town || addr.village || addr.county;

            const fullAddress = [addr.road || "", addr.house_number || "", city, addr.state, country?.name || addr.country, addr.postcode || ""]
              .filter(Boolean)
              .join(", ");

            setNewAddressForm({
              address: fullAddress,
              streetAddress: [addr.road, addr.house_number].filter(Boolean).join(" "),
              neighborhood: addr.neighbourhood || addr.suburb || "",
              country: country?.name || "",
              state: state?.name || "",
              city: city || "",
              zipCode: addr.postcode || "",
              GPS_LOCATION: `${latitude}, ${longitude}`,
              GPS_LATITUDE: latitude.toString(),
              GPS_LONGITUDE: longitude.toString(),
            });
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

      setNewAddressForm((prev) => ({
        ...prev,
        address: fullAddress,
        streetAddress: streetAddress,
        neighborhood: detailedAddress.neighborhood || "",
        city: detailedAddress.city || "",
        state: detailedAddress.state || "",
        zipCode: detailedAddress.zipCode || "",
        country: countries.find((c) => c.name.toLowerCase().includes(detailedAddress.country?.toLowerCase() || ""))?.name || prev.country,
        GPS_LOCATION: coordinates ? `${coordinates.lat}, ${coordinates.lng}` : "",
        GPS_LATITUDE: coordinates?.lat.toString() || "",
        GPS_LONGITUDE: coordinates?.lng.toString() || "",
      }));

      setLocationAccuracy("high");
    } else {
      setNewAddressForm((prev) => ({
        ...prev,
        address: address,
        GPS_LOCATION: coordinates ? `${coordinates.lat}, ${coordinates.lng}` : "",
        GPS_LATITUDE: coordinates?.lat.toString() || "",
        GPS_LONGITUDE: coordinates?.lng.toString() || "",
      }));
      setLocationAccuracy("medium");
    }

    setSelectedMapLocation(coordinates);
    // Clear validation errors when location is selected
    setValidationErrors({});
  };

  const handleSaveWithValidation = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSave({
        DELIVERY_ADDRESS: newAddressForm.address,
        GPS_LOCATION: newAddressForm.GPS_LOCATION,
        GPS_LATITUDE: newAddressForm.GPS_LATITUDE,
        GPS_LONGITUDE: newAddressForm.GPS_LONGITUDE,
      });

      // Reset form on successful save
      setNewAddressForm(initialNewAddressForm());
      setSelectedMapLocation(null);
      setLocationAccuracy(null);
      setIsNewAddressDialogOpen(false);
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setNewAddressForm((prev) => {
      const updatedForm = { ...prev, [field]: value };

      // Generate complete address by concatenating fields
      const completeAddress = [
        updatedForm.streetAddress,
        updatedForm.neighborhood,
        updatedForm.city,
        updatedForm.state,
        updatedForm.country,
        updatedForm.zipCode,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        ...updatedForm,
        address: completeAddress,
      };
    });

    // Clear validation error for this field
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
                  onClick={() => setIsMapOpen(true)}
                >
                  <MapPin className="h-4 w-4" />
                  Pick on Map
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div
            className="space-y-2 overflow-y-auto p-1"
            style={{ maxHeight: "calc(95vh - 140px)" }}
          >
            {/* Location Error */}
            {newAddressLocationError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{newAddressLocationError}</p>
              </div>
            )}

            {/* Location Accuracy Indicator */}
            {locationAccuracy && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="text-green-600">
                  <MapPin className="h-4 w-4" />
                </div>
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
                    onValueChange={(value) => handleFieldChange("country", value)}
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
                  {validationErrors.country && <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>}
                </div>

                <div>
                  <Label htmlFor="new-zip">ZIP/Postal Code</Label>
                  <Input
                    id="new-zip"
                    value={newAddressForm.zipCode}
                    onChange={(e) => handleFieldChange("zipCode", e.target.value)}
                    placeholder="Enter ZIP or postal code"
                  />
                </div>

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
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsNewAddressDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveWithValidation}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Address"
              )}
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

function initialNewAddressForm() {
  return {
    address: "",
    streetAddress: "",
    neighborhood: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    GPS_LOCATION: "",
    GPS_LATITUDE: "",
    GPS_LONGITUDE: "",
  };
}
