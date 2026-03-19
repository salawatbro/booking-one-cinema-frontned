import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/hooks/useTheme';
import { ToastProvider } from '@/hooks/useToast';
import { SplashScreen } from '@/components/SplashScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        tg.requestFullscreen();
        tg.disableVerticalSwipes();
      }
    }
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ToastProvider>
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        <ErrorBoundary>
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
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
