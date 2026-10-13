// src/features/authApiSlice.js
import { apiSlice } from "./apiSlice.js";

// Matches the mount path: /api/v1/auth
const AUTH_URL = "/v1/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // AUTH — public flows
    // =====================================================================

    // POST /api/v1/auth/register
    // Body: { fullName, email, password, phone? }
    registerUser: builder.mutation({
      query: (body) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // POST /api/v1/auth/verify-otp
    // Body: { email, otp }
    // Returns: { user, token } and auto-logs in (sets cookie)
    verifyUserOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: `${AUTH_URL}/verify-otp`,
        method: "POST",
        body: { email, otp },
      }),
      invalidatesTags: ["Auth"],
    }),

    // POST /api/v1/auth/resend-otp
    // Body: { email, purpose }
    // purpose: "verification" | "password-reset"
    resendOTP: builder.mutation({
      query: ({ email, purpose = "verification" }) => ({
        url: `${AUTH_URL}/resend-otp`,
        method: "POST",
        body: { email, purpose },
      }),
    }),

    // POST /api/v1/auth/login
    // Body: { email, password }
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Auth", "SavedPlaces", "BusinessApplication"],
    }),

    // POST /api/v1/auth/forgot-password
    // Body: { email }
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),

    // POST /api/v1/auth/reset-password
    // Body: { email, otp, password }
    resetPassword: builder.mutation({
      query: ({ email, otp, password }) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        body: { email, otp, password },
      }),
      invalidatesTags: ["Auth"],
    }),

    // =====================================================================
    // AUTH — private
    // =====================================================================

    // POST /api/v1/auth/logout
    logoutUser: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: [
        "Auth",
        "SavedPlaces",
        "BusinessApplication",
        "BusinessList",
      ],
    }),

    // GET /api/v1/auth/me
    getCurrentUser: builder.query({
      query: () => ({
        url: `${AUTH_URL}/me`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // PUT /api/v1/auth/profile
    // Body: FormData
    //   text:  fullName?, phone?
    //   file:  logo (single, optional)
    // Do NOT set Content-Type — browser sets multipart boundary
    updateUserProfile: builder.mutation({
      query: (formData) => ({
        url: `${AUTH_URL}/profile`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // PUT /api/v1/auth/change-password
    // Body: { currentPassword, newPassword }
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: `${AUTH_URL}/change-password`,
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
      invalidatesTags: ["Auth"],
    }),

    // =====================================================================
    // SAVED PLACES
    // =====================================================================

    // GET /api/v1/auth/saved-places
    getSavedPlaces: builder.query({
      query: () => ({
        url: `${AUTH_URL}/saved-places`,
        method: "GET",
      }),
      providesTags: ["SavedPlaces"],
    }),

    // POST /api/v1/auth/saved-places/:businessId
    savePlace: builder.mutation({
      query: (businessId) => ({
        url: `${AUTH_URL}/saved-places/${businessId}`,
        method: "POST",
      }),
      invalidatesTags: ["SavedPlaces"],
    }),

    // DELETE /api/v1/auth/saved-places/:businessId
    unsavePlace: builder.mutation({
      query: (businessId) => ({
        url: `${AUTH_URL}/saved-places/${businessId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedPlaces"],
    }),
  }),
});

export const {
  // auth — public
  useRegisterUserMutation,
  useVerifyUserOTPMutation,
  useResendOTPMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,

  // auth — private
  useLogoutUserMutation,
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,

  // saved places
  useGetSavedPlacesQuery,
  useSavePlaceMutation,
  useUnsavePlaceMutation,
} = authApiSlice;