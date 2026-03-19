export interface Movie {
  id: number;
  name: string;
  description: string | null;
  poster_url: string | null;
  duration: number;
  is_active: boolean;
  upcoming_showtimes_count: number;
}

export interface Showtime {
  id: number;
  movie_id: number;
  hall_id: number;
  start_time: string;
  start_date: string;
  price: number;
  hall?: Hall;
  movie?: Movie;
  available_seats_count?: number;
}

export interface Hall {
  id: number;
  name: string;
}

export interface Seat {
  id: number;
  row: number;
  number: number;
  is_active: boolean;
  is_booked: boolean;
}

export interface SeatMap {
  rows: SeatRow[];
}

export interface SeatRow {
  row_number: number;
  seats: Seat[];
}

export interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  status_label: string;
  ticket_code: string | null;
  showtime: Showtime;
  seats: Seat[];
  total_price: number;
  can_cancel: boolean;
  created_at: string;
}

export interface MovieRequest {
  id: number;
  movie_name: string;
  movie_year: number | null;
  trailer_url: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  guests_count: number;
  status: 'pending' | 'approved' | 'rejected';
  status_label: string;
  admin_note: string | null;
  created_at: string;
}

export interface Profile {
  id: number;
  telegram_id: string;
  first_name: string;
  last_name: string | null;
  username: string | null;
  phone: string | null;
  language: 'uz' | 'ru' | 'kk';
  bookings_count?: number;
}

export interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export interface CalendarDay {
  date: string;
  count: number;
}
