import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import { AlertCircle, CheckCircle, Loader2, MapPin, Navigation, RefreshCw, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const MapLocationPicker = ({ isOpen, onClose, onLocationSelect, initialLocation = null }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || { lat: 10.664373616586948, lng: 77.0085358655815 });
  const [address, setAddress] = useState("");
  const [detailedAddress, setDetailedAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapError, setMapError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const searchProviderRef = useRef(new OpenStreetMapProvider());

  // Parse OSM address components
  const parseOSMAddress = useCallback(
    (data) => {
      const address = data.address || {};
      return {
        streetNumber: address.house_number || "",
        route: address.road || "",
        neighborhood: address.neighbourhood || address.suburb || "",
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        country: address.country || "",
        zipCode: address.postcode || "",
        formattedAddress: data.display_name || "",
        coordinates: selectedLocation,
      };
    },
    [selectedLocation],
  );

  //   const reverseGeocode = useCallback(async (location) => {
  //     setIsLoadingAddress(true);
  //     try {
  //       const response = await fetch(
  //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=11.031262139900825&lon=77.01730533591581&zoom=26&addressdetails=1`,
  //         {
  //           headers: {
  //             "User-Agent": "LocationPickerApp/1.0",
  //           },
  //         },
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();

  //       console.log("data from reverse geocoding:", data);

  //       if (data.display_name) {
  //         setAddress(data.display_name);
  //         setDetailedAddress(parseOSMAddress(data));
  //       } else {
  //         setAddress("Unable to get address for this location");
  //         setDetailedAddress(null);
  //       }
  //     } catch (error) {
  //       console.error("Error with geocoding:", error);
  //       setAddress("Unable to get address for this location");
  //       setDetailedAddress(null);
  //     } finally {
  //       setIsLoadingAddress(false);
  //     }
  //   }, []);

  // Reverse geocoding with proper error handling and dynamic coordinates

  const reverseGeocode = useCallback(
    async (location) => {
      if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
        console.error("Invalid location for reverse geocoding:", location);
        return null;
      }

      setIsLoadingAddress(true);
      try {
        const apiKey = "pk.72a5e6405bd4a60a5a6d6111c7c339c0";
        // Use dynamic coordinates instead of hardcoded ones
        const response = await fetch(`https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${location.lat}&lon=${location.lng}&format=json`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const parsedAddress = parseOSMAddress(data);
        const street = data.address?.road || "Unnamed Road";
        const fullAddress = data.display_name || "";

        setAddress(fullAddress);
        setDetailedAddress(parsedAddress);

        return {
          street,
          fullAddress,
          city: data.address?.city || data.address?.town || data.address?.village || "",
          state: data.address?.state || "",
          country: data.address?.country || "",
          zip: data.address?.postcode || "",
          parsedAddress,
        };
      } catch (err) {
        console.error("LocationIQ Error:", err);
        setMapError("Failed to get address for this location. Please try another location.");
        return null;
      } finally {
        setIsLoadingAddress(false);
      }
    },
    [parseOSMAddress],
  );

  // Initialize map
  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {

      // Initialize map
      const map = L.map(mapRef.current, {
        center: [selectedLocation.lat, selectedLocation.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add zoom control
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add custom marker
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        draggable: true,
        title: "Drag me to select exact location",
      }).addTo(map);

      // Handle marker drag
      marker.on("dragend", (event) => {
        const newPosition = event.target.getLatLng();
        const location = {
          lat: newPosition.lat,
          lng: newPosition.lng,
        };
        setSelectedLocation(location);
        reverseGeocode(location);
      });

      // Handle map click
      map.on("click", (event) => {
        const newPosition = event.latlng;
        const location = {
          lat: newPosition.lat,
          lng: newPosition.lng,
        };
        marker.setLatLng(newPosition);
        setSelectedLocation(location);
        reverseGeocode(location);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setMapLoaded(true);
      setMapError(null);

      // Initial reverse geocoding
      reverseGeocode(selectedLocation);
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map. Please try again.");
      setMapLoaded(false);
    }
  }, [selectedLocation, reverseGeocode]);

  // Load map when dialog opens
  useEffect(() => {
    if (!isOpen) {
      // Clean up when dialog closes
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        setMapLoaded(false);
      }
      return;
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMap();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, initMap]);

  // Search for addresses
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoadingAddress(true);
    try {
      const results = await searchProviderRef.current.search({ query: searchQuery });
      setSearchResults(results);
      setMapError(null);
    } catch (error) {
      console.error("Error searching locations:", error);
      setMapError("Failed to search locations. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoadingAddress(false);
    }
  }, [searchQuery]);

  // Handle search result selection
  const handleSelectSearchResult = useCallback(
    (result) => {
      const newPosition = {
        lat: result.y,
        lng: result.x,
      };

      setSelectedLocation(newPosition);
      setSearchQuery(result.label);
      setSearchResults([]);

      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.setView([result.y, result.x], 16);
        markerRef.current.setLatLng([result.y, result.x]);
        reverseGeocode(newPosition);
      }
    },
    [reverseGeocode],
  );

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingAddress(true);
    setMapError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setSelectedLocation(newLocation);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([newLocation.lat, newLocation.lng], 16);
          markerRef.current.setLatLng([newLocation.lat, newLocation.lng]);
          reverseGeocode(newLocation);
        } else {
          setIsLoadingAddress(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your current location. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        setMapError(errorMessage);
        setIsLoadingAddress(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  }, [reverseGeocode]);

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      setMapError("Please select a location first.");
      return;
    }

    // Allow confirmation even without detailed address, but with basic coordinates
    const locationData = {
      coordinates: selectedLocation,
      address: address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
      detailedAddress: detailedAddress || {
        formattedAddress: address || "Custom location",
        coordinates: selectedLocation,
      },
      fullLocationData: {
        ...(detailedAddress || {}),
        coordinates: selectedLocation,
      },
    };

    onLocationSelect(locationData);
    onClose();
  };

  const handleClose = () => {
    setMapError(null);
    setSearchQuery("");
    setSearchResults([]);
    setAddress("");
    setDetailedAddress(null);
    onClose();
  };

  // Handle Enter key in search input
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="z-[999] max-h-screen max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Exact Delivery Location
          </DialogTitle>
        </DialogHeader>

        <div
          className="space-y-4 overflow-y-auto pr-2"
          style={{ maxHeight: "calc(95vh - 140px)" }}
        >
          {/* Error Display */}
          {mapError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <p className="text-sm text-red-600">{mapError}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMapError(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Search Box */}
          <div className="space-y-2">
            <Label>Search for an address</Label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Enter address, landmark, or business name..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isLoadingAddress || !searchQuery.trim()}
                >
                  {isLoadingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.x}-${result.y}-${index}`}
                      className="cursor-pointer p-3 transition-colors hover:bg-gray-50"
                      onClick={() => handleSelectSearchResult(result)}
                    >
                      <div className="flex items-start">
                        <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{result.label.split(",")[0]}</p>
                          <p className="truncate text-xs text-gray-500">{result.label.split(",").slice(1).join(",").trim()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isLoadingAddress}
              className="flex items-center gap-2"
            >
              {isLoadingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              Use Current Location
            </Button>
            <Button
              variant="outline"
              onClick={() => reverseGeocode(selectedLocation)}
              disabled={isLoadingAddress || !mapLoaded || !selectedLocation}
              className="flex items-center gap-2"
            >
              {isLoadingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh Address
            </Button>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div
              ref={mapRef}
              className="h-96 w-full rounded-lg border-2 border-gray-200"
              style={{ minHeight: "400px" }}
            >
              {!mapLoaded && !mapError && (
                <div className="flex h-full items-center justify-center rounded-lg bg-gray-100">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
                    <p className="text-sm text-gray-600">Loading interactive map...</p>
                  </div>
                </div>
              )}

              {mapError && !mapLoaded && (
                <div className="flex h-full items-center justify-center rounded-lg bg-gray-100">
                  <div className="text-center">
                    <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
                    <p className="text-sm text-gray-600">Map unavailable</p>
                    <p className="mt-1 text-xs text-gray-500">You can still search for locations</p>
                  </div>
                </div>
              )}
            </div>

            {mapLoaded && (
              <div className="pointer-events-none absolute bottom-4 left-4 right-4">
                <div className="rounded-lg bg-white/90 p-2 text-xs text-gray-600 backdrop-blur-sm">
                  💡 <strong>Tips:</strong> Search above, click on map, or drag the blue pin for exact location
                </div>
              </div>
            )}
          </div>

          {/* Address Display */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {detailedAddress ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : isLoadingAddress ? (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-2 font-medium text-gray-900">
                  {detailedAddress ? "Address Found" : isLoadingAddress ? "Getting Address..." : "Select Location"}
                </h4>

                {isLoadingAddress ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Fetching location details...</span>
                  </div>
                ) : address ? (
                  <div className="space-y-2">
                    <p className="break-words text-sm font-medium text-gray-700">{address}</p>

                    {detailedAddress && (
                      <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-gray-600 sm:grid-cols-2">
                        {detailedAddress.streetNumber && detailedAddress.route && (
                          <span className="break-words">
                            <strong>Street:</strong> {detailedAddress.streetNumber} {detailedAddress.route}
                          </span>
                        )}
                        {detailedAddress.neighborhood && (
                          <span className="break-words">
                            <strong>Area:</strong> {detailedAddress.neighborhood}
                          </span>
                        )}
                        {detailedAddress.city && (
                          <span className="break-words">
                            <strong>City:</strong> {detailedAddress.city}
                          </span>
                        )}
                        {detailedAddress.state && (
                          <span className="break-words">
                            <strong>State:</strong> {detailedAddress.state}
                          </span>
                        )}
                        {detailedAddress.zipCode && (
                          <span>
                            <strong>PIN:</strong> {detailedAddress.zipCode}
                          </span>
                        )}
                        {detailedAddress.country && (
                          <span className="break-words">
                            <strong>Country:</strong> {detailedAddress.country}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="font-mono text-xs text-gray-500">
                      📍 Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Click on the map or use search to select a location</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation || isLoadingAddress}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoadingAddress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Address...
              </>
            ) : (
              "Confirm Location"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapLocationPicker;
