// features/adminApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount path: /api/v1/auth/admin
const ADMIN_URL = "/v1/auth/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/auth/admin/login
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    // POST /api/v1/auth/admin/logout  (requires auth)
    logout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    // GET /api/v1/auth/admin/me  (requires auth)
    getCurrentAdmin: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/me`,
        method: "GET",
      }),
      providesTags: ["AdminAuth"],
    }),

    // POST /api/v1/auth/admin/forgot-password
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${ADMIN_URL}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),

    // POST /api/v1/auth/admin/reset-password
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${ADMIN_URL}/reset-password`,
        method: "POST",
        body: { token, password },
      }),
      invalidatesTags: ["AdminAuth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentAdminQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = adminApiSlice;