import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebBackButtonProps {
  floating?: boolean;
}

export function WebBackButton({ floating }: WebBackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={cn(
        'flex items-center justify-center',
        floating
          ? 'bg-black/40 text-white hover:bg-black/60'
          : 'text-text-secondary hover:text-text-primary',
      )}
      style={{ width: 32, height: 32, borderRadius: floating ? 16 : 0 }}
    >
      <ArrowLeft size={20} />
    </button>
  );
}
