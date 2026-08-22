import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const CATEGORIES = ['Mountains', 'Beaches', 'Historical', 'Cultural', 'Adventure', 'Cities', 'Nature', 'Religious', 'Luxury'];

export default function Destinations() {
  const [params, setParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState(params.get('search') || '');

  const category = params.get('category') || '';

  const load = async () => {
    setStatus('loading');
    try {
      const query = {};
      if (category) query.category = category;
      if (search) query.search = search;
      const { data } = await api.get('/destinations', { params: query });
      setDestinations(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, params.get('search')]);

  const submitSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (search) next.set('search', search);
    else next.delete('search');
    setParams(next);
  };

  const setCategory = (c) => {
    const next = new URLSearchParams(params);
    if (c) next.set('category', c);
    else next.delete('category');
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Destinations</p>
      <h1 className="font-display text-4xl text-stone mb-8">Find your next valley</h1>

      <form onSubmit={submitSearch} className="mb-6 flex gap-3 max-w-lg">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, country, or location&hellip;"
          className="flex-1 bg-duskdeep border border-stone/15 rounded-full px-5 py-3 font-body text-sm text-stone placeholder:text-stone/30 focus:border-amber outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-amber text-dusk font-body text-sm font-medium rounded-full hover:bg-stone transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-2 rounded-full font-body text-xs border transition-colors ${
            !category ? 'bg-amber text-dusk border-amber' : 'border-stone/15 text-stone/60 hover:border-amber hover:text-amber'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full font-body text-xs border transition-colors ${
              category === c ? 'bg-amber text-dusk border-amber' : 'border-stone/15 text-stone/60 hover:border-amber hover:text-amber'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {status === 'loading' && <Loading label="Searching destinations" />}
      {status === 'error' && <ErrorMessage message="Couldn't load destinations right now." onRetry={load} />}
      {status === 'ready' && destinations.length === 0 && (
        <EmptyState title="No destinations found." description="Try a different search term or category." />
      )}
      {status === 'ready' && destinations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <DestinationCard key={d._id} destination={d} />
          ))}
        </div>
      )}
    </div>
  );
}
