// features/businessApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount path: /api/v1/business
const BUSINESS_URL = "/v1/business";

export const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // PUBLIC — no auth required
    // =====================================================================

    // GET /api/v1/business/public
    // Query: kind, category, city, country, minRating, featured,
    //        kycVerified, q, sort, page, limit
    listPublicBusinesses: builder.query({
      query: (params = {}) => ({
        url: `${BUSINESS_URL}/public`,
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

    // GET /api/v1/business/public/:id
    getPublicBusinessById: builder.query({
      query: (id) => ({
        url: `${BUSINESS_URL}/public/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Business", id }],
    }),

    // =====================================================================
    // SIGNED-IN USER — business application
    // =====================================================================

    // POST /api/v1/business/apply
    // Body: FormData
    //   text:  businessName, businessType, businessKind, businessKindOther,
    //          description, website, phone, address, cacNumber, priceRange,
    //          tags (JSON), location (JSON), openingHours (JSON)
    //   files: images (10–20), logo (single), coverImage (single),
    //          cacDocument (single, image or PDF)
    // Do NOT set Content-Type — browser sets multipart boundary
    submitBusinessApplication: builder.mutation({
      query: (formData) => ({
        url: `${BUSINESS_URL}/apply`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["BusinessApplication", "Auth", "ActivityLog"],
    }),

    // GET /api/v1/business/application
    getMyBusinessApplication: builder.query({
      query: () => ({
        url: `${BUSINESS_URL}/application`,
        method: "GET",
      }),
      providesTags: ["BusinessApplication"],
    }),

    // PUT /api/v1/business/application
    // Same multipart shape as submit — only send what changed.
    // Editing a rejected application re-submits it (status → "pending").
    updateBusinessApplication: builder.mutation({
      query: (formData) => ({
        url: `${BUSINESS_URL}/application`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["BusinessApplication", "Auth", "ActivityLog"],
    }),

    // DELETE /api/v1/business/application
    withdrawBusinessApplication: builder.mutation({
      query: () => ({
        url: `${BUSINESS_URL}/application`,
        method: "DELETE",
      }),
      invalidatesTags: ["BusinessApplication", "Auth", "ActivityLog"],
    }),

    // =====================================================================
    // SIGNED-IN BUSINESS — KYC / Trust Badge
    // =====================================================================

    // POST /api/v1/business/kyc
    // Body: FormData
    //   text:  representativeType, ownerLegalName, ownerDob,
    //          idType, idNumber,
    //          registeredBusinessName, registrationType, cacNumber,
    //          cacStatus, operatingAddress,
    //          riskCategory, foodLicenceNumber, foodLicenceExpiry,
    //          liquorLicenceNumber, kycDeclarationAccepted
    //   files: idDocument, cacDocument, activityProof,
    //          utilityBill, regulatoryLicence
    //          (+ optional logo, coverImage, images)
    // Do NOT set Content-Type — browser sets multipart boundary
    submitBusinessKYC: builder.mutation({
      query: (formData) => ({
        url: `${BUSINESS_URL}/kyc`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["BusinessKYC", "Auth", "ActivityLog"],
    }),

    // GET /api/v1/business/kyc
    getMyBusinessKYC: builder.query({
      query: () => ({
        url: `${BUSINESS_URL}/kyc`,
        method: "GET",
      }),
      providesTags: ["BusinessKYC"],
    }),

    // PUT /api/v1/business/kyc
    // Same multipart shape as submit — only send what changed.
    // Editing a rejected KYC re-submits it (status → "pending").
    updateBusinessKYC: builder.mutation({
      query: (formData) => ({
        url: `${BUSINESS_URL}/kyc`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["BusinessKYC", "Auth", "ActivityLog"],
    }),

    // =====================================================================
    // SIGNED-IN BUSINESS — Activity log
    // =====================================================================

    // GET /api/v1/business/activity?page=&limit=&category=&q=
    // category: "all" | "Verification" | "Profile" | "Advertising"
    //         | "Reviews" | "Security" | "Billing" | "Account" | "System"
    getMyActivityLog: builder.query({
      query: ({
        page = 1,
        limit = 50,
        category = "all",
        q = "",
      } = {}) => ({
        url: `${BUSINESS_URL}/activity`,
        method: "GET",
        params: { page, limit, category, q },
      }),
      providesTags: ["ActivityLog"],
    }),

    // =====================================================================
    // ADMIN — approval management
    // =====================================================================

    // GET /api/v1/business/applications?status=&page=&limit=
    // status: "pending" | "approved" | "rejected" | "featured" | "all"
    listBusinesses: builder.query({
      query: ({ status = "pending", page = 1, limit = 20 } = {}) => ({
        url: `${BUSINESS_URL}/applications`,
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

    // GET /api/v1/business/applications/:id
    getBusinessById: builder.query({
      query: (id) => ({
        url: `${BUSINESS_URL}/applications/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Business", id }],
    }),

    // PATCH /api/v1/business/applications/:id/approve
    approveBusiness: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_URL}/applications/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Business", id },
        "BusinessList",
        "BusinessApplication",
        "Auth",
        "PublicBusinessList",
        "ActivityLog",
      ],
    }),

    // PATCH /api/v1/business/applications/:id/reject
    // Body: { reason }
    rejectBusiness: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${BUSINESS_URL}/applications/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Business", id },
        "BusinessList",
        "BusinessApplication",
        "Auth",
        "PublicBusinessList",
        "ActivityLog",
      ],
    }),

    // PATCH /api/v1/business/applications/:id/feature
    // Body: { featured: bool, plan?, until?, notes? }
    toggleBusinessFeatured: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${BUSINESS_URL}/applications/${id}/feature`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Business", id },
        "BusinessList",
        "PublicBusinessList",
        "FeaturedBusinesses",
        "ActivityLog",
      ],
    }),

    // =====================================================================
    // ADMIN — KYC review
    // =====================================================================

    // GET /api/v1/business/kyc-submissions?status=&page=&limit=
    // status: "pending" | "approved" | "rejected" | "all"
    listBusinessKYC: builder.query({
      query: ({ status = "pending", page = 1, limit = 20 } = {}) => ({
        url: `${BUSINESS_URL}/kyc-submissions`,
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
              "BusinessKYCList",
            ]
          : ["BusinessKYCList"],
    }),

    // GET /api/v1/business/kyc-submissions/:id
    getBusinessKYCById: builder.query({
      query: (id) => ({
        url: `${BUSINESS_URL}/kyc-submissions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Business", id }],
    }),

    // PATCH /api/v1/business/kyc-submissions/:id/approve
    approveBusinessKYC: builder.mutation({
      query: (id) => ({
        url: `${BUSINESS_URL}/kyc-submissions/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Business", id },
        "BusinessKYCList",
        "BusinessKYC",
        "Auth",
        "PublicBusinessList",
        "ActivityLog",
      ],
    }),

    // PATCH /api/v1/business/kyc-submissions/:id/reject
    // Body: { reason }
    rejectBusinessKYC: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${BUSINESS_URL}/kyc-submissions/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Business", id },
        "BusinessKYCList",
        "BusinessKYC",
        "Auth",
        "PublicBusinessList",
        "ActivityLog",
      ],
    }),
  }),
});

export const {
  // Public
  useListPublicBusinessesQuery,
  useGetPublicBusinessByIdQuery,

  // Signed-in user — application
  useSubmitBusinessApplicationMutation,
  useGetMyBusinessApplicationQuery,
  useUpdateBusinessApplicationMutation,
  useWithdrawBusinessApplicationMutation,

  // Signed-in business — KYC
  useSubmitBusinessKYCMutation,
  useGetMyBusinessKYCQuery,
  useUpdateBusinessKYCMutation,

  // Signed-in business — activity log
  useGetMyActivityLogQuery,

  // Admin — application review
  useListBusinessesQuery,
  useGetBusinessByIdQuery,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
  useToggleBusinessFeaturedMutation,

  // Admin — KYC review
  useListBusinessKYCQuery,
  useGetBusinessKYCByIdQuery,
  useApproveBusinessKYCMutation,
  useRejectBusinessKYCMutation,
} = businessApiSlice;