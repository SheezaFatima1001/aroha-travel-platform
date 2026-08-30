export default function StarRating({ value = 0, onChange, size = 'md', readOnly = false }) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`} role={readOnly ? 'img' : 'radiogroup'} aria-label={`${value} out of 5 stars`}>
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        if (readOnly) {
          return (
            <span key={star} className={filled ? 'text-amber' : 'text-stone/20'} aria-hidden="true">
              &#9733;
            </span>
          );
        }
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`transition-colors ${filled ? 'text-amber' : 'text-stone/20'} hover:text-amber`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            &#9733;
          </button>
        );
      })}
    </div>
  );
}
