import { useEffect, useState, useCallback } from 'react';
import api from '../services/api.js';
import PreferenceForm from '../components/PreferenceForm.jsx';
import RecommendedDestinationCard from '../components/RecommendedDestinationCard.jsx';
import RecommendedServiceCard from '../components/RecommendedServiceCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Recommendations() {
  const [destinations, setDestinations] = useState([]);
  const [services, setServices] = useState([]);
  const [personalized, setPersonalized] = useState(false);
  const [status, setStatus] = useState('loading');
  const [showPreferences, setShowPreferences] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [destRes, servRes] = await Promise.all([
        api.get('/recommendations/destinations', { params: { limit: 8 } }),
        api.get('/recommendations/services', { params: { limit: 6 } }),
      ]);
      setDestinations(destRes.data.data);
      setServices(servRes.data.data);
      setPersonalized(destRes.data.personalized || servRes.data.personalized);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">For You</p>
      <h1 className="font-display text-4xl text-stone mb-3">Recommended For You</h1>
      <p className="font-body text-stone/60 max-w-xl mb-8">
        Tell us how you like to travel, and we&rsquo;ll rank destinations and services by how well
        they fit &mdash; using your preferences, your favorites, and what you&rsquo;ve viewed before.
      </p>

      <div className="mb-4">
        <button
          onClick={() => setShowPreferences((v) => !v)}
          className="px-5 py-2.5 border border-stone/20 text-stone font-body text-sm rounded-full hover:border-amber hover:text-amber transition-colors"
        >
          {showPreferences ? 'Hide preferences' : 'Set your preferences'}
        </button>
      </div>

      {showPreferences && (
        <div className="mb-12">
          <PreferenceForm onSaved={load} />
        </div>
      )}

      {status === 'loading' && <Loading label="Building your recommendations" />}
      {status === 'error' && <ErrorMessage message="Couldn't load recommendations right now." onRetry={load} />}

      {status === 'ready' && !personalized && (
        <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep mb-10">
          <p className="font-body text-sm text-stone/60">
            You haven&rsquo;t set any preferences yet, so we&rsquo;re showing what&rsquo;s popular with other
            travelers. Set your preferences above for picks tailored to you.
          </p>
        </div>
      )}

      {status === 'ready' && (
        <>
          <section className="mb-16">
            <h2 className="font-display text-2xl text-stone mb-6">Destinations</h2>
            {destinations.length === 0 ? (
              <EmptyState title="No destinations available yet." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((d) => (
                  <RecommendedDestinationCard key={d._id} destination={d} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl text-stone mb-6">Services</h2>
            {services.length === 0 ? (
              <EmptyState title="No services available yet." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => (
                  <RecommendedServiceCard key={s._id} service={s} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}