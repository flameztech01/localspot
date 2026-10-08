// features/businessApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount path: /api/v1/auth/business
const BUSINESS_AUTH_URL = "/v1/auth/business";

export const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // PUBLIC — no auth required
    // =====================================================================

    // GET /api/v1/auth/business/public
    // Query: kind, category, city, country, minRating, featured, q,
    //        sort, page, limit
    listPublicBusinesses: builder.query({
      query: (params = {}) => ({
        url: `${BUSINESS_AUTH_URL}/public`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.businesses
          ? [
              ...result.data.businesses.map(({ _id }) => ({
                type: "Business",
                id: _id,
              })),
              "PublicBusinessList",
            ]
          : ["PublicBusinessList"],
    }),

    // GET /api/v1/auth/business/public/:id
    getPublicBusinessById: builder.query({
      query: (id) => ({
        url: `${BUSINESS_AUTH_URL}/public/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Business", id }],
    }),

    // =====================================================================
    // AUTH — public flows
    // =====================================================================

    // POST /api/v1/auth/business/register
    registerBusinessAccount: builder.mutation({
      query: (body) => ({
        url: `${BUSINESS_AUTH_URL}/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // POST /api/v1/auth/business/verify-otp
    verifyBusinessAccount: builder.mutation({
      query: ({ email, otp }) => ({
        url: `${BUSINESS_AUTH_URL}/verify-otp`,
        method: "POST",
        body: { email, otp },
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // POST /api/v1/auth/business/resend-otp
    // purpose: "verification" | "password-reset"
    resendBusinessOTP: builder.mutation({
      query: ({ email, purpose = "verification" }) => ({
        url: `${BUSINESS_AUTH_URL}/resend-otp`,
        method: "POST",
        body: { email, purpose },
      }),
    }),

    // POST /api/v1/auth/business/login
    loginBusinessAccount: builder.mutation({
      query: ({ email, password }) => ({
        url: `${BUSINESS_AUTH_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // POST /api/v1/auth/business/forgot-password
    forgotBusinessPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${BUSINESS_AUTH_URL}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),

    // POST /api/v1/auth/business/reset-password
    // Takes { email, otp, password }
    resetBusinessPassword: builder.mutation({
      query: ({ email, otp, password }) => ({
        url: `${BUSINESS_AUTH_URL}/reset-password`,
        method: "POST",
        body: { email, otp, password },
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // =====================================================================
    // AUTH — private (business owner)
    // =====================================================================

    // POST /api/v1/auth/business/logout
    logoutBusinessAccount: builder.mutation({
      query: () => ({
        url: `${BUSINESS_AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // GET /api/v1/auth/business/me
    getCurrentBusinessAccount: builder.query({
      query: () => ({
        url: `${BUSINESS_AUTH_URL}/me`,
        method: "GET",
      }),
      providesTags: ["BusinessAuth"],
    }),

    // PUT /api/v1/auth/business/profile
    // Body: FormData
    //   text: businessName, description, businessType, website,
    //         phone, address, priceRange, tags (JSON),
    //         location (JSON), openingHours (JSON),
    //         businessKind, businessKindOther (when "others"),
    //         removeImages (JSON array of URLs to drop)
    //   files: images (multiple, min 10 max 20 total)
    //          coverImage (single, optional)
    // Do NOT set Content-Type — browser sets multipart boundary
    updateBusinessProfile: builder.mutation({
      query: (formData) => ({
        url: `${BUSINESS_AUTH_URL}/profile`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // =====================================================================
    // ADMIN — approval management (under /all)
    // =====================================================================

    // GET /api/v1/auth/business/all?status=&page=&limit=
    // status: "pending" | "approved" | "rejected" | "unverified"
    //       | "featured" | "all"
    listBusinesses: builder.query({
      query: ({ status = "pending", page = 1, limit = 20 } = {}) => ({
        url: `${BUSINESS_AUTH_URL}/all`,
        method: "GET",
        params: { status, page, limit },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Business",
                id: _id,
              })),
              "BusinessList",
            ]
          : ["BusinessList"],
    }),

    // GET /api/v1/auth/business/all/:id
    getBusinessById: builder.query({
      query: (id) => ({
        url: `${BUSINESS_AUTH_URL}/all/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Business", id }],
    }),

    // PATCH /api/v1/auth/business/all/:id/approve
    approveBusiness: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_AUTH_URL}/all/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Business", id },
        "BusinessList",
        "BusinessAuth",
        "PublicBusinessList",
      ],
    }),

    // PATCH /api/v1/auth/business/all/:id/reject
    // Body: { reason }
    rejectBusiness: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${BUSINESS_AUTH_URL}/all/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Business", id },
        "BusinessList",
        "BusinessAuth",
        "PublicBusinessList",
      ],
    }),

    // PATCH /api/v1/auth/business/all/:id/feature
    // Body: { featured: bool, plan?, until?, notes? }
    toggleBusinessFeatured: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${BUSINESS_AUTH_URL}/all/${id}/feature`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Business", id },
        "BusinessList",
        "PublicBusinessList",
        "FeaturedBusinesses",
      ],
    }),
  }),
});

export const {
  // Public
  useListPublicBusinessesQuery,
  useGetPublicBusinessByIdQuery,

  // Auth — public
  useRegisterBusinessAccountMutation,
  useVerifyBusinessAccountMutation,
  useResendBusinessOTPMutation,
  useLoginBusinessAccountMutation,
  useForgotBusinessPasswordMutation,
  useResetBusinessPasswordMutation,

  // Auth — private
  useLogoutBusinessAccountMutation,
  useGetCurrentBusinessAccountQuery,
  useUpdateBusinessProfileMutation,

  // Admin approval
  useListBusinessesQuery,
  useGetBusinessByIdQuery,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
  useToggleBusinessFeaturedMutation,
} = businessApiSlice;