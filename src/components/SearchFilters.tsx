interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  emergencyOnly: boolean;
  onEmergencyChange: (value: boolean) => void;
  radius: number;
  onRadiusChange: (value: number) => void;
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  emergencyOnly,
  onEmergencyChange,
  radius,
  onRadiusChange,
}: SearchFiltersProps) {
  const hospitalTypes = [
    { value: "", label: "All Types" },
    { value: "general", label: "General Hospital" },
    { value: "specialty", label: "Specialty Center" },
    { value: "emergency", label: "Emergency Care" },
    { value: "clinic", label: "Clinic" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Hospitals
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name..."
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hospital Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white shadow-sm"
        >
          {hospitalTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Radius (km)
        </label>
        <select
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white shadow-sm"
        >
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
          <option value={20}>20 km</option>
          <option value={50}>50 km</option>
        </select>
      </div>

      <div className="flex items-center lg:justify-center">
        <label className="flex items-center space-x-3 mt-6 cursor-pointer">
          <input
            type="checkbox"
            checked={emergencyOnly}
            onChange={(e) => onEmergencyChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 transition-all duration-200"
          />
          <span className="text-sm font-medium text-gray-700 select-none">
            🚨 Emergency Only
          </span>
        </label>
      </div>
    </div>
  );
}
