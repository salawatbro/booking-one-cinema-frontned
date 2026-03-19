import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';

// --- Query Keys ---
export const queryKeys = {
  movies: ['movies'] as const,
  featuredMovies: ['movies', 'featured'] as const,
  movie: (id: number) => ['movies', id] as const,
  showtimes: (params?: { movie_id?: number; date?: string }) => ['showtimes', params] as const,
  showtime: (id: number) => ['showtimes', id] as const,
  showtimeSeats: (id: number) => ['showtimes', id, 'seats'] as const,
  showtimeCalendar: (movieId?: number) => ['showtimes', 'calendar', movieId] as const,
  bookings: (status?: string) => ['bookings', status] as const,
  booking: (id: number) => ['bookings', id] as const,
  bookingStats: ['bookings', 'stats'] as const,
  paymentStatus: (id: number) => ['bookings', id, 'payment-status'] as const,
  movieRequests: ['movie-requests'] as const,
  profile: ['profile'] as const,
  settings: ['settings'] as const,
};

// --- Movies ---

export function useMovies(search?: string) {
  return useQuery({
    queryKey: [...queryKeys.movies, search],
    queryFn: () => api.getMovies(search),
  });
}

export function useFeaturedMovies() {
  return useQuery({
    queryKey: queryKeys.featuredMovies,
    queryFn: api.getFeaturedMovies,
  });
}

export function useMovie(id: number) {
  return useQuery({
    queryKey: queryKeys.movie(id),
    queryFn: () => api.getMovie(id),
    enabled: id > 0,
  });
}

// --- Showtimes ---

export function useShowtimes(params?: { movie_id?: number; date?: string }) {
  return useQuery({
    queryKey: queryKeys.showtimes(params),
    queryFn: () => api.getShowtimes(params),
  });
}

export function useShowtime(id: number) {
  return useQuery({
    queryKey: queryKeys.showtime(id),
    queryFn: () => api.getShowtime(id),
    enabled: id > 0,
  });
}

export function useShowtimeSeats(showtimeId: number) {
  return useQuery({
    queryKey: queryKeys.showtimeSeats(showtimeId),
    queryFn: () => api.getShowtimeSeats(showtimeId),
    enabled: showtimeId > 0,
  });
}

export function useShowtimeCalendar(movieId?: number) {
  return useQuery({
    queryKey: queryKeys.showtimeCalendar(movieId),
    queryFn: () => api.getShowtimeCalendar(movieId),
  });
}

// --- Bookings ---

export function useBookings(status?: string) {
  return useQuery({
    queryKey: queryKeys.bookings(status),
    queryFn: () => api.getBookings(status),
  });
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => api.getBooking(id),
    enabled: id > 0,
  });
}

export function useBookingStats() {
  return useQuery({
    queryKey: queryKeys.bookingStats,
    queryFn: api.getBookingStats,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ showtimeId, seatIds }: { showtimeId: number; seatIds: number[] }) =>
      api.createBooking(showtimeId, seatIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// --- Payment ---

export function useInitiatePayment() {
  return useMutation({
    mutationFn: ({ bookingId, provider, returnUrl }: { bookingId: number; provider: 'click' | 'payme'; returnUrl?: string }) =>
      api.initiatePayment(bookingId, provider, returnUrl),
  });
}

export function usePaymentStatus(bookingId: number, enabled = false) {
  return useQuery({
    queryKey: queryKeys.paymentStatus(bookingId),
    queryFn: () => api.getPaymentStatus(bookingId),
    enabled,
    refetchInterval: 3000, // poll every 3s
  });
}

// --- Movie Requests ---

export function useMovieRequests() {
  return useQuery({
    queryKey: queryKeys.movieRequests,
    queryFn: api.getMovieRequests,
  });
}

export function useCreateMovieRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createMovieRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.movieRequests });
    },
  });
}

// --- Profile ---

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: api.getProfile,
  });
}

export function useUpdateLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (language: string) => api.updateLanguage(language),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

// --- Settings ---

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: api.getSettings,
    staleTime: 1000 * 60 * 10, // 10 minutes — rarely changes
  });
}
