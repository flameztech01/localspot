// features/discoveryApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount path: /api/v1/discovery
const DISCOVERY_URL = "/v1/discovery";

export const discoveryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // AGGREGATED HOMEPAGE
    // =====================================================================

    // GET /api/v1/discovery/home
    // Returns categories + featured + popular + promotions + advertisements
    getHomeData: builder.query({
      query: () => ({
        url: `${DISCOVERY_URL}/home`,
        method: "GET",
      }),
      providesTags: ["DiscoveryHome"],
    }),

    // =====================================================================
    // SEARCH
    // =====================================================================

    // GET /api/v1/discovery/search?q=&category=&location=&rating=&priceRange=&openNow=&sort=&page=&limit=
    searchBusinesses: builder.query({
      query: (params = {}) => ({
        url: `${DISCOVERY_URL}/search`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.businesses
          ? [
              ...result.businesses.map(({ id }) => ({
                type: "Business",
                id,
              })),
              "SearchResults",
            ]
          : ["SearchResults"],
    }),

    // =====================================================================
    // CATEGORIES
    // =====================================================================

    // GET /api/v1/discovery/categories
    listCategories: builder.query({
      query: () => ({
        url: `${DISCOVERY_URL}/categories`,
        method: "GET",
      }),
      providesTags: ["CategoryList"],
    }),

    // GET /api/v1/discovery/category/:slug?location=&rating=&priceRange=&openNow=&sort=&page=&limit=
    getBusinessesByCategory: builder.query({
      query: ({ slug, ...params }) => ({
        url: `${DISCOVERY_URL}/category/${slug}`,
        method: "GET",
        params,
      }),
      providesTags: (_result, _err, { slug }) => [
        { type: "Category", id: slug },
        "BusinessList",
      ],
    }),

    // =====================================================================
    // CURATED SECTIONS
    // =====================================================================

    // GET /api/v1/discovery/featured?page=&limit=
    getFeaturedBusinesses: builder.query({
      query: (params = {}) => ({
        url: `${DISCOVERY_URL}/featured`,
        method: "GET",
        params,
      }),
      providesTags: ["FeaturedBusinesses"],
    }),

    // GET /api/v1/discovery/popular?page=&limit=
    getPopularBusinesses: builder.query({
      query: (params = {}) => ({
        url: `${DISCOVERY_URL}/popular`,
        method: "GET",
        params,
      }),
      providesTags: ["PopularBusinesses"],
    }),

    // GET /api/v1/discovery/promotions?page=&limit=
    getActivePromotions: builder.query({
      query: (params = {}) => ({
        url: `${DISCOVERY_URL}/promotions`,
        method: "GET",
        params,
      }),
      providesTags: ["ActivePromotions"],
    }),

    // GET /api/v1/discovery/advertisements?page=&limit=
    getActiveAdvertisements: builder.query({
      query: (params = {}) => ({
        url: `${DISCOVERY_URL}/advertisements`,
        method: "GET",
        params,
      }),
      providesTags: ["ActiveAdvertisements"],
    }),
  }),
});

export const {
  useGetHomeDataQuery,
  useSearchBusinessesQuery,
  useListCategoriesQuery,
  useGetBusinessesByCategoryQuery,
  useGetFeaturedBusinessesQuery,
  useGetPopularBusinessesQuery,
  useGetActivePromotionsQuery,
  useGetActiveAdvertisementsQuery,
} = discoveryApiSlice;