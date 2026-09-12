import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const STATUSES = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

const statusColor = {
  Pending: 'text-amber',
  Confirmed: 'text-teal',
  Cancelled: 'text-clay',
  Completed: 'text-stone/50',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setStatus('loading');
    try {
      const params = filter ? { status: filter } : {};
      const { data } = await api.get('/bookings/admin/all', { params });
      setBookings(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const changeStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, bookingStatus: newStatus } : b)));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded-full font-body text-xs border transition-colors ${!filter ? 'bg-amber text-dusk border-amber' : 'border-stone/15 text-stone/60 hover:border-amber hover:text-amber'}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full font-body text-xs border transition-colors ${filter === s ? 'bg-amber text-dusk border-amber' : 'border-stone/15 text-stone/60 hover:border-amber hover:text-amber'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {status === 'loading' && <Loading label="Loading bookings" />}
      {status === 'error' && <ErrorMessage message="Couldn't load bookings." onRetry={load} />}
      {status === 'ready' && bookings.length === 0 && <EmptyState title="No bookings found." />}

      {status === 'ready' && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b._id} className="border border-stone/10 rounded-2xl p-5 bg-duskdeep flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${statusColor[b.bookingStatus]}`}>{b.bookingId}</p>
                <p className="font-display text-base text-stone">{b.service?.serviceName || 'Service unavailable'}</p>
                <p className="font-body text-xs text-stone/50 mt-1">
                  {b.user?.name} ({b.user?.email}) &middot; {new Date(b.bookingDate).toLocaleDateString()} &middot; {b.numberOfPeople} people &middot; ${b.totalPrice}
                </p>
              </div>
              <select
                value={b.bookingStatus}
                onChange={(e) => changeStatus(b._id, e.target.value)}
                disabled={updating === b._id}
                className="bg-dusk border border-stone/15 rounded-full px-4 py-2 font-body text-xs text-stone focus:border-amber outline-none disabled:opacity-50"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}