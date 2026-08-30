import StarRating from './StarRating.jsx';

export default function RatingSummary({ summary }) {
  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
        <p className="font-body text-sm text-stone/50">No reviews yet. Be the first to share your experience.</p>
      </div>
    );
  }

  const { averageRating, totalReviews, distribution } = summary;

  return (
    <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
      <div className="flex items-end gap-3 mb-4">
        <span className="font-display text-4xl text-stone">{averageRating.toFixed(1)}</span>
        <div className="pb-1">
          <StarRating value={averageRating} readOnly size="sm" />
          <p className="font-mono text-[11px] text-stone/50 mt-1">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="font-mono text-xs text-stone/50 w-3">{star}</span>
              <div className="flex-1 h-1.5 bg-stone/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="font-mono text-[11px] text-stone/40 w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}