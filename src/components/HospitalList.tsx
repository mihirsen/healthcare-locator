interface Hospital {
  _id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude: number;
  longitude: number;
  type: string;
  services: string[];
  rating?: number;
  isEmergency: boolean;
  distance?: number;
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

interface HospitalListProps {
  hospitals: Hospital[];
}

export function HospitalList({ hospitals }: HospitalListProps) {
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
    if (isEmergency) return "bg-red-100 text-red-800";
    switch (type) {
      case "general": return "bg-blue-100 text-blue-800";
      case "specialty": return "bg-purple-100 text-purple-800";
      case "emergency": return "bg-red-100 text-red-800";
      case "clinic": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrentDayHours = (operatingHours: Hospital['operatingHours']) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()] as keyof typeof operatingHours;
    return operatingHours[today];
  };

  if (hospitals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Hospitals Found</h2>
        <p className="text-gray-600 max-w-md">
          Try adjusting your search criteria or increasing the search radius to find more hospitals.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Found {hospitals.length} hospital{hospitals.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {hospitals.map((hospital) => (
          <div
            key={hospital._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">
                    {getTypeIcon(hospital.type, hospital.isEmergency)}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {hospital.name}
                  </h3>
                  {hospital.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-medium">{hospital.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(hospital.type, hospital.isEmergency)}`}>
                    {hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1)}
                  </span>
                  {hospital.isEmergency && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      🚨 Emergency
                    </span>
                  )}
                  {hospital.distance && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      📏 {hospital.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 mt-1">📍</span>
                  <span className="text-gray-700">{hospital.address}</span>
                </div>
                
                {hospital.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📞</span>
                    <a
                      href={`tel:${hospital.phone}`}
                      className="text-primary hover:underline"
                    >
                      {hospital.phone}
                    </a>
                  </div>
                )}
                
                {hospital.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">✉️</span>
                    <a
                      href={`mailto:${hospital.email}`}
                      className="text-primary hover:underline"
                    >
                      {hospital.email}
                    </a>
                  </div>
                )}
                
                {hospital.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">🌐</span>
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">🕒</span>
                  <span className="text-gray-700">
                    Today: {getCurrentDayHours(hospital.operatingHours)}
                  </span>
                </div>
              </div>
            </div>

            {hospital.services.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Services:</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;
                  window.open(url, '_blank');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-200 font-medium shadow-sm"
              >
                🗺️ Get Directions
              </button>
              
              {hospital.phone && (
                <button
                  onClick={() => window.open(`tel:${hospital.phone}`, '_self')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium shadow-sm"
                >
                  📞 Call Now
                </button>
              )}
              
              {hospital.website && (
                <button
                  onClick={() => window.open(hospital.website, '_blank')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium shadow-sm"
                >
                  🌐 Website
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
