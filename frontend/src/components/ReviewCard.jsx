import StarRating from './StarRating.jsx';
import SafeImage from './SafeImage.jsx';

export default function ReviewCard({ review, currentUserId, onHelpful, onEdit, onDelete }) {
  const isOwner = currentUserId && review.user?._id === currentUserId;
  const markedByMe = review.helpfulBy?.some((id) => id === currentUserId || id?._id === currentUserId);

  return (
    <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber/20 flex items-center justify-center font-mono text-xs text-amber shrink-0">
            {review.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-body text-sm text-stone">{review.user?.name || 'Anonymous'}</p>
            <p className="font-mono text-[10px] text-stone/40">
              {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <StarRating value={review.rating} readOnly size="sm" />
      </div>

      <p className="font-body text-sm text-stone/70 leading-relaxed">{review.reviewText}</p>

      {review.image && (
        <div className="mt-4 rounded-xl overflow-hidden max-w-xs">
          <SafeImage src={review.image} alt="Review photo" className="w-full h-40 object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone/10">
        <button
          onClick={() => onHelpful(review._id)}
          disabled={!currentUserId}
          className={`font-body text-xs flex items-center gap-1.5 transition-colors ${
            markedByMe ? 'text-amber' : 'text-stone/40 hover:text-amber'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <span>&#128077;</span> Helpful{review.helpfulCount > 0 ? ` (${review.helpfulCount})` : ''}
        </button>

        {isOwner && (
          <div className="flex gap-3">
            <button onClick={() => onEdit(review)} className="font-body text-xs text-stone/50 hover:text-amber">
              Edit
            </button>
            <button onClick={() => onDelete(review._id)} className="font-body text-xs text-stone/50 hover:text-clay">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}