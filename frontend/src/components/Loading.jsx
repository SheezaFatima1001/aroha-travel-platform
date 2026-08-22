export default function Loading({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 border-2 border-stone/20 border-t-amber rounded-full animate-spin" />
      <p className="font-mono text-xs uppercase tracking-widest text-stone/40">{label}&hellip;</p>
    </div>
  );
}
