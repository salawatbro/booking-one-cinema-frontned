import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
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
import { RequireAuth } from '@/components/RequireAuth';
import { useSyncLanguage } from '@/hooks/useSyncLanguage';

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage').then(m => ({ default: m.MovieDetailPage })));
const SeatSelectionPage = lazy(() => import('@/pages/SeatSelectionPage').then(m => ({ default: m.SeatSelectionPage })));
const BookingConfirmPage = lazy(() => import('@/pages/BookingConfirmPage').then(m => ({ default: m.BookingConfirmPage })));
const PaymentPage = lazy(() => import('@/pages/PaymentPage').then(m => ({ default: m.PaymentPage })));
const BookingSuccessPage = lazy(() => import('@/pages/BookingSuccessPage').then(m => ({ default: m.BookingSuccessPage })));
const BookingsPage = lazy(() => import('@/pages/BookingsPage').then(m => ({ default: m.BookingsPage })));
const BookingDetailPage = lazy(() => import('@/pages/BookingDetailPage').then(m => ({ default: m.BookingDetailPage })));
const SchedulePage = lazy(() => import('@/pages/SchedulePage').then(m => ({ default: m.SchedulePage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const MovieRequestsPage = lazy(() => import('@/pages/MovieRequestsPage').then(m => ({ default: m.MovieRequestsPage })));
const MovieRequestFormPage = lazy(() => import('@/pages/MovieRequestFormPage').then(m => ({ default: m.MovieRequestFormPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));

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
              <Suspense fallback={null}>
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
              </Suspense>
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
