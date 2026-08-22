import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const emptyActivity = { dayNumber: 1, title: '', location: '', time: '', category: 'General', description: '' };

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [status, setStatus] = useState('loading');
  const [activityForm, setActivityForm] = useState(emptyActivity);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitActivity = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/trips/${id}/activities/${editingId}`, activityForm);
      } else {
        await api.post(`/trips/${id}/activities`, activityForm);
      }
      setActivityForm(emptyActivity);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch {
      // surfaced via reload/error state
    }
  };

  const editActivity = (dayNumber, activity) => {
    setActivityForm({
      dayNumber,
      title: activity.title,
      location: activity.location,
      time: activity.time,
      category: activity.category,
      description: activity.description,
    });
    setEditingId(activity._id);
    setShowForm(true);
  };

  const deleteActivity = async (activityId) => {
    await api.delete(`/trips/${id}/activities/${activityId}`);
    load();
  };

  const deleteTrip = async () => {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    await api.delete(`/trips/${id}`);
    navigate('/trips');
  };

  if (status === 'loading') return <Loading label="Loading trip" />;
  if (status === 'error' || !trip) return <ErrorMessage message="Trip not found." />;

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-16">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">{trip.status}</p>
          <h1 className="font-display text-4xl text-stone">{trip.tripName}</h1>
          <p className="font-body text-stone/50 mt-2">
            {trip.destination?.name} &middot; {new Date(trip.startDate).toLocaleDateString()} &rarr; {new Date(trip.endDate).toLocaleDateString()} &middot; {trip.numberOfTravelers} traveler(s)
          </p>
        </div>
        <button onClick={deleteTrip} className="font-body text-sm text-clay hover:underline shrink-0">
          Delete trip
        </button>
      </div>

      {trip.description && <p className="font-body text-stone/70 mt-6 max-w-2xl">{trip.description}</p>}

      <div className="flex items-center justify-between mt-14 mb-6">
        <h2 className="font-display text-2xl text-stone">Itinerary</h2>
        <button
          onClick={() => {
            setActivityForm(emptyActivity);
            setEditingId(null);
            setShowForm((v) => !v);
          }}
          className="px-5 py-2.5 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Activity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitActivity} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs text-stone/60 block mb-1">Day number</label>
            <input
              type="number"
              min={1}
              required
              value={activityForm.dayNumber}
              onChange={(e) => setActivityForm({ ...activityForm, dayNumber: Number(e.target.value) })}
              className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs text-stone/60 block mb-1">Time</label>
            <input
              value={activityForm.time}
              onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
              placeholder="e.g. 9:00 AM"
              className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs text-stone/60 block mb-1">Activity title</label>
            <input
              required
              value={activityForm.title}
              onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs text-stone/60 block mb-1">Location</label>
            <input
              value={activityForm.location}
              onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
              className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div>
            <label className="font-body text-xs text-stone/60 block mb-1">Category</label>
            <input
              value={activityForm.category}
              onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
              className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs text-stone/60 block mb-1">Description</label>
            <textarea
              rows={2}
              value={activityForm.description}
              onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
              className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none resize-none"
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-2 px-6 py-3 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors"
          >
            {editingId ? 'Update Activity' : 'Add Activity'}
          </button>
        </form>
      )}

      {trip.itinerary.length === 0 ? (
        <EmptyState title="No itinerary yet." description="Add your first activity to start building the day-by-day plan." />
      ) : (
        <div className="space-y-8">
          {[...trip.itinerary].sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
            <div key={day.dayNumber}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-amber mb-4">Day {day.dayNumber}</h3>
              <div className="space-y-3">
                {day.activities.length === 0 && (
                  <p className="font-body text-sm text-stone/40">No activities added for this day.</p>
                )}
                {day.activities.map((a) => (
                  <div key={a._id} className="border border-stone/10 rounded-xl p-5 bg-duskdeep flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        {a.time && <span className="font-mono text-xs text-stone/40">{a.time}</span>}
                        <h4 className="font-display text-lg text-stone">{a.title}</h4>
                      </div>
                      {a.location && <p className="font-body text-sm text-stone/50">{a.location}</p>}
                      {a.category && <p className="font-mono text-[10px] uppercase tracking-widest text-teal mt-1">{a.category}</p>}
                      {a.description && <p className="font-body text-sm text-stone/60 mt-2">{a.description}</p>}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => editActivity(day.dayNumber, a)} className="font-body text-xs text-stone/50 hover:text-amber">
                        Edit
                      </button>
                      <button onClick={() => deleteActivity(a._id)} className="font-body text-xs text-stone/50 hover:text-clay">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
