import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Armchair } from 'lucide-react';
import { SeatGrid } from '@/components/SeatGrid';
import { formatPrice, formatTime, formatDuration } from '@/lib/utils';
import { mockSeatMap, mockMovies, mockShowtimesByDate } from '@/mock/data';

export function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const allShowtimes = Object.values(mockShowtimesByDate).flat();
  const showtime = allShowtimes.find((s) => s.id === Number(showtimeId));
  const movie = mockMovies.find((m) => m.id === showtime?.movie_id);
  const totalPrice = selectedSeats.length * (showtime?.price || 0);

  const allSeats = mockSeatMap.rows.flatMap((r) => r.seats);
  const selected = allSeats.filter((s) => selectedSeats.includes(s.id));

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) => prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        <button
          onClick={() => navigate(-1)}
          className="h-9 w-9 flex items-center justify-center hover:bg-bg-secondary active:opacity-70 transition-opacity"
          style={{ borderRadius: 8 }}
        >
          <ArrowLeft size={18} className="text-text-primary" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-[15px] font-semibold text-text-primary truncate">{movie?.name}</h1>
          <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
            {showtime && (
              <>
                <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(showtime.start_time)}</span>
                <span className="flex items-center gap-1"><MapPin size={10} /> {showtime.hall?.name}</span>
                {movie && <span>{formatDuration(movie.duration)}</span>}
              </>
            )}
          </div>
        </div>
        {showtime && (
          <span className="text-[13px] font-semibold text-accent">{formatPrice(showtime.price)}/joy</span>
        )}
      </div>

      {/* Seat grid */}
      <div className="flex-1 overflow-auto" style={{ padding: '24px 8px' }}>
        <SeatGrid seatMap={mockSeatMap} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
      </div>

      {/* Bottom bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 bg-bg-card border-t border-border" style={{ padding: '12px 16px 20px' }}>
          {/* Selected seats preview */}
          <div className="flex items-center gap-1.5 flex-wrap" style={{ marginBottom: 10 }}>
            <Armchair size={14} className="text-text-tertiary" />
            {selected.map((s) => (
              <span
                key={s.id}
                className="text-[11px] font-semibold text-accent bg-accent-light"
                style={{ padding: '2px 8px', borderRadius: 4 }}
              >
                Q{s.row}/{s.number}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-tertiary">{selectedSeats.length} ta joy tanlandi</p>
              <p className="text-[20px] font-bold text-text-primary">{formatPrice(totalPrice)}</p>
            </div>
            <button
              onClick={() => navigate(`/booking-confirm/${showtimeId}`, { state: { selectedSeats } })}
              className="bg-accent text-white text-[14px] font-semibold active:opacity-80 transition-opacity"
              style={{ height: 46, padding: '0 24px', borderRadius: 8 }}
            >
              Davom etish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
