import { useEffect, useState, useCallback } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import RatingSummary from './RatingSummary.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewCard from './ReviewCard.jsx';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import EmptyState from './EmptyState.jsx';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'helpful', label: 'Most helpful' },
  { value: 'highest', label: 'Highest rated' },
  { value: 'lowest', label: 'Lowest rated' },
];

export default function ReviewSection({ targetType, targetId }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [sort, setSort] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const params = { targetType, targetId };
      if (sort) params.sort = sort;
      if (ratingFilter) params.rating = ratingFilter;

      const [summaryRes, reviewsRes] = await Promise.all([
        api.get('/reviews/summary', { params: { targetType, targetId } }),
        api.get('/reviews', { params }),
      ]);
      setSummary(summaryRes.data.data);
      setReviews(reviewsRes.data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [targetType, targetId, sort, ratingFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const myReview = user ? reviews.find((r) => r.user?._id === user._id) : null;

  const submitNewReview = async (payload) => {
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/reviews', { targetType, targetId, ...payload });
      setShowForm(false);
      await load();
      return true;
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not submit review.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const submitEdit = async (payload) => {
    setSubmitting(true);
    setFormError('');
    try {
      await api.put(`/reviews/${editingReview._id}`, payload);
      setEditingReview(null);
      await load();
      return true;
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not update review.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    await api.delete(`/reviews/${id}`);
    load();
  };

  const handleHelpful = async (id) => {
    if (!user) return;
    await api.post(`/reviews/${id}/helpful`);
    load();
  };

  return (
    <section className="mt-4">
      <h2 className="font-display text-2xl text-stone mb-6">Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          {status === 'loading' ? <Loading label="Loading ratings" /> : <RatingSummary summary={summary} />}
        </div>
        <div className="lg:col-span-2">
          {user ? (
            myReview && !editingReview ? (
              <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
                <p className="font-body text-sm text-stone/60 mb-3">You&rsquo;ve already reviewed this. Want to make changes?</p>
                <button
                  onClick={() => setEditingReview(myReview)}
                  className="px-5 py-2.5 border border-amber text-amber font-body text-sm rounded-full hover:bg-amber hover:text-dusk transition-colors"
                >
                  Edit your review
                </button>
              </div>
            ) : editingReview ? (
              <ReviewForm
                initial={editingReview}
                submitting={submitting}
                onSubmit={submitEdit}
                onCancel={() => {
                  setEditingReview(null);
                  setFormError('');
                }}
              />
            ) : showForm ? (
              <ReviewForm
                submitting={submitting}
                onSubmit={submitNewReview}
                onCancel={() => {
                  setShowForm(false);
                  setFormError('');
                }}
              />
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors"
              >
                Write a Review
              </button>
            )
          ) : (
            <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
              <p className="font-body text-sm text-stone/60">Login to leave a review.</p>
            </div>
          )}
          {formError && <p className="font-body text-sm text-clay mt-3">{formError}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="bg-duskdeep border border-stone/15 rounded-full px-4 py-2 font-body text-xs text-stone focus:border-amber outline-none"
        >
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-duskdeep border border-stone/15 rounded-full px-4 py-2 font-body text-xs text-stone focus:border-amber outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {status === 'loading' && <Loading label="Loading reviews" />}
      {status === 'error' && <ErrorMessage message="Couldn't load reviews right now." onRetry={load} />}
      {status === 'ready' && reviews.length === 0 && (
        <EmptyState title="No reviews match this filter." description="Try a different rating filter, or be the first to write one." />
      )}
      {status === 'ready' && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((r) => (
            <ReviewCard
              key={r._id}
              review={r}
              currentUserId={user?._id}
              onHelpful={handleHelpful}
              onEdit={(rev) => setEditingReview(rev)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}