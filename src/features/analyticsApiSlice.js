// features/analyticsApiSlice.js
import { apiSlice } from "./apiSlice.js";

const ANALYTICS_URL = "/v1/analytics";

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // BUSINESS — /api/v1/analytics/business
    // =====================================================================

    // GET /api/v1/analytics/business
    // Analytics for the currently authenticated business
    getBusinessAnalytics: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/business`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsBusiness"],
    }),

    // =====================================================================
    // ADMIN — /api/v1/analytics/admin/*
    // =====================================================================

    // GET /api/v1/analytics/admin/overview
    getAdminAnalyticsOverview: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/admin/overview`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsAdminOverview"],
    }),

    // GET /api/v1/analytics/admin/traffic
    getAdminAnalyticsTraffic: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/admin/traffic`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsAdminTraffic"],
    }),

    // GET /api/v1/analytics/admin/businesses
    getAdminAnalyticsBusinesses: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/admin/businesses`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsAdminBusinesses"],
    }),

    // GET /api/v1/analytics/admin/categories
    getAdminAnalyticsCategories: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/admin/categories`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsAdminCategories"],
    }),

    // GET /api/v1/analytics/admin/locations
    getAdminAnalyticsLocations: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/admin/locations`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsAdminLocations"],
    }),

    // GET /api/v1/analytics/admin/advertising
    getAdminAnalyticsAdvertising: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/admin/advertising`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsAdminAdvertising"],
    }),

    // GET /api/v1/analytics/admin/revenue
    getAdminAnalyticsRevenue: builder.query({
      query: (params = {}) => ({
        url: `${ANALYTICS_URL}/admin/revenue`,
        method: "GET",
        params,
      }),
      providesTags: ["AnalyticsAdminRevenue"],
    }),
  }),
});

export const {
  // Business
  useGetBusinessAnalyticsQuery,

  // Admin
  useGetAdminAnalyticsOverviewQuery,
  useGetAdminAnalyticsTrafficQuery,
  useGetAdminAnalyticsBusinessesQuery,
  useGetAdminAnalyticsCategoriesQuery,
  useGetAdminAnalyticsLocationsQuery,
  useGetAdminAnalyticsAdvertisingQuery,
  useGetAdminAnalyticsRevenueQuery,
} = analyticsApiSlice;