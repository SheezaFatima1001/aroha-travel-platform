import { Link } from 'react-router-dom';
import SafeImage from './SafeImage.jsx';
import MatchBadge from './MatchBadge.jsx';

export default function RecommendedServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service._id}`}
      className="group block overflow-hidden rounded-2xl bg-duskdeep border border-stone/10 hover:border-amber/40 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={service.image}
          alt={service.serviceName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <MatchBadge percent={service.matchPercent} />
        </div>
      </div>
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber mb-1">{service.category}</p>
        <h3 className="font-display text-lg text-stone mb-1">{service.serviceName}</h3>
        <p className="font-mono text-sm text-stone/60 mb-2">${service.price}</p>
        {service.reasons?.length > 0 && (
          <p className="font-body text-xs text-stone/50 italic">
            &ldquo;Recommended because it&rsquo;s {service.reasons[0]}.&rdquo;
          </p>
        )}
      </div>
    </Link>
  );
}