// features/reviewApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount paths
const PUBLIC_REVIEWS_URL = "/v1/reviews";
const BUSINESS_REVIEWS_URL = "/v1/business/reviews";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // PUBLIC — /api/v1/reviews
    // =====================================================================

    // GET /api/v1/reviews/business/:businessId?rating=&page=&limit=
    listBusinessReviewsPublic: builder.query({
      query: ({ businessId, ...params }) => ({
        url: `${PUBLIC_REVIEWS_URL}/business/${businessId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, _err, { businessId }) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Review", id: _id })),
              { type: "ReviewList", id: businessId },
            ]
          : [{ type: "ReviewList", id: businessId }],
    }),

    // GET /api/v1/reviews/business/:businessId/stats
    getBusinessReviewStatsPublic: builder.query({
      query: (businessId) => ({
        url: `${PUBLIC_REVIEWS_URL}/business/${businessId}/stats`,
        method: "GET",
      }),
      providesTags: (_r, _e, businessId) => [
        { type: "ReviewStats", id: businessId },
      ],
    }),

    // =====================================================================
    // CUSTOMER — my own review
    // =====================================================================

    // GET /api/v1/reviews/mine/:businessId
    // 404s if the user hasn't reviewed the business yet
    getMyReviewForBusiness: builder.query({
      query: (businessId) => ({
        url: `${PUBLIC_REVIEWS_URL}/mine/${businessId}`,
        method: "GET",
      }),
      providesTags: (_r, _e, businessId) => [
        { type: "MyReview", id: businessId },
      ],
    }),

    // POST /api/v1/reviews
    // Body: { businessId, rating, comment?, images? }
    createReview: builder.mutation({
      query: (body) => ({
        url: PUBLIC_REVIEWS_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { businessId }) => [
        { type: "ReviewList", id: businessId },
        { type: "ReviewStats", id: businessId },
        { type: "MyReview", id: businessId },
      ],
    }),

    // PUT /api/v1/reviews/:id
    // Body: { rating?, comment?, images? }
    updateMyReview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${PUBLIC_REVIEWS_URL}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { businessId }) => [
        { type: "Review", id: _r?.data?._id },
        businessId
          ? { type: "ReviewList", id: businessId }
          : "ReviewList",
        businessId
          ? { type: "ReviewStats", id: businessId }
          : "ReviewStats",
        businessId
          ? { type: "MyReview", id: businessId }
          : "MyReview",
      ],
    }),

    // DELETE /api/v1/reviews/:id
    deleteMyReview: builder.mutation({
      query: (id) => ({
        url: `${PUBLIC_REVIEWS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ReviewList", "ReviewStats", "MyReview"],
    }),

    // =====================================================================
    // BUSINESS — /api/v1/business/reviews
    // =====================================================================

    // GET /api/v1/business/reviews?rating=&replied=&q=&page=&limit=
    listMyBusinessReviews: builder.query({
      query: (params = {}) => ({
        url: BUSINESS_REVIEWS_URL,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Review", id: _id })),
              "MyBusinessReviewList",
            ]
          : ["MyBusinessReviewList"],
    }),

    // GET /api/v1/business/reviews/stats
    getMyBusinessReviewStats: builder.query({
      query: () => ({
        url: `${BUSINESS_REVIEWS_URL}/stats`,
        method: "GET",
      }),
      providesTags: ["MyBusinessReviewStats"],
    }),

    // POST /api/v1/business/reviews/:id/reply
    // Body: { text }
    replyToReview: builder.mutation({
      query: ({ id, text }) => ({
        url: `${BUSINESS_REVIEWS_URL}/${id}/reply`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Review", id },
        "MyBusinessReviewList",
        "MyBusinessReviewStats",
      ],
    }),

    // PUT /api/v1/business/reviews/:id/reply
    // Body: { text }
    updateReviewReply: builder.mutation({
      query: ({ id, text }) => ({
        url: `${BUSINESS_REVIEWS_URL}/${id}/reply`,
        method: "PUT",
        body: { text },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Review", id },
        "MyBusinessReviewList",
      ],
    }),

    // DELETE /api/v1/business/reviews/:id/reply
    deleteReviewReply: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_REVIEWS_URL}/${id}/reply`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Review", id },
        "MyBusinessReviewList",
        "MyBusinessReviewStats",
      ],
    }),
  }),
});

export const {
  // Public
  useListBusinessReviewsPublicQuery,
  useGetBusinessReviewStatsPublicQuery,

  // Customer
  useGetMyReviewForBusinessQuery,
  useCreateReviewMutation,
  useUpdateMyReviewMutation,
  useDeleteMyReviewMutation,

  // Business
  useListMyBusinessReviewsQuery,
  useGetMyBusinessReviewStatsQuery,
  useReplyToReviewMutation,
  useUpdateReviewReplyMutation,
  useDeleteReviewReplyMutation,
} = reviewApiSlice;