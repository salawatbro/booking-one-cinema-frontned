import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { MovieDetailPage } from '@/pages/MovieDetailPage';
import { SeatSelectionPage } from '@/pages/SeatSelectionPage';
import { BookingConfirmPage } from '@/pages/BookingConfirmPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { BookingSuccessPage } from '@/pages/BookingSuccessPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { BookingDetailPage } from '@/pages/BookingDetailPage';
import { SchedulePage } from '@/pages/SchedulePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { MovieRequestsPage } from '@/pages/MovieRequestsPage';
import { MovieRequestFormPage } from '@/pages/MovieRequestFormPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/seats/:showtimeId" element={<SeatSelectionPage />} />
            <Route path="/booking-confirm/:showtimeId" element={<BookingConfirmPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/booking-success" element={<BookingSuccessPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/movie-requests" element={<MovieRequestsPage />} />
            <Route path="/movie-requests/new" element={<MovieRequestFormPage />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
