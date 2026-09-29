// features/userApiSlice.js
import { apiSlice } from "./apiSlice.js";

const USER_URL = "/users";
const AUTH_URL = "/auth";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Auth ────────────────────────────────────────────────
    register: builder.mutation({
      query: ({ name, email, password, phone }) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: { name, email, password, phone },
      }),
      invalidatesTags: ["UserAuth"],
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["UserAuth"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["UserAuth"],
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: `${AUTH_URL}/me`,
        method: "GET",
      }),
      providesTags: ["UserAuth"],
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        body: { token, password },
      }),
      invalidatesTags: ["UserAuth"],
    }),

    verifyEmail: builder.mutation({
      query: ({ token }) => ({
        url: `${AUTH_URL}/verify-email`,
        method: "POST",
        body: { token },
      }),
      invalidatesTags: ["UserAuth"],
    }),

    // ─── Profile ─────────────────────────────────────────────
    getProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation({
      query: ({ name, phone, avatar, address, city }) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: { name, phone, avatar, address, city },
      }),
      invalidatesTags: ["Profile", "UserAuth"],
    }),

    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: `${USER_URL}/profile/avatar`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Profile", "UserAuth"],
    }),

    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: `${USER_URL}/profile/password`,
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserAuth", "Profile", "SavedPlace"],
    }),

    // ─── Saved Places ────────────────────────────────────────
    getSavedPlaces: builder.query({
      query: () => ({
        url: `${USER_URL}/saved-places`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "SavedPlace", id: _id })),
              { type: "SavedPlace", id: "LIST" },
            ]
          : [{ type: "SavedPlace", id: "LIST" }],
    }),

    savePlace: builder.mutation({
      query: (placeId) => ({
        url: `${USER_URL}/saved-places`,
        method: "POST",
        body: { placeId },
      }),
      invalidatesTags: [{ type: "SavedPlace", id: "LIST" }],
    }),

    unsavePlace: builder.mutation({
      query: (placeId) => ({
        url: `${USER_URL}/saved-places/${placeId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, placeId) => [
        { type: "SavedPlace", id: placeId },
        { type: "SavedPlace", id: "LIST" },
      ],
    }),

    // ─── Reviews ─────────────────────────────────────────────
    getUserReviews: builder.query({
      query: () => ({
        url: `${USER_URL}/reviews`,
        method: "GET",
      }),
      providesTags: ["UserReview"],
    }),

    createReview: builder.mutation({
      query: ({ placeId, rating, comment }) => ({
        url: `${USER_URL}/reviews`,
        method: "POST",
        body: { placeId, rating, comment },
      }),
      invalidatesTags: ["UserReview", "Place"],
    }),

    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `${USER_URL}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserReview", "Place"],
    }),

    // ─── Notifications ───────────────────────────────────────
    getNotifications: builder.query({
      query: () => ({
        url: `${USER_URL}/notifications`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  // Auth
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  // Profile
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  // Saved Places
  useGetSavedPlacesQuery,
  useSavePlaceMutation,
  useUnsavePlaceMutation,
  // Reviews
  useGetUserReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = userApiSlice;