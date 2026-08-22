export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-4">About</p>
      <h1 className="font-display text-4xl sm:text-5xl text-stone mb-8">
        A platform for people who actually plan their trips.
      </h1>
      <div className="space-y-6 font-body text-stone/70 leading-relaxed text-lg">
        <p>
          Aroha started from a simple frustration: most travel sites either sell you a
          fixed package or bury real destination information behind marketing copy.
          Neither gives you what you need to plan a trip on your own terms.
        </p>
        <p>
          So we built something closer to a toolkit. Every destination, service, and
          rating on this platform comes from a real database &mdash; not hardcoded content
          &mdash; which means it can grow and change the way an actual travel catalog does.
        </p>
        <p>
          Once you find a place worth visiting, you can save it, build a day-by-day
          itinerary around it, and book the hotels, guides, and transport you need,
          all without leaving the flow of planning.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
        {[
          ['Explore', 'Search and filter destinations by category, country, and rating.'],
          ['Plan', 'Build multi-day itineraries with activities, timing, and location.'],
          ['Book', 'Reserve travel services with transparent, server-verified pricing.'],
        ].map(([title, desc]) => (
          <div key={title} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
            <h3 className="font-display text-xl text-amber mb-2">{title}</h3>
            <p className="font-body text-sm text-stone/50">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
