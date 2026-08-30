import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import SafeImage from '../components/SafeImage.jsx';
import ReviewSection from '../components/ReviewSection.jsx';

export default function ServiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get(`/services/${id}`);
      setService(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === 'loading') return <Loading label="Loading service" />;
  if (status === 'error' || !service) return <ErrorMessage message="Service not found." />;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="rounded-2xl overflow-hidden aspect-[4/3]">
        <SafeImage src={service.image} alt={service.serviceName} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">{service.category}</p>
        <h1 className="font-display text-4xl text-stone mb-2">{service.serviceName}</h1>
        <p className="font-body text-stone/60 mb-6">{service.location}</p>
        <p className="font-body text-stone/70 leading-relaxed mb-8">{service.description}</p>

        {service.features?.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 mb-8">
            {service.features.map((f) => (
              <li key={f} className="font-body text-sm text-stone/70 flex items-center gap-2">
                <span className="text-amber">&#10003;</span> {f}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between border-t border-b border-stone/10 py-6 mb-8">
          <div>
            <p className="font-mono text-xs text-stone/50 uppercase tracking-widest">Price per person</p>
            <p className="font-display text-3xl text-stone">${service.price}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-stone/50 uppercase tracking-widest">Rating</p>
            <p className="font-display text-3xl text-stone">&#9733; {service.rating?.toFixed(1)}</p>
          </div>
        </div>

        {!service.availability && (
          <p className="font-body text-clay text-sm mb-4">This service is currently unavailable for booking.</p>
        )}

        {user ? (
          <Link
            to={`/bookings/new/${service._id}`}
            className={`block text-center w-full px-6 py-4 rounded-full font-body text-sm font-semibold transition-colors ${
              service.availability
                ? 'bg-amber text-dusk hover:bg-stone'
                : 'bg-stone/10 text-stone/40 pointer-events-none'
            }`}
          >
            Book Now
          </Link>
        ) : (
          <Link
            to="/login"
            className="block text-center w-full px-6 py-4 rounded-full border border-amber text-amber font-body text-sm font-semibold hover:bg-amber hover:text-dusk transition-colors"
          >
            Login to Book
          </Link>
        )}
      </div>
      </div>

      <div className="pt-24">
        <ReviewSection targetType="Service" targetId={service._id} />
      </div>
    </div>
  );
}