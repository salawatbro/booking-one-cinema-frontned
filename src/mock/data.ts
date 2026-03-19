import type { Movie, Showtime, Booking, SeatMap, BookingStats, Profile, MovieRequest, ContactInfo } from '@/types/api';

export const mockMovies: Movie[] = [
  {
    id: 1,
    name: 'Avatar 3: Fire and Ash',
    description: 'Jake Sully va Neytiri oilasini Pandoraning vulqon hududlaridan kelayotgan yangi tahdidlardan himoya qilishga majbur.',
    poster_url: '/posters/avatar_fire_and_ash_xlg.jpg',
    duration: 150,
    is_active: true,
    upcoming_showtimes_count: 5,
  },
  {
    id: 2,
    name: 'Dune: Part Three',
    description: 'Pol Atreydes koinot taqdiri hal bo\'layotgan eng katta sinovga duch keladi.',
    poster_url: '/posters/dune_part_two_xlg.jpg',
    duration: 165,
    is_active: true,
    upcoming_showtimes_count: 3,
  },
  {
    id: 3,
    name: 'The Batman 2',
    description: 'Bryus Ueyn Gotham shahrini ichidan yo\'q qilmoqchi bo\'lgan yangi yovuz kuch bilan to\'qnash keladi.',
    poster_url: '/posters/batman_xlg.jpg',
    duration: 155,
    is_active: true,
    upcoming_showtimes_count: 4,
  },
  {
    id: 4,
    name: 'Spider-Man: New Home',
    description: 'Piter Parker universitet hayotini boshdan kechirar ekan, Sinister Six bilan to\'qnash keladi.',
    poster_url: '/posters/spiderman_no_way_home_xlg.jpg',
    duration: 140,
    is_active: true,
    upcoming_showtimes_count: 6,
  },
  {
    id: 5,
    name: 'Interstellar 2',
    description: 'Yangi avlod kashfiyotchilari insoniyatni qutqarish uchun galaktikamiz chegaralaridan oshadi.',
    poster_url: '/posters/interstellar_xlg.jpg',
    duration: 170,
    is_active: true,
    upcoming_showtimes_count: 2,
  },
  {
    id: 6,
    name: 'Inception: Dreamwalker',
    description: 'Kobb haqiqatni o\'zgartirishi mumkin bo\'lgan oxirgi tush operatsiyasi uchun qaytadi.',
    poster_url: '/posters/inception_xlg.jpg',
    duration: 148,
    is_active: true,
    upcoming_showtimes_count: 3,
  },
];

export const mockFeaturedMovies: Movie[] = [mockMovies[0], mockMovies[1], mockMovies[3]];

export const mockShowtimesByDate: Record<string, Showtime[]> = {
  // Mart
  '2026-03-19': [
    { id: 10, movie_id: 1, hall_id: 1, start_time: '2026-03-19T14:00:00+05:00', start_date: '2026-03-19', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 11, movie_id: 2, hall_id: 1, start_time: '2026-03-19T17:00:00+05:00', start_date: '2026-03-19', price: 55000, hall: { id: 1, name: 'Zal 1' } },
    { id: 12, movie_id: 1, hall_id: 2, start_time: '2026-03-19T19:00:00+05:00', start_date: '2026-03-19', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-03-20': [
    { id: 13, movie_id: 2, hall_id: 1, start_time: '2026-03-20T14:00:00+05:00', start_date: '2026-03-20', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 14, movie_id: 3, hall_id: 2, start_time: '2026-03-20T18:00:00+05:00', start_date: '2026-03-20', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
    { id: 15, movie_id: 2, hall_id: 1, start_time: '2026-03-20T20:00:00+05:00', start_date: '2026-03-20', price: 55000, hall: { id: 1, name: 'Zal 1' } },
  ],
  '2026-03-21': [
    { id: 16, movie_id: 1, hall_id: 1, start_time: '2026-03-21T15:00:00+05:00', start_date: '2026-03-21', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 17, movie_id: 4, hall_id: 2, start_time: '2026-03-21T19:00:00+05:00', start_date: '2026-03-21', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-03-22': [
    { id: 18, movie_id: 3, hall_id: 1, start_time: '2026-03-22T14:00:00+05:00', start_date: '2026-03-22', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 19, movie_id: 1, hall_id: 1, start_time: '2026-03-22T17:00:00+05:00', start_date: '2026-03-22', price: 55000, hall: { id: 1, name: 'Zal 1' } },
    { id: 20, movie_id: 5, hall_id: 2, start_time: '2026-03-22T20:00:00+05:00', start_date: '2026-03-22', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-03-23': [
    { id: 21, movie_id: 4, hall_id: 1, start_time: '2026-03-23T13:00:00+05:00', start_date: '2026-03-23', price: 45000, hall: { id: 1, name: 'Zal 1' } },
    { id: 22, movie_id: 2, hall_id: 1, start_time: '2026-03-23T16:00:00+05:00', start_date: '2026-03-23', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 23, movie_id: 6, hall_id: 2, start_time: '2026-03-23T19:00:00+05:00', start_date: '2026-03-23', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
    { id: 24, movie_id: 1, hall_id: 1, start_time: '2026-03-23T21:00:00+05:00', start_date: '2026-03-23', price: 60000, hall: { id: 1, name: 'Zal 1' } },
  ],
  '2026-03-25': [
    { id: 25, movie_id: 5, hall_id: 1, start_time: '2026-03-25T15:00:00+05:00', start_date: '2026-03-25', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 26, movie_id: 3, hall_id: 2, start_time: '2026-03-25T18:00:00+05:00', start_date: '2026-03-25', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-03-27': [
    { id: 27, movie_id: 6, hall_id: 1, start_time: '2026-03-27T14:00:00+05:00', start_date: '2026-03-27', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 28, movie_id: 1, hall_id: 2, start_time: '2026-03-27T19:00:00+05:00', start_date: '2026-03-27', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
    { id: 29, movie_id: 4, hall_id: 1, start_time: '2026-03-27T21:00:00+05:00', start_date: '2026-03-27', price: 60000, hall: { id: 1, name: 'Zal 1' } },
  ],
  '2026-03-29': [
    { id: 30, movie_id: 2, hall_id: 1, start_time: '2026-03-29T14:00:00+05:00', start_date: '2026-03-29', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 31, movie_id: 5, hall_id: 2, start_time: '2026-03-29T17:00:00+05:00', start_date: '2026-03-29', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-03-30': [
    { id: 32, movie_id: 3, hall_id: 1, start_time: '2026-03-30T15:00:00+05:00', start_date: '2026-03-30', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 33, movie_id: 6, hall_id: 1, start_time: '2026-03-30T18:00:00+05:00', start_date: '2026-03-30', price: 55000, hall: { id: 1, name: 'Zal 1' } },
    { id: 34, movie_id: 1, hall_id: 2, start_time: '2026-03-30T20:00:00+05:00', start_date: '2026-03-30', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  // Aprel
  '2026-04-01': [
    { id: 35, movie_id: 1, hall_id: 1, start_time: '2026-04-01T14:00:00+05:00', start_date: '2026-04-01', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 36, movie_id: 4, hall_id: 2, start_time: '2026-04-01T18:00:00+05:00', start_date: '2026-04-01', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
    { id: 37, movie_id: 2, hall_id: 1, start_time: '2026-04-01T20:00:00+05:00', start_date: '2026-04-01', price: 55000, hall: { id: 1, name: 'Zal 1' } },
  ],
  '2026-04-03': [
    { id: 38, movie_id: 5, hall_id: 1, start_time: '2026-04-03T15:00:00+05:00', start_date: '2026-04-03', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 39, movie_id: 3, hall_id: 2, start_time: '2026-04-03T19:00:00+05:00', start_date: '2026-04-03', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-04-05': [
    { id: 40, movie_id: 6, hall_id: 1, start_time: '2026-04-05T14:00:00+05:00', start_date: '2026-04-05', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 41, movie_id: 1, hall_id: 1, start_time: '2026-04-05T17:00:00+05:00', start_date: '2026-04-05', price: 55000, hall: { id: 1, name: 'Zal 1' } },
    { id: 42, movie_id: 4, hall_id: 2, start_time: '2026-04-05T20:00:00+05:00', start_date: '2026-04-05', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-04-07': [
    { id: 43, movie_id: 2, hall_id: 1, start_time: '2026-04-07T14:00:00+05:00', start_date: '2026-04-07', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 44, movie_id: 5, hall_id: 2, start_time: '2026-04-07T18:00:00+05:00', start_date: '2026-04-07', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
    { id: 45, movie_id: 3, hall_id: 1, start_time: '2026-04-07T21:00:00+05:00', start_date: '2026-04-07', price: 60000, hall: { id: 1, name: 'Zal 1' } },
  ],
  '2026-04-10': [
    { id: 46, movie_id: 6, hall_id: 1, start_time: '2026-04-10T15:00:00+05:00', start_date: '2026-04-10', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 47, movie_id: 1, hall_id: 2, start_time: '2026-04-10T19:00:00+05:00', start_date: '2026-04-10', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
  '2026-04-12': [
    { id: 48, movie_id: 4, hall_id: 1, start_time: '2026-04-12T13:00:00+05:00', start_date: '2026-04-12', price: 45000, hall: { id: 1, name: 'Zal 1' } },
    { id: 49, movie_id: 2, hall_id: 1, start_time: '2026-04-12T16:00:00+05:00', start_date: '2026-04-12', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 50, movie_id: 5, hall_id: 2, start_time: '2026-04-12T19:00:00+05:00', start_date: '2026-04-12', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
    { id: 51, movie_id: 3, hall_id: 1, start_time: '2026-04-12T21:00:00+05:00', start_date: '2026-04-12', price: 60000, hall: { id: 1, name: 'Zal 1' } },
  ],
  '2026-04-15': [
    { id: 52, movie_id: 1, hall_id: 1, start_time: '2026-04-15T14:00:00+05:00', start_date: '2026-04-15', price: 50000, hall: { id: 1, name: 'Zal 1' } },
    { id: 53, movie_id: 6, hall_id: 2, start_time: '2026-04-15T18:00:00+05:00', start_date: '2026-04-15', price: 80000, hall: { id: 2, name: 'VIP Zal' } },
  ],
};

export const mockSeatMap: SeatMap = {
  rows: [
    {
      row_number: 1,
      seats: [
        { id: 1, row: 1, number: 1, is_active: true, is_booked: false },
        { id: 2, row: 1, number: 2, is_active: true, is_booked: true },
        { id: 3, row: 1, number: 3, is_active: true, is_booked: false },
        { id: 4, row: 1, number: 4, is_active: true, is_booked: false },
        { id: 5, row: 1, number: 5, is_active: true, is_booked: true },
        { id: 6, row: 1, number: 6, is_active: true, is_booked: false },
        { id: 100, row: 1, number: 7, is_active: true, is_booked: false },
        { id: 101, row: 1, number: 8, is_active: true, is_booked: false },
      ],
    },
    {
      row_number: 2,
      seats: [
        { id: 7, row: 2, number: 1, is_active: true, is_booked: false },
        { id: 8, row: 2, number: 2, is_active: true, is_booked: false },
        { id: 9, row: 2, number: 3, is_active: true, is_booked: true },
        { id: 10, row: 2, number: 4, is_active: true, is_booked: false },
        { id: 11, row: 2, number: 5, is_active: true, is_booked: false },
        { id: 12, row: 2, number: 6, is_active: true, is_booked: false },
        { id: 102, row: 2, number: 7, is_active: true, is_booked: true },
        { id: 103, row: 2, number: 8, is_active: true, is_booked: false },
      ],
    },
    {
      row_number: 3,
      seats: [
        { id: 13, row: 3, number: 1, is_active: true, is_booked: false },
        { id: 14, row: 3, number: 2, is_active: true, is_booked: false },
        { id: 15, row: 3, number: 3, is_active: true, is_booked: false },
        { id: 16, row: 3, number: 4, is_active: true, is_booked: true },
        { id: 17, row: 3, number: 5, is_active: true, is_booked: false },
        { id: 18, row: 3, number: 6, is_active: true, is_booked: false },
        { id: 104, row: 3, number: 7, is_active: true, is_booked: false },
        { id: 105, row: 3, number: 8, is_active: true, is_booked: true },
      ],
    },
    {
      row_number: 4,
      seats: [
        { id: 19, row: 4, number: 1, is_active: true, is_booked: false },
        { id: 20, row: 4, number: 2, is_active: true, is_booked: false },
        { id: 21, row: 4, number: 3, is_active: true, is_booked: false },
        { id: 22, row: 4, number: 4, is_active: true, is_booked: false },
        { id: 23, row: 4, number: 5, is_active: true, is_booked: true },
        { id: 24, row: 4, number: 6, is_active: true, is_booked: true },
        { id: 106, row: 4, number: 7, is_active: true, is_booked: false },
        { id: 107, row: 4, number: 8, is_active: true, is_booked: false },
      ],
    },
    {
      row_number: 5,
      seats: [
        { id: 25, row: 5, number: 1, is_active: true, is_booked: false },
        { id: 26, row: 5, number: 2, is_active: true, is_booked: false },
        { id: 27, row: 5, number: 3, is_active: true, is_booked: true },
        { id: 28, row: 5, number: 4, is_active: true, is_booked: false },
        { id: 29, row: 5, number: 5, is_active: true, is_booked: false },
        { id: 30, row: 5, number: 6, is_active: true, is_booked: false },
        { id: 108, row: 5, number: 7, is_active: true, is_booked: false },
        { id: 109, row: 5, number: 8, is_active: true, is_booked: false },
      ],
    },
    {
      row_number: 6,
      seats: [
        { id: 31, row: 6, number: 1, is_active: true, is_booked: false },
        { id: 32, row: 6, number: 2, is_active: true, is_booked: true },
        { id: 33, row: 6, number: 3, is_active: true, is_booked: false },
        { id: 34, row: 6, number: 4, is_active: true, is_booked: false },
        { id: 35, row: 6, number: 5, is_active: true, is_booked: false },
        { id: 36, row: 6, number: 6, is_active: true, is_booked: true },
        { id: 110, row: 6, number: 7, is_active: true, is_booked: false },
        { id: 111, row: 6, number: 8, is_active: true, is_booked: false },
      ],
    },
  ],
};

export const mockBookings: Booking[] = [
  {
    id: 42,
    status: 'confirmed',
    status_label: 'Tasdiqlangan',
    ticket_code: 'TKT-A1B2C3D4',
    showtime: {
      id: 10,
      movie_id: 1,
      hall_id: 1,
      start_time: '2026-03-20T19:00:00+05:00',
      start_date: '2026-03-20',
      price: 50000,
      hall: { id: 1, name: 'Zal 1' },
      movie: mockMovies[0],
    },
    seats: [
      { id: 1, row: 1, number: 1, is_active: true, is_booked: false },
      { id: 3, row: 1, number: 3, is_active: true, is_booked: false },
    ],
    total_price: 100000,
    can_cancel: false,
    created_at: '2026-03-18T10:30:00+05:00',
  },
  {
    id: 43,
    status: 'pending',
    status_label: 'Kutilmoqda',
    ticket_code: null,
    showtime: {
      id: 11,
      movie_id: 2,
      hall_id: 1,
      start_time: '2026-03-21T17:00:00+05:00',
      start_date: '2026-03-21',
      price: 55000,
      hall: { id: 1, name: 'Zal 1' },
      movie: mockMovies[1],
    },
    seats: [
      { id: 7, row: 2, number: 1, is_active: true, is_booked: false },
    ],
    total_price: 55000,
    can_cancel: true,
    created_at: '2026-03-18T12:00:00+05:00',
  },
  {
    id: 44,
    status: 'cancelled',
    status_label: 'Bekor qilingan',
    ticket_code: null,
    showtime: {
      id: 12,
      movie_id: 3,
      hall_id: 2,
      start_time: '2026-03-19T20:00:00+05:00',
      start_date: '2026-03-19',
      price: 80000,
      hall: { id: 2, name: 'VIP Zal' },
      movie: mockMovies[2],
    },
    seats: [
      { id: 13, row: 3, number: 1, is_active: true, is_booked: false },
      { id: 14, row: 3, number: 2, is_active: true, is_booked: false },
    ],
    total_price: 160000,
    can_cancel: false,
    created_at: '2026-03-17T15:00:00+05:00',
  },
];

export const mockBookingStats: BookingStats = {
  total: 12,
  confirmed: 8,
  pending: 2,
  cancelled: 2,
};

export const mockProfile: Profile = {
  id: 1,
  telegram_id: '123456789',
  first_name: 'Ali',
  last_name: 'Valiyev',
  username: 'alivaliyev',
  phone: '+998901234567',
  language: 'uz',
  bookings_count: 12,
};

export const mockMovieRequests: MovieRequest[] = [
  {
    id: 5,
    movie_name: 'Inception 2',
    movie_year: 2026,
    trailer_url: 'https://youtube.com/watch?v=abc123',
    preferred_date: '2026-04-01',
    preferred_time: '19:00',
    guests_count: 10,
    status: 'pending',
    status_label: 'Kutilmoqda',
    admin_note: null,
    created_at: '2026-03-18T10:00:00+05:00',
  },
  {
    id: 4,
    movie_name: 'Interstellar',
    movie_year: 2014,
    trailer_url: null,
    preferred_date: '2026-03-25',
    preferred_time: '20:00',
    guests_count: 5,
    status: 'approved',
    status_label: 'Tasdiqlangan',
    admin_note: '25-mart kuni 20:00 da ko\'rsatamiz!',
    created_at: '2026-03-15T09:00:00+05:00',
  },
];

export const mockContactInfo: ContactInfo = {
  phone: '+998 90 123 45 67',
  telegram: 'https://t.me/bookingone_uz',
  instagram: 'https://instagram.com/bookingone_uz',
};
