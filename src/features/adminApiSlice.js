// features/adminApiSlice.js
import { apiSlice } from "./apiSlice.js";

const ADMIN_URL = "/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /admin/login
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    // POST /admin/logout
    logout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["AdminAuth"],
    }),

    // GET /admin/me
    getCurrentAdmin: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/me`,
        method: "GET",
      }),
      providesTags: ["AdminAuth"],
    }),

    // POST /admin/forgot-password
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${ADMIN_URL}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),

    // POST /admin/reset-password
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