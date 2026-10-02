// features/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL || ''}/api`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token; // 👈 get token from redux

    if (token) {
      headers.set('Authorization', `Bearer ${token}`); // 👈 attach token
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    // ─── Core auth ────────────────────────────────────────────────
    'User',
    'Admin',
    'AdminAuth',
    'BusinessAuth',

    // ─── Businesses (discovery + listings) ────────────────────────
    'Business',
    'BusinessList',
    'BusinessProfile',

    // ─── Categories ───────────────────────────────────────────────
    'Category',
    'CategoryList',

    // ─── Discovery / Home feed ────────────────────────────────────
    'DiscoveryHome',
    'SearchResults',
    'FeaturedBusinesses',
    'PopularBusinesses',
    'ActivePromotions',
    'ActiveAdvertisements',

    // ─── Advertisements ───────────────────────────────────────────
    'Advertisement',
    'AdvertisementList',
    'AdvertisementType',
    'AdvertisementSlot',
    'AdvertisementStats',
    'AdvertisementPerformance',

    // ─── Promotions ───────────────────────────────────────────────
    'Promotion',
    'PromotionList',
    'PromotionListMine',
    'AdminPromotionList',

    // ─── Analytics ────────────────────────────────────────────────
    'AnalyticsBusiness',
    'AnalyticsAdminOverview',
    'AnalyticsAdminTraffic',
    'AnalyticsAdminBusinesses',
    'AnalyticsAdminCategories',
    'AnalyticsAdminLocations',
    'AnalyticsAdminAdvertising',
    'AnalyticsAdminRevenue',

    // ─── Location / Geocoding ─────────────────────────────────────
    'LocationSearch',
    'LocationReverse',
  ],
  endpoints: (builder) => ({}),
});