// features/adsApiSlice.js
import { apiSlice } from "./apiSlice.js";

// All three share the /advertisements prefix
const PUBLIC_BASE   = "/advertisements";
const BUSINESS_BASE = "/advertisements/business";
const ADMIN_BASE    = "/advertisements/admin";

export const adsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // PUBLIC — types & slots
    // =====================================================================

    // GET /api/advertisements/types
    listAdvertisementTypes: builder.query({
      query: () => ({
        url: `${PUBLIC_BASE}/types`,
        method: "GET",
      }),
      providesTags: ["AdvertisementType"],
    }),

    // GET /api/advertisements/slots
    listAdvertisementSlots: builder.query({
      query: () => ({
        url: `${PUBLIC_BASE}/slots`,
        method: "GET",
      }),
      providesTags: ["AdvertisementSlot"],
    }),

    // =====================================================================
    // BUSINESS side — /api/advertisements/business
    // =====================================================================

    // POST /api/advertisements/business
    createAdvertisement: builder.mutation({
      query: (body) => ({
        url: BUSINESS_BASE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdvertisementList", "AdvertisementStats"],
    }),

    // GET /api/advertisements/business
    listMyAdvertisements: builder.query({
      query: () => ({
        url: BUSINESS_BASE,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Advertisement", id })),
              "AdvertisementList",
            ]
          : ["AdvertisementList"],
    }),

    // GET /api/advertisements/business/:id
    getMyAdvertisement: builder.query({
      query: (id) => ({
        url: `${BUSINESS_BASE}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Advertisement", id }],
    }),

    // PUT /api/advertisements/business/:id
    updateMyAdvertisement: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${BUSINESS_BASE}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Advertisement", id },
        "AdvertisementList",
      ],
    }),

    // POST /api/advertisements/business/:id/submit
    submitMyAdvertisement: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_BASE}/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Advertisement", id },
        "AdvertisementList",
        "AdvertisementStats",
      ],
    }),

    // POST /api/advertisements/business/:id/pause
    pauseMyAdvertisement: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_BASE}/${id}/pause`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Advertisement", id },
        "AdvertisementList",
      ],
    }),

    // POST /api/advertisements/business/:id/resume
    resumeMyAdvertisement: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_BASE}/${id}/resume`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Advertisement", id },
        "AdvertisementList",
      ],
    }),

    // DELETE /api/advertisements/business/:id
    deleteMyAdvertisement: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_BASE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Advertisement", id },
        "AdvertisementList",
        "AdvertisementStats",
      ],
    }),

    // GET /api/advertisements/business/:id/performance?from=&to=
    getMyAdvertisementPerformance: builder.query({
      query: ({ id, from, to }) => ({
        url: `${BUSINESS_BASE}/${id}/performance`,
        method: "GET",
        params: { from, to },
      }),
      providesTags: (_result, _err, { id }) => [
        { type: "AdvertisementPerformance", id },
      ],
    }),

    // =====================================================================
    // ADMIN — stats
    // =====================================================================

    // GET /api/advertisements/admin/stats?from=
    adminAdvertisementStats: builder.query({
      query: ({ from } = {}) => ({
        url: `${ADMIN_BASE}/stats`,
        method: "GET",
        params: { from },
      }),
      providesTags: ["AdvertisementStats"],
    }),

    // =====================================================================
    // ADMIN — types management
    // =====================================================================

    // GET /api/advertisements/admin/types
    adminListAdvertisementTypes: builder.query({
      query: () => ({
        url: `${ADMIN_BASE}/types`,
        method: "GET",
      }),
      providesTags: ["AdvertisementType"],
    }),

    // POST /api/advertisements/admin/types
    adminCreateAdvertisementType: builder.mutation({
      query: (body) => ({
        url: `${ADMIN_BASE}/types`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdvertisementType"],
    }),

    // PUT /api/advertisements/admin/types/:id
    adminUpdateAdvertisementType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ADMIN_BASE}/types/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdvertisementType"],
    }),

    // =====================================================================
    // ADMIN — slots management
    // =====================================================================

    // GET /api/advertisements/admin/slots
    adminListAdvertisementSlots: builder.query({
      query: () => ({
        url: `${ADMIN_BASE}/slots`,
        method: "GET",
      }),
      providesTags: ["AdvertisementSlot"],
    }),

    // POST /api/advertisements/admin/slots
    adminCreateAdvertisementSlot: builder.mutation({
      query: (body) => ({
        url: `${ADMIN_BASE}/slots`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdvertisementSlot"],
    }),

    // PUT /api/advertisements/admin/slots/:id
    adminUpdateAdvertisementSlot: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ADMIN_BASE}/slots/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdvertisementSlot"],
    }),

    // =====================================================================
    // ADMIN — advertisements management
    // =====================================================================

    // GET /api/advertisements/admin?status=&business_id=&slot_id=&type_id=&search=&from=&to=&limit=&offset=
    adminListAdvertisements: builder.query({
      query: (params = {}) => ({
        url: ADMIN_BASE,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Advertisement",
                id,
              })),
              "AdvertisementList",
            ]
          : ["AdvertisementList"],
    }),

    // GET /api/advertisements/admin/:id
    adminGetAdvertisement: builder.query({
      query: (id) => ({
        url: `${ADMIN_BASE}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Advertisement", id }],
    }),

    // POST /api/advertisements/admin/:id/approve
    adminApproveAdvertisement: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_BASE}/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Advertisement", id },
        "AdvertisementList",
        "AdvertisementStats",
        "AdvertisementSlot",
      ],
    }),

    // POST /api/advertisements/admin/:id/reject
    adminRejectAdvertisement: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${ADMIN_BASE}/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Advertisement", id },
        "AdvertisementList",
        "AdvertisementStats",
      ],
    }),

    // PATCH /api/advertisements/admin/:id/status
    adminSetAdvertisementStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${ADMIN_BASE}/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Advertisement", id },
        "AdvertisementList",
        "AdvertisementStats",
        "AdvertisementSlot",
      ],
    }),

    // DELETE /api/advertisements/admin/:id
    adminDeleteAdvertisement: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_BASE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Advertisement", id },
        "AdvertisementList",
        "AdvertisementStats",
        "AdvertisementSlot",
      ],
    }),
  }),
});

export const {
  // Public
  useListAdvertisementTypesQuery,
  useListAdvertisementSlotsQuery,

  // Business
  useCreateAdvertisementMutation,
  useListMyAdvertisementsQuery,
  useGetMyAdvertisementQuery,
  useUpdateMyAdvertisementMutation,
  useSubmitMyAdvertisementMutation,
  usePauseMyAdvertisementMutation,
  useResumeMyAdvertisementMutation,
  useDeleteMyAdvertisementMutation,
  useGetMyAdvertisementPerformanceQuery,

  // Admin — stats
  useAdminAdvertisementStatsQuery,

  // Admin — types
  useAdminListAdvertisementTypesQuery,
  useAdminCreateAdvertisementTypeMutation,
  useAdminUpdateAdvertisementTypeMutation,

  // Admin — slots
  useAdminListAdvertisementSlotsQuery,
  useAdminCreateAdvertisementSlotMutation,
  useAdminUpdateAdvertisementSlotMutation,

  // Admin — advertisements
  useAdminListAdvertisementsQuery,
  useAdminGetAdvertisementQuery,
  useAdminApproveAdvertisementMutation,
  useAdminRejectAdvertisementMutation,
  useAdminSetAdvertisementStatusMutation,
  useAdminDeleteAdvertisementMutation,
} = adsApiSlice;