import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api
      .get(`/bookings/${id}`)
      .then((res) => {
        setBooking(res.data.data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  if (status === 'loading') return <Loading label="Loading confirmation" />;
  if (status === 'error' || !booking) return <ErrorMessage message="Booking not found." />;

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-teal/20 border border-teal flex items-center justify-center mx-auto mb-8">
        <span className="text-teal text-2xl">&#10003;</span>
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Booking Successful</p>
      <h1 className="font-display text-4xl text-stone mb-10">You&rsquo;re all set.</h1>

      <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep space-y-3 text-left">
        {[
          ['Booking ID', booking.bookingId],
          ['Service', booking.service.serviceName],
          ['Booking date', new Date(booking.bookingDate).toLocaleDateString()],
          ['Number of people', booking.numberOfPeople],
          ['Total price', `$${booking.totalPrice}`],
          ['Status', booking.bookingStatus],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between font-body text-sm">
            <span className="text-stone/50">{label}</span>
            <span className="text-stone">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-10">
        <Link
          to="/bookings"
          className="flex-1 px-6 py-3.5 border border-stone/20 text-stone font-body font-medium rounded-full hover:border-amber hover:text-amber transition-colors"
        >
          View booking history
        </Link>
        <Link
          to="/services"
          className="flex-1 px-6 py-3.5 bg-amber text-dusk font-body font-semibold rounded-full hover:bg-stone transition-colors"
        >
          Browse more services
        </Link>
      </div>
    </div>
  );
}
