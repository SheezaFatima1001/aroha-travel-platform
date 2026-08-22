import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const statusColor = {
  Planned: 'text-amber',
  Ongoing: 'text-teal',
  Completed: 'text-stone/50',
  Cancelled: 'text-clay',
};

export default function Trips() {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const [statsRes, tripsRes] = await Promise.all([api.get('/trips/stats'), api.get('/trips')]);
      setStats(statsRes.data.data);
      setTrips(tripsRes.data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (status === 'loading') return <Loading label="Loading trips" />;
  if (status === 'error') return <ErrorMessage message="Couldn't load your trips." onRetry={load} />;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Trip Planner</p>
          <h1 className="font-display text-4xl text-stone">My Trips</h1>
        </div>
        <Link to="/trips/create" className="px-6 py-3 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors">
          New Trip
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            ['Total Trips', stats.totalTrips],
            ['Upcoming', stats.upcomingTrips.length],
            ['Completed', stats.completedTrips.length],
            ['Planned Days', stats.totalPlannedDays],
          ].map(([label, value]) => (
            <div key={label} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
              <p className="font-display text-3xl text-amber">{value}</p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-stone/50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {trips.length === 0 ? (
        <EmptyState
          title="No trips planned yet."
          description="Create your first trip and start building an itinerary."
          action={
            <Link to="/trips/create" className="mt-2 px-6 py-3 bg-amber text-dusk rounded-full font-body text-sm font-medium">
              Plan a trip
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((t) => (
            <Link
              key={t._id}
              to={`/trips/${t._id}`}
              className="block border border-stone/10 rounded-2xl p-6 bg-duskdeep hover:border-amber/40 transition-colors"
            >
              <p className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${statusColor[t.status]}`}>{t.status}</p>
              <h3 className="font-display text-xl text-stone mb-1">{t.tripName}</h3>
              <p className="font-body text-sm text-stone/50 mb-4">{t.destination?.name}</p>
              <p className="font-mono text-xs text-stone/40">
                {new Date(t.startDate).toLocaleDateString()} &rarr; {new Date(t.endDate).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
