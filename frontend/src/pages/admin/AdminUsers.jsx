import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setBusyId(u._id);
    try {
      await api.patch(`/admin/users/${u._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((x) => (x._id === u._id ? { ...x, role: newRole } : x)));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update role.');
    } finally {
      setBusyId(null);
    }
  };

  const removeUser = async (u) => {
    if (!confirm(`Delete ${u.name}'s account? This cannot be undone.`)) return;
    setBusyId(u._id);
    try {
      await api.delete(`/admin/users/${u._id}`);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete user.');
    } finally {
      setBusyId(null);
    }
  };

  if (status === 'loading') return <Loading label="Loading users" />;
  if (status === 'error') return <ErrorMessage message="Couldn't load users." onRetry={load} />;

  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div key={u._id} className="border border-stone/10 rounded-2xl p-5 bg-duskdeep flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-base text-stone">
              {u.name} {u._id === currentUser._id && <span className="font-mono text-[10px] text-stone/40">(you)</span>}
            </p>
            <p className="font-body text-xs text-stone/50">{u.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-amber text-dusk' : 'bg-stone/10 text-stone/60'}`}>
              {u.role}
            </span>
            <button
              onClick={() => toggleRole(u)}
              disabled={busyId === u._id}
              className="font-body text-xs text-stone/60 hover:text-amber disabled:opacity-40"
            >
              {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
            </button>
            <button
              onClick={() => removeUser(u)}
              disabled={busyId === u._id || u._id === currentUser._id}
              className="font-body text-xs text-stone/60 hover:text-clay disabled:opacity-30"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}