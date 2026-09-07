import { Link } from 'react-router-dom';
import SafeImage from './SafeImage.jsx';
import MatchBadge from './MatchBadge.jsx';

export default function RecommendedDestinationCard({ destination }) {
  return (
    <Link
      to={`/destinations/${destination._id}`}
      className="group block overflow-hidden rounded-2xl bg-duskdeep border border-stone/10 hover:border-amber/40 transition-colors"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <MatchBadge percent={destination.matchPercent} />
        </div>
      </div>
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber mb-1">{destination.category}</p>
        <h3 className="font-display text-lg text-stone mb-2">{destination.name}</h3>
        {destination.reasons?.length > 0 && (
          <p className="font-body text-xs text-stone/50 italic">
            &ldquo;Recommended because it {destination.reasons[0]}.&rdquo;
          </p>
        )}
      </div>
    </Link>
  );
}