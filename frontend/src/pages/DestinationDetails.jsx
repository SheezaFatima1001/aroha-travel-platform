import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function DestinationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [destination, setDestination] = useState(null);
  const [status, setStatus] = useState('loading');
  const [favorites, setFavorites] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get(`/destinations/${id}`);
      setDestination(data.data);
      setStatus('ready');

      if (user) {
        api.post(`/users/recently-viewed/${id}`).catch(() => {});
        api.get('/users/favorites').then((res) => setFavorites(res.data.data.map((f) => f._id))).catch(() => {});
      }
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isFavorite = favorites.includes(id);

  const toggleFavorite = async () => {
    if (!user) return;
    setBusy(true);
    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/${id}`);
        setFavorites((f) => f.filter((x) => x !== id));
      } else {
        await api.post(`/users/favorites/${id}`);
        setFavorites((f) => [...f, id]);
      }
    } finally {
      setBusy(false);
    }
  };

  if (status === 'loading') return <Loading label="Loading destination" />;
  if (status === 'error' || !destination) return <ErrorMessage message="Destination not found." />;

  return (
    <div>
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-dusk/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-10 pb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">{destination.category}</p>
          <h1 className="font-display text-4xl sm:text-5xl text-stone">{destination.name}</h1>
          <p className="font-body text-stone/70 mt-2">{destination.location}, {destination.country}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <p className="font-body text-stone/70 leading-relaxed text-lg">{destination.description}</p>
        </div>
        <div className="space-y-6">
          <div className="bg-duskdeep border border-stone/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between font-mono text-sm">
              <span className="text-stone/50">Rating</span>
              <span className="text-stone">&#9733; {destination.rating?.toFixed(1)}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-stone/50">Popularity</span>
              <span className="text-stone">{destination.popularity}</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span className="text-stone/50">Featured</span>
              <span className="text-stone">{destination.featured ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {user ? (
            <button
              onClick={toggleFavorite}
              disabled={busy}
              className={`w-full px-6 py-3 rounded-full font-body text-sm font-medium transition-colors ${
                isFavorite ? 'bg-clay text-stone hover:bg-clay/80' : 'bg-amber text-dusk hover:bg-stone'
              }`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-center w-full px-6 py-3 rounded-full border border-stone/20 font-body text-sm text-stone hover:border-amber hover:text-amber"
            >
              Login to save favorites
            </Link>
          )}

          <Link
            to="/trips/create"
            state={{ destinationId: destination._id }}
            className="block text-center w-full px-6 py-3 rounded-full border border-amber text-amber font-body text-sm hover:bg-amber hover:text-dusk transition-colors"
          >
            Plan a Trip Here
          </Link>
        </div>
      </div>
    </div>
  );
}
