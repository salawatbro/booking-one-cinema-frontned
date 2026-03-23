import type {
  Movie,
  Showtime,
  SeatMap,
  Booking,
  BookingStats,
  MovieRequest,
  Profile,
  CalendarDay,
  ContactInfo,
} from '@/types/api';

const MINIAPP_URL = import.meta.env.VITE_API_BASE_URL;
const WEB_URL = import.meta.env.VITE_API_WEB_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

export function isTelegram(): boolean {
  return !!window.Telegram?.WebApp?.initData;
}

function getBaseUrl(): string {
  return isTelegram() ? MINIAPP_URL : WEB_URL;
}

export function storageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STORAGE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function getAuthHeader(): Record<string, string> {
  const tg = window.Telegram?.WebApp;
  if (tg?.initData) {
    return { 'Authorization': `tma ${tg.initData}` };
  }
  const token = localStorage.getItem('web_auth_token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(body.message || 'Something went wrong', response.status, body.errors);
  }

  const json = await response.json();
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }
  return json as T;
}

// --- Movies ---

export async function getMovies(search?: string): Promise<Movie[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return request<Movie[]>(`/movies${params}`);
}

export async function getFeaturedMovies(): Promise<Movie[]> {
  return request<Movie[]>('/movies/featured');
}

export async function getMovie(id: number): Promise<{ movie: Movie; showtimesByDate: Record<string, Showtime[]> }> {
  const movie = await request<Movie>(`/movies/${id}`);

  // Get showtimes for this movie grouped by date
  const showtimes = await getShowtimes({ movie_id: id });
  const showtimesByDate: Record<string, Showtime[]> = {};
  for (const st of showtimes) {
    if (!showtimesByDate[st.start_date]) showtimesByDate[st.start_date] = [];
    showtimesByDate[st.start_date].push(st);
  }

  return { movie, showtimesByDate };
}

// --- Showtimes ---

export async function getShowtimes(params?: { movie_id?: number; date?: string; hall_id?: number }): Promise<Showtime[]> {
  const query = new URLSearchParams();
  if (params?.movie_id) query.set('movie_id', String(params.movie_id));
  if (params?.date) query.set('date', params.date);
  if (params?.hall_id) query.set('hall_id', String(params.hall_id));
  const qs = query.toString();
  return request<Showtime[]>(`/showtimes${qs ? `?${qs}` : ''}`);
}

export async function getShowtime(id: number): Promise<Showtime> {
  return request<Showtime>(`/showtimes/${id}`);
}

export async function getShowtimeSeats(showtimeId: number): Promise<SeatMap> {
  return request<SeatMap>(`/showtimes/${showtimeId}/seats`);
}

export async function getShowtimeCalendar(movieId?: number): Promise<CalendarDay[]> {
  const params = movieId ? `?movie_id=${movieId}` : '';
  return request<CalendarDay[]>(`/showtimes/calendar${params}`);
}

// --- Bookings ---

export async function getBookings(status?: string): Promise<Booking[]> {
  const params = status ? `?status=${status}` : '';
  return request<Booking[]>(`/bookings${params}`);
}

export async function createBooking(showtimeId: number, seatIds: number[]): Promise<Booking> {
  return request<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify({ showtime_id: showtimeId, seat_ids: seatIds }),
  });
}

export async function getBooking(id: number): Promise<Booking> {
  return request<Booking>(`/bookings/${id}`);
}

export async function cancelBooking(id: number): Promise<Booking> {
  return request<Booking>(`/bookings/${id}/cancel`, { method: 'POST' });
}

export async function getBookingStats(): Promise<BookingStats> {
  return request<BookingStats>('/bookings/stats');
}

export async function getBookingTicket(id: number): Promise<{ ticket_code: string; download_url: string }> {
  return request<{ ticket_code: string; download_url: string }>(`/bookings/${id}/ticket`);
}

// --- Payment ---

export async function initiatePayment(bookingId: number, provider: 'click' | 'payme', returnUrl?: string) {
  return request<{ payment_url: string; provider: string; amount: number; expires_at: string }>(`/bookings/${bookingId}/pay`, {
    method: 'POST',
    body: JSON.stringify({ provider, return_url: returnUrl }),
  });
}

export async function getPaymentStatus(bookingId: number) {
  return request<{ status: 'waiting' | 'paid' | 'failed' | 'expired'; paid_at: string | null; provider: string; ticket_code: string | null }>(`/bookings/${bookingId}/payment-status`);
}

// --- Movie Requests ---

export async function getMovieRequests(): Promise<MovieRequest[]> {
  return request<MovieRequest[]>('/movie-requests');
}

export async function createMovieRequest(data: {
  movie_name: string;
  movie_year?: number;
  trailer_url?: string;
  preferred_date?: string;
  preferred_time?: string;
  guests_count: number;
}): Promise<MovieRequest> {
  return request<MovieRequest>('/movie-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- Profile ---

export async function getProfile(): Promise<Profile> {
  return request<Profile>('/profile');
}

export async function updateLanguage(language: string): Promise<Profile> {
  return request<Profile>('/profile/language', {
    method: 'PATCH',
    body: JSON.stringify({ language }),
  });
}

// --- Settings ---

export async function getSettings() {
  return request<ContactInfo & { cinema_name: string; payment_methods: string[]; booking_timeout_minutes: number; max_seats_per_booking: number; languages: string[] }>('/settings');
}

export async function downloadTicket(bookingId: number): Promise<void> {
  const ticket = await getBookingTicket(bookingId);
  const url = ticket.download_url.startsWith('http')
    ? ticket.download_url
    : `${STORAGE_URL}${ticket.download_url}`;

  const response = await fetch(url, {
    headers: getAuthHeader(),
  });

  if (!response.ok) throw new ApiError('Download failed', response.status);

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `ticket-${ticket.ticket_code || bookingId}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

export { ApiError };
