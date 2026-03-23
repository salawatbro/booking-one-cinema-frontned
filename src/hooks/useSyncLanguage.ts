import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { isTelegram } from '@/lib/api';
import * as api from '@/lib/api';

export function useSyncLanguage(): void {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    enabled: isAuthenticated && !isTelegram(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!profile?.language) return;
    if (profile.language !== i18n.language) {
      i18n.changeLanguage(profile.language);
      localStorage.setItem('language', profile.language);
    }
  }, [profile?.language, i18n]);
}
