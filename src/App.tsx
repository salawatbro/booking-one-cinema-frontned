import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@/hooks/useTheme';
import { ToastProvider } from '@/hooks/useToast';
import { AuthProvider } from '@/hooks/useAuth';
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
import { LoginPage } from '@/pages/LoginPage';
import { RequireAuth } from '@/components/RequireAuth';
import { useSyncLanguage } from '@/hooks/useSyncLanguage';

function LanguageSync() {
  useSyncLanguage();
  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        try { tg.requestFullscreen(); } catch { /* unsupported in older versions */ }
        try { tg.disableVerticalSwipes(); } catch { /* unsupported in older versions */ }
      }
    }
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <ThemeProvider>
      <ToastProvider>
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        <ErrorBoundary>
          <LanguageSync />
          <BrowserRouter>
            <div className="min-h-screen bg-bg">
              <Header />
              <main style={{ maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<MovieDetailPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes */}
                <Route path="/seats/:showtimeId" element={<RequireAuth><SeatSelectionPage /></RequireAuth>} />
                <Route path="/booking-confirm/:showtimeId" element={<RequireAuth><BookingConfirmPage /></RequireAuth>} />
                <Route path="/payment" element={<RequireAuth><PaymentPage /></RequireAuth>} />
                <Route path="/booking-success" element={<RequireAuth><BookingSuccessPage /></RequireAuth>} />
                <Route path="/bookings" element={<RequireAuth><BookingsPage /></RequireAuth>} />
                <Route path="/bookings/:id" element={<RequireAuth><BookingDetailPage /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                <Route path="/movie-requests" element={<RequireAuth><MovieRequestsPage /></RequireAuth>} />
                <Route path="/movie-requests/new" element={<RequireAuth><MovieRequestFormPage /></RequireAuth>} />
              </Routes>
              </main>
              <BottomNav />
            </div>
          </BrowserRouter>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
