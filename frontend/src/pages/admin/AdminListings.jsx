import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import ImageUploadField from '../../components/ImageUploadField.jsx';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const DESTINATION_CATEGORIES = ['Mountains', 'Beaches', 'Historical', 'Cultural', 'Adventure', 'Cities', 'Nature', 'Religious', 'Luxury'];
const SERVICE_CATEGORIES = ['Hotels', 'Tours', 'Transport', 'Activities', 'Packages', 'Guides'];

const emptyDestination = { name: '', country: '', location: '', description: '', image: '', category: 'Mountains', rating: 4.5, popularity: 50, featured: false };
const emptyService = { serviceName: '', category: 'Hotels', location: '', description: '', image: '', price: 50, rating: 4.5, availability: true, features: '' };

export default function AdminListings() {
  const [tab, setTab] = useState('destinations');
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const endpoint = tab === 'destinations' ? '/destinations' : '/services';

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get(endpoint);
      setItems(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    setForm(null);
    setEditingId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const startCreate = () => {
    setForm(tab === 'destinations' ? { ...emptyDestination } : { ...emptyService });
    setEditingId(null);
    setError('');
  };

  const startEdit = (item) => {
    if (tab === 'destinations') {
      setForm({ ...item });
    } else {
      setForm({ ...item, features: (item.features || []).join(', ') });
    }
    setEditingId(item._id);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = tab === 'destinations'
        ? { ...form, rating: Number(form.rating), popularity: Number(form.popularity) }
        : { ...form, price: Number(form.price), rating: Number(form.rating), features: form.features.split(',').map((f) => f.trim()).filter(Boolean) };

      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, payload);
      } else {
        await api.post(endpoint, payload);
      }
      setForm(null);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    await api.delete(`${endpoint}/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTab('destinations')}
            className={`px-4 py-2 rounded-full font-body text-xs border transition-colors ${tab === 'destinations' ? 'bg-amber text-dusk border-amber' : 'border-stone/15 text-stone/60 hover:border-amber hover:text-amber'}`}
          >
            Destinations
          </button>
          <button
            onClick={() => setTab('services')}
            className={`px-4 py-2 rounded-full font-body text-xs border transition-colors ${tab === 'services' ? 'bg-amber text-dusk border-amber' : 'border-stone/15 text-stone/60 hover:border-amber hover:text-amber'}`}
          >
            Services
          </button>
        </div>
        <button
          onClick={startCreate}
          className="px-5 py-2.5 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors"
        >
          + Add {tab === 'destinations' ? 'Destination' : 'Service'}
        </button>
      </div>

      {form && (
        <form onSubmit={submit} className="border border-stone/10 rounded-2xl p-6 bg-duskdeep mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tab === 'destinations' ? (
            <>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Country</label>
                <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Location</label>
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none">
                  {DESTINATION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Rating (0-5)</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Popularity</label>
                <input type="number" min="0" value={form.popularity} onChange={(e) => setForm({ ...form, popularity: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <label className="flex items-center gap-2 font-body text-sm text-stone/70">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured on homepage
              </label>
              <div className="sm:col-span-2">
                <ImageUploadField value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-xs text-stone/60 block mb-1">Description</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none resize-none" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Service name</label>
                <input required value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none">
                  {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Location</label>
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Price ($)</label>
                <input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <div>
                <label className="font-body text-xs text-stone/60 block mb-1">Rating (0-5)</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none" />
              </div>
              <label className="flex items-center gap-2 font-body text-sm text-stone/70">
                <input type="checkbox" checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />
                Available for booking
              </label>
              <div className="sm:col-span-2">
                <label className="font-body text-xs text-stone/60 block mb-1">Features (comma-separated)</label>
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Free Wi-Fi, Breakfast included" className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone placeholder:text-stone/30 focus:border-amber outline-none" />
              </div>
              <div className="sm:col-span-2">
                <ImageUploadField value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-xs text-stone/60 block mb-1">Description</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-dusk border border-stone/15 rounded-lg px-3 py-2 font-body text-sm text-stone focus:border-amber outline-none resize-none" />
              </div>
            </>
          )}

          {error && <p className="sm:col-span-2 font-body text-sm text-clay">{error}</p>}

          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-amber text-dusk font-body text-sm font-semibold rounded-full hover:bg-stone transition-colors disabled:opacity-50">
              {saving ? 'Saving\u2026' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setForm(null); setEditingId(null); }} className="px-6 py-2.5 border border-stone/20 text-stone/70 font-body text-sm rounded-full hover:border-amber hover:text-amber transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {status === 'loading' && <Loading label="Loading listings" />}
      {status === 'error' && <ErrorMessage message="Couldn't load listings." onRetry={load} />}
      {status === 'ready' && (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="border border-stone/10 rounded-2xl p-5 bg-duskdeep flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-base text-stone">{item.name || item.serviceName}</p>
                <p className="font-body text-xs text-stone/50">{item.category} &middot; {item.location}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => startEdit(item)} className="font-body text-xs text-stone/60 hover:text-amber">Edit</button>
                <button onClick={() => remove(item._id)} className="font-body text-xs text-stone/60 hover:text-clay">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}