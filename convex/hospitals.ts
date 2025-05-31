import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const getNearbyHospitals = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    radius: v.optional(v.number()), // radius in kilometers, default 10km
    type: v.optional(v.string()),
    emergencyOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const radius = args.radius ?? 10;
    const hospitals = await ctx.db.query("hospitals").collect();
    
    let filteredHospitals = hospitals;
    
    // Filter by type if specified
    if (args.type) {
      filteredHospitals = filteredHospitals.filter(h => h.type === args.type);
    }
    
    // Filter by emergency only if specified
    if (args.emergencyOnly) {
      filteredHospitals = filteredHospitals.filter(h => h.isEmergency);
    }
    
    // Calculate distances and filter by radius
    const hospitalsWithDistance = filteredHospitals
      .map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          args.latitude,
          args.longitude,
          hospital.latitude,
          hospital.longitude
        )
      }))
      .filter(hospital => hospital.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
    
    return hospitalsWithDistance;
  },
});

export const searchHospitals = query({
  args: {
    searchTerm: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    type: v.optional(v.string()),
    emergencyOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("hospitals")
      .withSearchIndex("search_hospitals", (q) => {
        let query = q.search("name", args.searchTerm);
        if (args.type) {
          query = query.eq("type", args.type);
        }
        if (args.emergencyOnly) {
          query = query.eq("isEmergency", args.emergencyOnly);
        }
        return query;
      })
      .collect();

    // Add distance if coordinates provided
    if (args.latitude && args.longitude) {
      results = results.map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          args.latitude!,
          args.longitude!,
          hospital.latitude,
          hospital.longitude
        )
      })).sort((a, b) => a.distance - b.distance);
    }

    return results;
  },
});

export const getHospitalById = query({
  args: { hospitalId: v.id("hospitals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.hospitalId);
  },
});

export const saveUserLocation = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Check if user already has a location record
    const existingLocation = await ctx.db
      .query("userLocations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingLocation) {
      // Update existing location
      await ctx.db.patch(existingLocation._id, {
        latitude: args.latitude,
        longitude: args.longitude,
        address: args.address,
        lastUpdated: Date.now(),
      });
      return existingLocation._id;
    } else {
      // Create new location record
      return await ctx.db.insert("userLocations", {
        userId,
        latitude: args.latitude,
        longitude: args.longitude,
        address: args.address,
        lastUpdated: Date.now(),
      });
    }
  },
});

export const getUserLocation = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("userLocations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Seed function to add sample hospitals (for development)
export const seedHospitals = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Check if hospitals already exist
    const existingHospitals = await ctx.db.query("hospitals").first();
    if (existingHospitals) {
      return "Hospitals already seeded";
    }

    const sampleHospitals = [
      {
        name: "City General Hospital",
        address: "123 Main St, Downtown",
        phone: "+1-555-0101",
        email: "info@citygeneral.com",
        website: "https://citygeneral.com",
        latitude: 40.7128,
        longitude: -74.0060,
        type: "general",
        services: ["Emergency", "Surgery", "Cardiology", "Pediatrics"],
        rating: 4.2,
        isEmergency: true,
        operatingHours: {
          monday: "24/7",
          tuesday: "24/7",
          wednesday: "24/7",
          thursday: "24/7",
          friday: "24/7",
          saturday: "24/7",
          sunday: "24/7",
        },
      },
      {
        name: "St. Mary's Medical Center",
        address: "456 Oak Ave, Midtown",
        phone: "+1-555-0102",
        email: "contact@stmarys.org",
        website: "https://stmarys.org",
        latitude: 40.7589,
        longitude: -73.9851,
        type: "general",
        services: ["Emergency", "Maternity", "Oncology", "Orthopedics"],
        rating: 4.5,
        isEmergency: true,
        operatingHours: {
          monday: "24/7",
          tuesday: "24/7",
          wednesday: "24/7",
          thursday: "24/7",
          friday: "24/7",
          saturday: "24/7",
          sunday: "24/7",
        },
      },
      {
        name: "Riverside Clinic",
        address: "789 River Rd, Riverside",
        phone: "+1-555-0103",
        email: "appointments@riverside.com",
        latitude: 40.7282,
        longitude: -74.0776,
        type: "clinic",
        services: ["General Practice", "Vaccinations", "Health Checkups"],
        rating: 4.0,
        isEmergency: false,
        operatingHours: {
          monday: "8:00 AM - 6:00 PM",
          tuesday: "8:00 AM - 6:00 PM",
          wednesday: "8:00 AM - 6:00 PM",
          thursday: "8:00 AM - 6:00 PM",
          friday: "8:00 AM - 6:00 PM",
          saturday: "9:00 AM - 2:00 PM",
          sunday: "Closed",
        },
      },
      {
        name: "Heart Specialty Center",
        address: "321 Cardiac Way, Medical District",
        phone: "+1-555-0104",
        email: "info@heartcenter.com",
        website: "https://heartcenter.com",
        latitude: 40.7505,
        longitude: -73.9934,
        type: "specialty",
        services: ["Cardiology", "Cardiac Surgery", "Heart Transplant"],
        rating: 4.8,
        isEmergency: false,
        operatingHours: {
          monday: "7:00 AM - 7:00 PM",
          tuesday: "7:00 AM - 7:00 PM",
          wednesday: "7:00 AM - 7:00 PM",
          thursday: "7:00 AM - 7:00 PM",
          friday: "7:00 AM - 7:00 PM",
          saturday: "8:00 AM - 4:00 PM",
          sunday: "Closed",
        },
      },
      {
        name: "Emergency Care Plus",
        address: "555 Quick St, Emergency District",
        phone: "+1-555-0105",
        latitude: 40.7411,
        longitude: -74.0023,
        type: "emergency",
        services: ["Emergency Care", "Trauma", "Urgent Care"],
        rating: 4.1,
        isEmergency: true,
        operatingHours: {
          monday: "24/7",
          tuesday: "24/7",
          wednesday: "24/7",
          thursday: "24/7",
          friday: "24/7",
          saturday: "24/7",
          sunday: "24/7",
        },
      },
    ];

    for (const hospital of sampleHospitals) {
      await ctx.db.insert("hospitals", hospital);
    }

    return `Seeded ${sampleHospitals.length} hospitals`;
  },
});
