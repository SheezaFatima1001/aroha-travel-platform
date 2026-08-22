import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import ServiceCard from '../components/ServiceCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const CATEGORIES = ['Hotels', 'Tours', 'Transport', 'Activities', 'Packages', 'Guides'];

export default function Services() {
  const [params, setParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('loading');
  const category = params.get('category') || '';

  const load = async () => {
    setStatus('loading');
    try {
      const query = category ? { category } : {};
      const { data } = await api.get('/services', { params: query });
      setServices(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const setCategory = (c) => {
    const next = new URLSearchParams(params);
    if (c) next.set('category', c);
    else next.delete('category');
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Travel Services</p>
      <h1 className="font-display text-4xl text-stone mb-8">Book what you need</h1>

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

      {status === 'loading' && <Loading label="Loading services" />}
      {status === 'error' && <ErrorMessage message="Couldn't load services right now." onRetry={load} />}
      {status === 'ready' && services.length === 0 && (
        <EmptyState title="No services found." description="Try a different category." />
      )}
      {status === 'ready' && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
