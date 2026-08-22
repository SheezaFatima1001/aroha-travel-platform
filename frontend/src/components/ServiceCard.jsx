import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service._id}`}
      className="group block overflow-hidden rounded-2xl bg-dusk border border-stone/10 hover:border-amber/40 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={service.image}
          alt={service.serviceName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {!service.availability && (
          <div className="absolute inset-0 bg-duskdeep/70 flex items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-stone/70">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber mb-1">{service.category}</p>
        <h3 className="font-display text-lg text-stone">{service.serviceName}</h3>
        <p className="font-body text-xs text-stone/50 mt-1">{service.location}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-mono text-sm text-stone">${service.price}</span>
          <span className="font-mono text-[11px] text-stone/50">&#9733; {service.rating?.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
