import { useEffect, useState } from 'react';
import api from '../services/api.js';

const BUDGETS = ['Budget', 'Mid-range', 'Luxury'];
const STYLES = ['Adventure', 'Relaxation', 'Cultural', 'Family', 'Luxury'];
const CATEGORIES = ['Mountains', 'Beaches', 'Historical', 'Cultural', 'Adventure', 'Cities', 'Nature', 'Religious', 'Luxury'];

export default function PreferenceForm({ onSaved }) {
  const [form, setForm] = useState({
    budget: '',
    travelStyle: '',
    preferredCategory: '',
    preferredLocation: '',
    tripDuration: '',
  });
  const [status, setStatus] = useState('loading');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get('/users/preferences')
      .then((res) => {
        const p = res.data.data || {};
        setForm({
          budget: p.budget || '',
          travelStyle: p.travelStyle || '',
          preferredCategory: p.preferredCategory || '',
          preferredLocation: p.preferredLocation || '',
          tripDuration: p.tripDuration ?? '',
        });
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await api.put('/users/preferences', form);
      setSaved(true);
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return <p className="font-body text-sm text-stone/40 py-6">Loading your preferences&hellip;</p>;

  return (
    <form onSubmit={handleSubmit} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="font-body text-xs text-stone/60 block mb-1">Budget</label>
        <select
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
        >
          <option value="">No preference</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-body text-xs text-stone/60 block mb-1">Travel style</label>
        <select
          value={form.travelStyle}
          onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}
          className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
        >
          <option value="">No preference</option>
          {STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-body text-xs text-stone/60 block mb-1">Preferred category</label>
        <select
          value={form.preferredCategory}
          onChange={(e) => setForm({ ...form, preferredCategory: e.target.value })}
          className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none"
        >
          <option value="">No preference</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-body text-xs text-stone/60 block mb-1">Preferred location</label>
        <input
          value={form.preferredLocation}
          onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
          placeholder="e.g. Gilgit-Baltistan"
          className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone placeholder:text-stone/30 focus:border-amber outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="font-body text-xs text-stone/60 block mb-1">Typical trip length (days)</label>
        <input
          type="number"
          min={1}
          max={60}
          value={form.tripDuration}
          onChange={(e) => setForm({ ...form, tripDuration: e.target.value })}
          placeholder="e.g. 5"
          className="w-full sm:w-40 bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone placeholder:text-stone/30 focus:border-amber outline-none"
        />
      </div>

      {error && <p className="sm:col-span-2 font-body text-sm text-clay">{error}</p>}
      {saved && !error && <p className="sm:col-span-2 font-body text-sm text-teal">Preferences saved &mdash; recommendations updated below.</p>}

      <button
        type="submit"
        disabled={saving}
        className="sm:col-span-2 px-6 py-2.5 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors disabled:opacity-50 w-fit"
      >
        {saving ? 'Saving\u2026' : 'Save Preferences'}
      </button>
    </form>
  );
}