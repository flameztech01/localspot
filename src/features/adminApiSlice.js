// features/adminApiSlice.js
import { apiSlice } from "./apiSlice.js";

const ADMIN_URL = "/v1/admin";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Users ─────────────────────────────────────────────
    listUsers: builder.query({
      query: (params = {}) => ({
        url: `${ADMIN_URL}/users`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "User", id: _id })),
              "UserList",
            ]
          : ["UserList"],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `${ADMIN_URL}/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "User", id },
        "UserList",
      ],
    }),

    toggleUserActive: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        "UserList",
      ],
    }),

    deleteUser: builder.mutation({
      query: ({ id, cascade = false }) => ({
        url: `${ADMIN_URL}/users/${id}`,
        method: "DELETE",
        params: { cascade },
      }),
      invalidatesTags: ["UserList"],
    }),

    adminSendPasswordReset: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}/send-password-reset`,
        method: "POST",
      }),
    }),

    // ── Business create ───────────────────────────────────
    adminCreateBusiness: builder.mutation({
      query: (body) => ({
        url: `${ADMIN_URL}/businesses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["BusinessList", "PublicBusinessList", "UserList"],
    }),

    // ── Featured ──────────────────────────────────────────
    listFeaturedBusinesses: builder.query({
      query: (params = {}) => ({
        url: `${ADMIN_URL}/featured`,
        method: "GET",
        params,
      }),
      providesTags: ["FeaturedList"],
    }),

    adminToggleFeatured: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ADMIN_URL}/featured/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Business", id },
        "FeaturedList",
        "BusinessList",
        "PublicBusinessList",
        "FeaturedBusinesses",
      ],
    }),

    // ── Categories ────────────────────────────────────────
    listAllCategories: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/categories`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Category",
                id: _id,
              })),
              "CategoryList",
            ]
          : ["CategoryList"],
    }),

    createCategory: builder.mutation({
      query: (body) => ({
        url: `${ADMIN_URL}/categories`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CategoryList", "CategoryListPublic"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ADMIN_URL}/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Category", id },
        "CategoryList",
        "CategoryListPublic",
      ],
    }),

    deleteCategory: builder.mutation({
      query: ({ id, force = false }) => ({
        url: `${ADMIN_URL}/categories/${id}`,
        method: "DELETE",
        params: { force },
      }),
      invalidatesTags: ["CategoryList", "CategoryListPublic"],
    }),
  }),
});

export const {
  useListUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useToggleUserActiveMutation,
  useDeleteUserMutation,
  useAdminSendPasswordResetMutation,
  useAdminCreateBusinessMutation,
  useListFeaturedBusinessesQuery,
  useAdminToggleFeaturedMutation,
  useListAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminApiSlice;