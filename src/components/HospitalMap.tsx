import { useState } from "react";

interface Hospital {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  latitude: number;
  longitude: number;
  type: string;
  services: string[];
  rating?: number;
  isEmergency: boolean;
  distance?: number;
}

interface HospitalMapProps {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  hospitals: Hospital[];
}

export function HospitalMap({ userLocation, hospitals }: HospitalMapProps) {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const getTypeIcon = (type: string, isEmergency: boolean) => {
    if (isEmergency) return "🚨";
    switch (type) {
      case "general": return "🏥";
      case "specialty": return "⚕️";
      case "emergency": return "🚑";
      case "clinic": return "🩺";
      default: return "🏥";
    }
  };

  const getTypeColor = (type: string, isEmergency: boolean) => {
    if (isEmergency) return "bg-red-500";
    switch (type) {
      case "general": return "bg-blue-500";
      case "specialty": return "bg-purple-500";
      case "emergency": return "bg-red-500";
      case "clinic": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  // Simple map visualization using CSS positioning
  // In a real app, you'd use Google Maps, Mapbox, or similar
  const mapBounds = hospitals.length > 0 ? {
    minLat: Math.min(userLocation.latitude, ...hospitals.map(h => h.latitude)) - 0.01,
    maxLat: Math.max(userLocation.latitude, ...hospitals.map(h => h.latitude)) + 0.01,
    minLng: Math.min(userLocation.longitude, ...hospitals.map(h => h.longitude)) - 0.01,
    maxLng: Math.max(userLocation.longitude, ...hospitals.map(h => h.longitude)) + 0.01,
  } : {
    minLat: userLocation.latitude - 0.05,
    maxLat: userLocation.latitude + 0.05,
    minLng: userLocation.longitude - 0.05,
    maxLng: userLocation.longitude + 0.05,
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="h-full relative bg-gray-50 min-h-[500px]">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 border border-gray-200 rounded-lg overflow-hidden">
        {/* User Location */}
        <div
          className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={getPosition(userLocation.latitude, userLocation.longitude)}
          title="Your Location"
        >
          <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Hospital Markers */}
        {hospitals.map((hospital) => (
          <div
            key={hospital._id}
            className={`absolute w-8 h-8 ${getTypeColor(hospital.type, hospital.isEmergency)} rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform z-10 flex items-center justify-center text-white text-sm`}
            style={getPosition(hospital.latitude, hospital.longitude)}
            onClick={() => setSelectedHospital(hospital)}
            title={hospital.name}
          >
            {getTypeIcon(hospital.type, hospital.isEmergency)}
          </div>
        ))}

        {/* Grid lines for visual reference */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
          ))}
        </div>
      </div>

      {/* Hospital Details Panel */}
      {selectedHospital && (
        <div className="absolute top-4 right-4 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-30 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {getTypeIcon(selectedHospital.type, selectedHospital.isEmergency)} {selectedHospital.name}
            </h3>
            <button
              onClick={() => setSelectedHospital(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">📍 {selectedHospital.address}</p>
            
            {selectedHospital.phone && (
              <p className="text-gray-600">📞 {selectedHospital.phone}</p>
            )}
            
            {selectedHospital.distance && (
              <p className="text-gray-600">📏 {selectedHospital.distance.toFixed(1)} km away</p>
            )}
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs text-white ${getTypeColor(selectedHospital.type, selectedHospital.isEmergency)}`}>
                {selectedHospital.type.charAt(0).toUpperCase() + selectedHospital.type.slice(1)}
              </span>
              {selectedHospital.isEmergency && (
                <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                  Emergency
                </span>
              )}
              {selectedHospital.rating && (
                <span className="text-yellow-500">
                  ⭐ {selectedHospital.rating}
                </span>
              )}
            </div>
            
            {selectedHospital.services.length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedHospital.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}`;
                window.open(url, '_blank');
              }}
              className="flex-1 px-3 py-2 bg-primary text-white rounded text-sm hover:bg-primary-hover"
            >
              🗺️ Directions
            </button>
            {selectedHospital.phone && (
              <button
                onClick={() => window.open(`tel:${selectedHospital.phone}`, '_self')}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                📞 Call
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-30 max-w-[200px]">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>General Hospital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Specialty Center</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Emergency Care</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Clinic</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-30 max-w-xs hidden md:block">
        <p className="text-xs text-gray-600">
          💡 Click markers for details. Simplified map view.
        </p>
      </div>
    </div>
  );
}
