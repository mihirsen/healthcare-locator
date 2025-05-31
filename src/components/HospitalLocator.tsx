import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { HospitalMap } from "./HospitalMap";
import { HospitalList } from "./HospitalList";
import { SearchFilters } from "./SearchFilters";

interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export function HospitalLocator() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [radius, setRadius] = useState(10);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const saveUserLocation = useMutation(api.hospitals.saveUserLocation);
  const seedHospitals = useMutation(api.hospitals.seedHospitals);
  const savedLocation = useQuery(api.hospitals.getUserLocation);

  const nearbyHospitals = useQuery(
    api.hospitals.getNearbyHospitals,
    userLocation
      ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius,
          type: selectedType || undefined,
          emergencyOnly: emergencyOnly || undefined,
        }
      : "skip"
  );

  const searchResults = useQuery(
    api.hospitals.searchHospitals,
    searchTerm.trim()
      ? {
          searchTerm: searchTerm.trim(),
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          type: selectedType || undefined,
          emergencyOnly: emergencyOnly || undefined,
        }
      : "skip"
  );

  const hospitals = searchTerm.trim() ? searchResults : nearbyHospitals;

  useEffect(() => {
    if (savedLocation && !userLocation) {
      setUserLocation({
        latitude: savedLocation.latitude,
        longitude: savedLocation.longitude,
        address: savedLocation.address,
      });
    }
  }, [savedLocation, userLocation]);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        
        try {
          // Try to get address from coordinates (reverse geocoding)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          const locationWithAddress = { ...location, address };
          setUserLocation(locationWithAddress);
          await saveUserLocation(locationWithAddress);
          toast.success("Location updated successfully");
        } catch (error) {
          setUserLocation(location);
          await saveUserLocation(location);
          toast.success("Location updated successfully");
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        let message = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleSeedHospitals = async () => {
    try {
      const result = await seedHospitals();
      toast.success(result);
    } catch (error) {
      toast.error("Failed to seed hospitals");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Controls */}
      <div className="bg-white border-b shadow-sm p-4 lg:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
            >
            {isLoadingLocation ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <span>📍</span>
            )}
              <span className="hidden sm:inline">{isLoadingLocation ? "Getting Location..." : "Get My Location"}</span>
              <span className="sm:hidden">{isLoadingLocation ? "Getting..." : "Location"}</span>
          </button>

            <button
              onClick={handleSeedHospitals}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-sm"
            >
              <span>🏥</span>
              <span className="hidden sm:inline">Add Sample Hospitals</span>
              <span className="sm:hidden">Sample Data</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
                  viewMode === "map"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span>🗺️</span>
                <span className="hidden sm:inline">Map</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
                  viewMode === "list"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span>📋</span>
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {userLocation && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-blue-600">📍</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">Current Location</p>
              <p className="text-xs text-blue-700 truncate">
                {userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
              </p>
            </div>
          </div>
        )}

        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          emergencyOnly={emergencyOnly}
          onEmergencyChange={setEmergencyOnly}
          radius={radius}
          onRadiusChange={setRadius}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-6">
        {!userLocation ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">📍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Location Required</h2>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              To find nearby hospitals, we need access to your location. Click the "Get My Location" button above to get started.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>🔒</span>
              <span>Your location data is secure and private</span>
            </div>
          </div>
        ) : viewMode === "map" ? (
          <HospitalMap
            userLocation={userLocation}
            hospitals={hospitals || []}
          />
        ) : (
          <HospitalList hospitals={hospitals || []} />
        )}
      </div>
    </div>
  );
}
