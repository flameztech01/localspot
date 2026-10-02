// features/promotionApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Public + business routes (mounted at /api/v1/promotions)
const PROMOTIONS_URL = "/v1/promotions";

// Admin routes (mounted at /api/v1/promotions/admin)
const ADMIN_PROMOTIONS_URL = "/v1/promotions/admin";

export const promotionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // PUBLIC
    // =====================================================================

    // GET /api/v1/promotions?businessId=&page=&limit=
    listPublicPromotions: builder.query({
      query: (params = {}) => ({
        url: PROMOTIONS_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Promotion", id })),
              "PromotionList",
            ]
          : ["PromotionList"],
    }),

    // GET /api/v1/promotions/:id
    // Public, but behaves differently for owner/admin (uses req.user)
    getPromotion: builder.query({
      query: (id) => ({
        url: `${PROMOTIONS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Promotion", id }],
    }),

    // =====================================================================
    // BUSINESS
    // =====================================================================

    // GET /api/v1/promotions/mine/all?status=
    listMyPromotions: builder.query({
      query: (params = {}) => ({
        url: `${PROMOTIONS_URL}/mine/all`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Promotion", id })),
              "PromotionListMine",
            ]
          : ["PromotionListMine"],
    }),

    // POST /api/v1/promotions
    createPromotion: builder.mutation({
      query: (body) => ({
        url: PROMOTIONS_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PromotionListMine", "PromotionList"],
    }),

    // PUT /api/v1/promotions/:id
    updatePromotion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${PROMOTIONS_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Promotion", id },
        "PromotionListMine",
        "PromotionList",
      ],
    }),

    // DELETE /api/v1/promotions/:id
    // Allowed for business owners OR admins
    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `${PROMOTIONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Promotion", id },
        "PromotionListMine",
        "PromotionList",
        "AdminPromotionList",
      ],
    }),

    // POST /api/v1/promotions/:id/submit
    submitPromotionForReview: builder.mutation({
      query: (id) => ({
        url: `${PROMOTIONS_URL}/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Promotion", id },
        "PromotionListMine",
        "AdminPromotionList",
      ],
    }),

    // =====================================================================
    // ADMIN
    // =====================================================================

    // GET /api/v1/promotions/admin?status=&businessId=&page=&limit=
    adminListPromotions: builder.query({
      query: (params = {}) => ({
        url: ADMIN_PROMOTIONS_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Promotion", id })),
              "AdminPromotionList",
            ]
          : ["AdminPromotionList"],
    }),

    // GET /api/v1/promotions/admin/:id
    adminGetPromotion: builder.query({
      query: (id) => ({
        url: `${ADMIN_PROMOTIONS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Promotion", id }],
    }),

    // POST /api/v1/promotions/admin/:id/approve
    adminApprovePromotion: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_PROMOTIONS_URL}/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Promotion", id },
        "AdminPromotionList",
        "PromotionList",
        "PromotionListMine",
      ],
    }),

    // POST /api/v1/promotions/admin/:id/reject
    adminRejectPromotion: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${ADMIN_PROMOTIONS_URL}/${id}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Promotion", id },
        "AdminPromotionList",
        "PromotionListMine",
      ],
    }),

    // POST /api/v1/promotions/admin/:id/disable
    adminDisablePromotion: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_PROMOTIONS_URL}/${id}/disable`,
        method: "POST",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Promotion", id },
        "AdminPromotionList",
        "PromotionList",
      ],
    }),

    // DELETE /api/v1/promotions/admin/expired
    adminRemoveExpiredPromotions: builder.mutation({
      query: () => ({
        url: `${ADMIN_PROMOTIONS_URL}/expired`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminPromotionList", "PromotionList", "PromotionListMine"],
    }),
  }),
});

export const {
  // Public
  useListPublicPromotionsQuery,
  useGetPromotionQuery,

  // Business
  useListMyPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useSubmitPromotionForReviewMutation,

  // Admin
  useAdminListPromotionsQuery,
  useAdminGetPromotionQuery,
  useAdminApprovePromotionMutation,
  useAdminRejectPromotionMutation,
  useAdminDisablePromotionMutation,
  useAdminRemoveExpiredPromotionsMutation,
} = promotionApiSlice;