import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Film, Calendar, Clock, Users, Link, Hash } from 'lucide-react';

export function MovieRequestFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    movie_name: '', movie_year: '', trailer_url: '',
    preferred_date: '', preferred_time: '', guests_count: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/movie-requests');
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border" style={{ padding: '0 16px', height: 56 }}>
        <button
          onClick={() => navigate(-1)}
          className="h-9 w-9 flex items-center justify-center hover:bg-bg-secondary active:opacity-70 transition-opacity"
          style={{ borderRadius: 8 }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-[15px] font-semibold text-text-primary">Kino so'rash</h1>
      </div>

      {/* Description */}
      <div className="bg-bg-secondary" style={{ padding: '12px 16px', margin: 0 }}>
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Ko'rmoqchi bo'lgan kinongizni yozing. Adminlar ko'rib chiqib, jadvalga qo'shadi.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '16px 16px 0' }}>
        {/* Movie name */}
        <div style={{ marginBottom: 14 }}>
          <label className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Film size={13} /> Kino nomi <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={255}
            placeholder="Masalan: Inception 2"
            value={form.movie_name}
            onChange={(e) => setForm({ ...form, movie_name: e.target.value })}
            className="w-full bg-bg-secondary border border-border text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
            style={{ height: 44, padding: '0 12px', borderRadius: 6 }}
          />
        </div>

        {/* Year */}
        <div style={{ marginBottom: 14 }}>
          <label className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Hash size={13} /> Chiqarilgan yil
          </label>
          <input
            type="number"
            min={1900}
            max={2030}
            placeholder="2026"
            value={form.movie_year}
            onChange={(e) => setForm({ ...form, movie_year: e.target.value })}
            className="w-full bg-bg-secondary border border-border text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
            style={{ height: 44, padding: '0 12px', borderRadius: 6 }}
          />
        </div>

        {/* Trailer URL */}
        <div style={{ marginBottom: 14 }}>
          <label className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Link size={13} /> Trailer havolasi
          </label>
          <input
            type="url"
            maxLength={500}
            placeholder="https://youtube.com/watch?v=..."
            value={form.trailer_url}
            onChange={(e) => setForm({ ...form, trailer_url: e.target.value })}
            className="w-full bg-bg-secondary border border-border text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
            style={{ height: 44, padding: '0 12px', borderRadius: 6 }}
          />
        </div>

        {/* Date + Time */}
        <div className="flex" style={{ gap: 10, marginBottom: 14 }}>
          <div className="flex-1">
            <label className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
              <Calendar size={13} /> Qulay sana
            </label>
            <input
              type="date"
              value={form.preferred_date}
              onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
              className="w-full bg-bg-secondary border border-border text-[14px] text-text-primary outline-none focus:border-accent transition-colors"
              style={{ height: 44, padding: '0 12px', borderRadius: 6 }}
            />
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
              <Clock size={13} /> Qulay vaqt
            </label>
            <input
              type="time"
              value={form.preferred_time}
              onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
              className="w-full bg-bg-secondary border border-border text-[14px] text-text-primary outline-none focus:border-accent transition-colors"
              style={{ height: 44, padding: '0 12px', borderRadius: 6 }}
            />
          </div>
        </div>

        {/* Guests count */}
        <div style={{ marginBottom: 20 }}>
          <label className="flex items-center gap-1.5 text-[12px] font-medium text-text-secondary" style={{ marginBottom: 6 }}>
            <Users size={13} /> Mehmonlar soni <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            required
            min={1}
            max={50}
            placeholder="5"
            value={form.guests_count}
            onChange={(e) => setForm({ ...form, guests_count: e.target.value })}
            className="w-full bg-bg-secondary border border-border text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors"
            style={{ height: 44, padding: '0 12px', borderRadius: 6 }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-accent text-white text-[14px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
          style={{ height: 48, borderRadius: 8 }}
        >
          <Send size={14} /> So'rov yuborish
        </button>
      </form>
    </div>
  );
}
