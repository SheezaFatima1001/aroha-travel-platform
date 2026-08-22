import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import Hero from '../components/Hero.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const CATEGORIES = ['Mountains', 'Beaches', 'Historical', 'Cultural', 'Adventure', 'Cities', 'Nature', 'Religious', 'Luxury'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [all, setAll] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const [featuredRes, allRes] = await Promise.all([
        api.get('/destinations', { params: { featured: true } }),
        api.get('/destinations'),
      ]);
      setFeatured(featuredRes.data.data);
      setAll(allRes.data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <Hero />

      {/* Featured destinations */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Featured</p>
            <h2 className="font-display text-3xl sm:text-4xl text-stone">Where to go first</h2>
          </div>
          <Link to="/destinations" className="font-body text-sm text-stone/60 hover:text-amber hidden sm:block">
            View all destinations &rarr;
          </Link>
        </div>

        {status === 'loading' && <Loading label="Loading destinations" />}
        {status === 'error' && <ErrorMessage message="Couldn't load destinations right now." onRetry={load} />}
        {status === 'ready' && featured.length === 0 && (
          <p className="font-body text-stone/50">No featured destinations yet.</p>
        )}
        {status === 'ready' && featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-duskdeep py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Browse by category</p>
          <h2 className="font-display text-3xl sm:text-4xl text-stone mb-10">What kind of trip?</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to={`/destinations?category=${c}`}
                className="px-5 py-2.5 rounded-full border border-stone/15 font-body text-sm text-stone/80 hover:border-amber hover:text-amber transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All destinations preview */}
      {status === 'ready' && all.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-10 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">All destinations</p>
          <h2 className="font-display text-3xl sm:text-4xl text-stone mb-10">Explore the map</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {all.slice(0, 8).map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-amber mb-4">About Aroha</p>
        <h2 className="font-display text-3xl sm:text-4xl text-stone mb-6">
          Built for people who plan, not just book.
        </h2>
        <p className="font-body text-stone/60 max-w-2xl mx-auto leading-relaxed">
          Aroha exists because most travel sites sell you a package and call it a day.
          We give you the raw material instead &mdash; real destination data, a day-by-day
          itinerary builder, and travel services you can book directly &mdash; so the trip
          you plan is actually the trip you wanted.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mt-16 text-left">
          {[
            ['Explore', 'Search and filter real destination data, not stock photo placeholders.'],
            ['Plan', 'Build a day-by-day itinerary with activities, timing, and location.'],
            ['Book', 'Reserve hotels, guides, transport, and tours with transparent pricing.'],
            ['Track', 'See every trip and booking in one personalized dashboard.'],
          ].map(([title, desc]) => (
            <div key={title}>
              <h3 className="font-display text-lg text-amber mb-2">{title}</h3>
              <p className="font-body text-sm text-stone/50">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
