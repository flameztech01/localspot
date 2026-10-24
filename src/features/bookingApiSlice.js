// features/bookingApiSlice.js
import { apiSlice } from "./apiSlice.js";

// All booking endpoints share the /bookings prefix
const BASE        = "/bookings";
const BUSINESS    = "/bookings/business";
const ADMIN       = "/bookings/admin";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================================
    // PUBLIC — form schema (per business)
    // GET /api/bookings/form/:businessId
    // =====================================================================
    getBookingFormSchema: builder.query({
      query: (businessId) => ({
        url: `${BASE}/form/${businessId}`,
        method: "GET",
      }),
      providesTags: (_result, _err, businessId) => [
        { type: "BookingSchema", id: businessId },
      ],
    }),

    // =====================================================================
    // CUSTOMER — create / read / cancel
    // =====================================================================

    // POST /api/bookings/:businessId
    // body: { details?, guestName?, guestEmail?, guestPhone?,
    //         specialRequests?, estimatedTotal?, currency? }
    createBooking: builder.mutation({
      query: ({ businessId, ...body }) => ({
        url: `${BASE}/${businessId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["BookingList", "BookingStats"],
    }),

    // GET /api/bookings/my?status=&kind=&page=&limit=
    getMyBookings: builder.query({
      query: (params = {}) => ({
        url: `${BASE}/my`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Booking", id: _id })),
              "BookingList",
            ]
          : ["BookingList"],
    }),

    // GET /api/bookings/:id
    getBookingById: builder.query({
      query: (id) => ({
        url: `${BASE}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Booking", id }],
    }),

    // PATCH /api/bookings/:id/cancel
    // body: { reason? }
    cancelBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${BASE}/${id}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Booking", id },
        "BookingList",
        "BookingStats",
      ],
    }),

    // =====================================================================
    // BUSINESS — read + state transitions
    // =====================================================================

    // GET /api/bookings/business?status=&kind=&from=&to=&q=&page=&limit=
    getBusinessBookings: builder.query({
      query: (params = {}) => ({
        url: BUSINESS,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Booking", id: _id })),
              "BookingList",
            ]
          : ["BookingList"],
    }),

    // GET /api/bookings/business/stats
    getBusinessBookingStats: builder.query({
      query: () => ({
        url: `${BUSINESS}/stats`,
        method: "GET",
      }),
      providesTags: ["BookingStats"],
    }),

    // PATCH /api/bookings/:id/confirm
    // body: { businessNotes?, estimatedTotal? }
    confirmBooking: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${BASE}/${id}/confirm`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Booking", id },
        "BookingList",
        "BookingStats",
      ],
    }),

    // PATCH /api/bookings/:id/reject
    // body: { reason }   ← required by controller
    rejectBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${BASE}/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Booking", id },
        "BookingList",
        "BookingStats",
      ],
    }),

    // PATCH /api/bookings/:id/complete
    completeBooking: builder.mutation({
      query: (id) => ({
        url: `${BASE}/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Booking", id },
        "BookingList",
        "BookingStats",
      ],
    }),

    // PATCH /api/bookings/:id/no-show
    // body: { note? }
    markBookingNoShow: builder.mutation({
      query: ({ id, note }) => ({
        url: `${BASE}/${id}/no-show`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Booking", id },
        "BookingList",
        "BookingStats",
      ],
    }),

    // =====================================================================
    // ADMIN
    // =====================================================================

    // GET /api/bookings/admin?status=&kind=&business=&customer=&q=&page=&limit=
    listAllBookings: builder.query({
      query: (params = {}) => ({
        url: ADMIN,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Booking", id: _id })),
              "BookingList",
            ]
          : ["BookingList"],
    }),

    // PATCH /api/bookings/admin/:id/cancel
    // body: { reason? }
    adminCancelBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${ADMIN}/${id}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Booking", id },
        "BookingList",
        "BookingStats",
      ],
    }),
  }),
});

export const {
  // Public
  useGetBookingFormSchemaQuery,

  // Customer
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useCancelBookingMutation,

  // Business
  useGetBusinessBookingsQuery,
  useGetBusinessBookingStatsQuery,
  useConfirmBookingMutation,
  useRejectBookingMutation,
  useCompleteBookingMutation,
  useMarkBookingNoShowMutation,

  // Admin
  useListAllBookingsQuery,
  useAdminCancelBookingMutation,
} = bookingApiSlice;