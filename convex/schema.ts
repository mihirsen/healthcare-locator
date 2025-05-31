import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  hospitals: defineTable({
    name: v.string(),
    address: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    type: v.string(), // "general", "specialty", "emergency", "clinic"
    services: v.array(v.string()),
    rating: v.optional(v.number()),
    isEmergency: v.boolean(),
    operatingHours: v.object({
      monday: v.string(),
      tuesday: v.string(),
      wednesday: v.string(),
      thursday: v.string(),
      friday: v.string(),
      saturday: v.string(),
      sunday: v.string(),
    }),
  })
    .index("by_type", ["type"])
    .index("by_emergency", ["isEmergency"])
    .searchIndex("search_hospitals", {
      searchField: "name",
      filterFields: ["type", "isEmergency"],
    }),

  userLocations: defineTable({
    userId: v.id("users"),
    latitude: v.number(),
    longitude: v.number(),
    address: v.optional(v.string()),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
