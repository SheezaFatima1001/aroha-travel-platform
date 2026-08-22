import { Link } from 'react-router-dom';

export default function DestinationCard({ destination, size = 'default' }) {
  const tall = size === 'tall';
  return (
    <Link
      to={`/destinations/${destination._id}`}
      className={`group relative block overflow-hidden rounded-2xl bg-dusk border border-stone/10 ${
        tall ? 'row-span-2' : ''
      }`}
    >
      <div className={`relative w-full overflow-hidden ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-duskdeep via-duskdeep/10 to-transparent" />
        {destination.featured && (
          <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest bg-amber text-dusk px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-amber mb-1">
          {destination.category}
        </p>
        <h3 className="font-display text-xl text-stone">{destination.name}</h3>
        <p className="font-body text-xs text-stone/60 mt-1">{destination.location}, {destination.country}</p>
        <div className="flex items-center gap-3 mt-2 font-mono text-[11px] text-stone/50">
          <span>&#9733; {destination.rating?.toFixed(1)}</span>
          <span>&middot;</span>
          <span>{destination.popularity} popularity</span>
        </div>
      </div>
    </Link>
  );
}
