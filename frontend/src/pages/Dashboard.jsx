import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const { data: res } = await api.get('/users/dashboard');
      setData(res.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (status === 'loading') return <Loading label="Loading dashboard" />;
  if (status === 'error' || !data) return <ErrorMessage message="Couldn't load your dashboard." onRetry={load} />;

  const stats = [
    ['Favorites', data.stats.favoritesCount],
    ['Trips', data.stats.tripsCount],
    ['Bookings', data.stats.bookingsCount],
    ['Recently viewed', data.stats.recentlyViewedCount],
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Dashboard</p>
      <h1 className="font-display text-4xl text-stone mb-10">
        Welcome back, {data.user.name?.split(' ')[0]}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
        {stats.map(([label, value]) => (
          <div key={label} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
            <p className="font-display text-3xl text-amber">{value}</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-stone/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-stone">Recently Viewed</h2>
          <Link to="/destinations" className="font-body text-sm text-stone/50 hover:text-amber">Browse more &rarr;</Link>
        </div>
        {data.recentlyViewed.length === 0 ? (
          <EmptyState title="Nothing viewed yet." description="Destinations you open will show up here." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.recentlyViewed.filter((r) => r.destination).map((r) => (
              <DestinationCard key={r.destination._id} destination={r.destination} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-stone">Favorites</h2>
          <Link to="/favorites" className="font-body text-sm text-stone/50 hover:text-amber">View all &rarr;</Link>
        </div>
        {data.favorites.length === 0 ? (
          <EmptyState title="No favorites saved." description="Save destinations you love to find them here." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.favorites.slice(0, 4).map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl text-stone mb-6">Recommended For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.featuredRecommendations.map((d) => (
            <DestinationCard key={d._id} destination={d} />
          ))}
        </div>
      </section>
    </div>
  );
}
