import { useState } from 'react';
import StarRating from './StarRating.jsx';

export default function ReviewForm({ initial, onSubmit, onCancel, submitting }) {
  const [rating, setRating] = useState(initial?.rating || 0);
  const [reviewText, setReviewText] = useState(initial?.reviewText || '');
  const [image, setImage] = useState(initial?.image || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!rating) {
      setError('Please select a rating.');
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 5) {
      setError('Review text must be at least 5 characters.');
      return;
    }
    const ok = await onSubmit({ rating, reviewText: reviewText.trim(), image });
    if (ok && !initial) {
      setRating(0);
      setReviewText('');
      setImage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep space-y-4">
      <div>
        <label className="font-body text-sm text-stone/60 block mb-2">Your rating</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="font-body text-sm text-stone/60 block mb-2">Your review</label>
        <textarea
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          maxLength={2000}
          placeholder="Share what stood out about your experience&hellip;"
          className="w-full bg-dusk border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone placeholder:text-stone/30 focus:border-amber outline-none resize-none"
        />
        <p className="font-mono text-[10px] text-stone/30 mt-1">{reviewText.length}/2000</p>
      </div>

      <div>
        <label className="font-body text-sm text-stone/60 block mb-2">Photo URL (optional)</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://&hellip;"
          className="w-full bg-dusk border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone placeholder:text-stone/30 focus:border-amber outline-none"
        />
      </div>

      {error && <p className="font-body text-sm text-clay">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors disabled:opacity-50"
        >
          {submitting ? 'Saving\u2026' : initial ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-stone/20 text-stone/70 font-body text-sm rounded-full hover:border-amber hover:text-amber transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}