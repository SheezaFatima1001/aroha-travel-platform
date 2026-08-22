export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center px-6">
      <p className="font-display text-xl text-stone">{title}</p>
      {description && <p className="font-body text-sm text-stone/50 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
