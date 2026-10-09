// features/savedPlaceApiSlice.js
import { apiSlice } from "./apiSlice.js";

const SAVED_URL = "/v1/saved-places";

export const savedPlaceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/saved-places  → full business objects
    listSavedPlaces: builder.query({
      query: () => ({
        url: SAVED_URL,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((b) => ({ type: "SavedPlace", id: b._id })),
              "SavedPlaces",
            ]
          : ["SavedPlaces"],
    }),

    // GET /api/v1/saved-places/ids  → array of IDs
    listSavedPlaceIds: builder.query({
      query: () => ({
        url: `${SAVED_URL}/ids`,
        method: "GET",
      }),
      providesTags: ["SavedPlaces"],
    }),

    // POST /api/v1/saved-places/:businessId
    savePlace: builder.mutation({
      query: (businessId) => ({
        url: `${SAVED_URL}/${businessId}`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, businessId) => [
        { type: "SavedPlace", id: businessId },
        "SavedPlaces",
      ],
    }),

    // DELETE /api/v1/saved-places/:businessId
    unsavePlace: builder.mutation({
      query: (businessId) => ({
        url: `${SAVED_URL}/${businessId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, businessId) => [
        { type: "SavedPlace", id: businessId },
        "SavedPlaces",
      ],
    }),

    // POST /api/v1/saved-places/:businessId/toggle
    toggleSavedPlace: builder.mutation({
      query: (businessId) => ({
        url: `${SAVED_URL}/${businessId}/toggle`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, businessId) => [
        { type: "SavedPlace", id: businessId },
        "SavedPlaces",
      ],
    }),
  }),
});

export const {
  useListSavedPlacesQuery,
  useListSavedPlaceIdsQuery,
  useSavePlaceMutation,
  useUnsavePlaceMutation,
  useToggleSavedPlaceMutation,
} = savedPlaceApiSlice;