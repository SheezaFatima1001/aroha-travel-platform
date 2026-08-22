import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/users/favorites');
      setFavorites(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Saved</p>
      <h1 className="font-display text-4xl text-stone mb-10">Your Favorites</h1>

      {status === 'loading' && <Loading label="Loading favorites" />}
      {status === 'error' && <ErrorMessage message="Couldn't load your favorites." onRetry={load} />}
      {status === 'ready' && favorites.length === 0 && (
        <EmptyState
          title="No favorites yet."
          description="Save destinations you're interested in and they'll show up here."
          action={
            <Link to="/destinations" className="mt-2 px-6 py-3 bg-amber text-dusk rounded-full font-body text-sm font-medium">
              Explore destinations
            </Link>
          }
        />
      )}
      {status === 'ready' && favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((d) => (
            <DestinationCard key={d._id} destination={d} />
          ))}
        </div>
      )}
    </div>
  );
}
