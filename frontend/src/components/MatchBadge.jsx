export default function MatchBadge({ percent }) {
  const color = percent >= 70 ? 'bg-amber text-dusk' : percent >= 40 ? 'bg-teal/80 text-dusk' : 'bg-stone/15 text-stone/70';
  return (
    <span className={`font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full ${color}`}>
      {percent}% Match
    </span>
  );
}