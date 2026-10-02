// features/locationApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount path: /api/v1/location
const LOCATION_URL = "/v1/location";

export const locationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // FORWARD GEOCODING
    // =====================================================================

    // GET /api/v1/location/search?q=GRA+Port+Harcourt&limit=5
    // Resolves a location name to coordinates and address.
    searchLocation: builder.query({
      query: ({ q, limit = 5 }) => ({
        url: `${LOCATION_URL}/search`,
        method: "GET",
        params: { q, limit },
      }),
      providesTags: (_result, _err, { q }) => [
        { type: "LocationSearch", id: q },
      ],
      // Optional: keep cached for 5 min since geocoding rarely changes
      keepUnusedDataFor: 300,
    }),

    // =====================================================================
    // REVERSE GEOCODING
    // =====================================================================

    // GET /api/v1/location/reverse?lat=4.8156&lon=7.0498
    // Resolves coordinates to a human-readable address.
    reverseGeocode: builder.query({
      query: ({ lat, lon }) => ({
        url: `${LOCATION_URL}/reverse`,
        method: "GET",
        params: { lat, lon },
      }),
      providesTags: (_result, _err, { lat, lon }) => [
        { type: "LocationReverse", id: `${lat},${lon}` },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useSearchLocationQuery,
  useLazySearchLocationQuery,
  useReverseGeocodeQuery,
  useLazyReverseGeocodeQuery,
} = locationApiSlice;