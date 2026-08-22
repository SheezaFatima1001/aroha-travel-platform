import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export default function TripCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    tripName: '',
    destination: location.state?.destinationId || '',
    startDate: '',
    endDate: '',
    numberOfTravelers: 1,
    description: '',
    status: 'Planned',
  });

  useEffect(() => {
    api.get('/destinations').then((res) => setDestinations(res.data.data)).catch(() => {});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date must be after start date.');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post('/trips', form);
      navigate(`/trips/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create trip.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Trip Planner</p>
      <h1 className="font-display text-4xl text-stone mb-10">Plan a New Trip</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Trip name</label>
          <input
            required
            value={form.tripName}
            onChange={(e) => setForm({ ...form, tripName: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          />
        </div>

        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Destination</label>
          <select
            required
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          >
            <option value="">Select a destination&hellip;</option>
            {destinations.map((d) => (
              <option key={d._id} value={d._id}>{d.name}, {d.country}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm text-stone/60 block mb-2">Start date</label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div>
            <label className="font-body text-sm text-stone/60 block mb-2">End date</label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Number of travelers</label>
          <input
            type="number"
            min={1}
            required
            value={form.numberOfTravelers}
            onChange={(e) => setForm({ ...form, numberOfTravelers: Number(e.target.value) })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          />
        </div>

        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          >
            {['Planned', 'Ongoing', 'Completed', 'Cancelled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none resize-none"
          />
        </div>

        {error && <p className="font-body text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 bg-amber text-dusk font-body font-semibold rounded-full hover:bg-stone transition-colors disabled:opacity-50"
        >
          {saving ? 'Creating\u2026' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
}
