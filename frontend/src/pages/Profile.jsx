import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function Profile() {
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('loading');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/users/profile');
      setForm({ name: data.data.name, bio: data.data.bio || '', profileImage: data.data.profileImage || '', email: data.data.email });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.put('/users/profile', {
        name: form.name,
        bio: form.bio,
        profileImage: form.profileImage,
      });
      setUser((u) => ({ ...u, name: data.data.name, bio: data.data.bio, profileImage: data.data.profileImage }));
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), name: data.data.name }));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') return <Loading label="Loading profile" />;
  if (status === 'error' || !form) return <ErrorMessage message="Couldn't load your profile." onRetry={load} />;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Account</p>
      <h1 className="font-display text-4xl text-stone mb-10">Your Profile</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          />
        </div>
        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Email</label>
          <input
            disabled
            value={form.email}
            className="w-full bg-duskdeep/50 border border-stone/10 rounded-xl px-4 py-3 font-body text-sm text-stone/50"
          />
        </div>
        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Profile Image URL</label>
          <input
            value={form.profileImage}
            onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          />
        </div>
        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Bio</label>
          <textarea
            rows={4}
            maxLength={500}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none resize-none"
          />
        </div>

        {saved && <p className="font-body text-sm text-teal">Profile updated.</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 bg-amber text-dusk font-body font-semibold rounded-full hover:bg-stone transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving\u2026' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
