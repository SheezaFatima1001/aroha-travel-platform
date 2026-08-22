import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const statusColor = {
  Pending: 'text-amber',
  Confirmed: 'text-teal',
  Cancelled: 'text-clay',
  Completed: 'text-stone/50',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/bookings');
      setBookings(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancelBooking = async (id) => {
    await api.patch(`/bookings/${id}/cancel`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Bookings</p>
      <h1 className="font-display text-4xl text-stone mb-10">Booking History</h1>

      {status === 'loading' && <Loading label="Loading bookings" />}
      {status === 'error' && <ErrorMessage message="Couldn't load your bookings." onRetry={load} />}
      {status === 'ready' && bookings.length === 0 && (
        <EmptyState
          title="No bookings yet."
          description="Book a travel service and it will show up here."
          action={
            <Link to="/services" className="mt-2 px-6 py-3 bg-amber text-dusk rounded-full font-body text-sm font-medium">
              Browse services
            </Link>
          }
        />
      )}

      {status === 'ready' && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep flex items-center justify-between gap-6 flex-wrap">
              <div>
                <p className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${statusColor[b.bookingStatus]}`}>
                  {b.bookingStatus}
                </p>
                <h3 className="font-display text-lg text-stone">{b.service?.serviceName || 'Service unavailable'}</h3>
                <p className="font-body text-xs text-stone/50 mt-1">
                  {b.bookingId} &middot; {new Date(b.bookingDate).toLocaleDateString()} &middot; {b.numberOfPeople} people
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-xl text-amber">${b.totalPrice}</span>
                {['Pending', 'Confirmed'].includes(b.bookingStatus) && (
                  <button onClick={() => cancelBooking(b._id)} className="font-body text-xs text-clay hover:underline">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
