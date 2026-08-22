import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDeviceTier } from '../hooks/useDeviceTier.js';
import HeroStatic from '../three/HeroStatic.jsx';

const HeroScene = lazy(() => import('../three/HeroScene.jsx'));

export default function Hero() {
  const { tier, ready } = useDeviceTier();
  const scrollRef = useRef(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = rect.height;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      scrollRef.current = progress;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[130vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {ready && (tier === 'full' || tier === 'lite') ? (
          <Suspense fallback={<HeroStatic />}>
            <HeroScene scrollRef={scrollRef} lite={tier === 'lite'} />
          </Suspense>
        ) : (
          <HeroStatic />
        )}

        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-10 lg:px-20 max-w-4xl">
          <p className="font-mono text-xs tracking-[0.3em] text-amber uppercase mb-6">
            Gilgit&ndash;Baltistan &middot; Swat &middot; The Karakoram
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] text-stone mb-6">
            The high country
            <br />
            asks you to <em className="italic text-amber not-italic font-normal">climb</em>.
          </h1>
          <p className="font-body text-stone/70 text-lg max-w-xl mb-10">
            Plan real journeys through Pakistan&rsquo;s northern valleys &mdash; glacier
            treks, riverside stays, and itineraries built day by day, not template by
            template.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/destinations"
              className="px-7 py-3.5 bg-amber text-dusk font-body font-semibold rounded-full hover:bg-stone transition-colors duration-300"
            >
              Explore destinations
            </Link>
            <Link
              to="/trips/create"
              className="px-7 py-3.5 border border-stone/30 text-stone font-body font-medium rounded-full hover:border-amber hover:text-amber transition-colors duration-300"
            >
              Plan your trip
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-widest text-stone/50 uppercase">
          Scroll to descend
        </div>
      </div>
    </section>
  );
}
