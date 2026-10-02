// features/businessApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount path: /api/v1/auth/business
const BUSINESS_AUTH_URL = "/v1/auth/business";

export const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // AUTH
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

    // POST /api/v1/auth/business/login
    loginBusinessAccount: builder.mutation({
      query: ({ email, password }) => ({
        url: `${BUSINESS_AUTH_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // POST /api/v1/auth/business/logout  (requires auth)
    logoutBusinessAccount: builder.mutation({
      query: () => ({
        url: `${BUSINESS_AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["BusinessAuth"],
    }),

    // GET /api/v1/auth/business/me  (requires auth)
    getCurrentBusinessAccount: builder.query({
      query: () => ({
        url: `${BUSINESS_AUTH_URL}/me`,
        method: "GET",
      }),
      providesTags: ["BusinessAuth"],
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
    resetBusinessPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${BUSINESS_AUTH_URL}/reset-password`,
        method: "POST",
        body: { token, password },
      }),
      invalidatesTags: ["BusinessAuth"],
    }),
  }),
});

export const {
  useRegisterBusinessAccountMutation,
  useLoginBusinessAccountMutation,
  useLogoutBusinessAccountMutation,
  useGetCurrentBusinessAccountQuery,
  useForgotBusinessPasswordMutation,
  useResetBusinessPasswordMutation,
} = businessApiSlice;