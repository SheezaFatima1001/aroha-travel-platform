import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form);
    if (ok) navigate(location.state?.from?.pathname || '/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Welcome back</p>
      <h1 className="font-display text-4xl text-stone mb-8">Login</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          />
        </div>
        <div>
          <label className="font-body text-sm text-stone/60 block mb-2">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
          />
        </div>

        {error && <p className="font-body text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3.5 bg-amber text-dusk font-body font-semibold rounded-full hover:bg-stone transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in\u2026' : 'Login'}
        </button>
      </form>

      <p className="font-body text-sm text-stone/50 mt-8 text-center">
        Don&rsquo;t have an account?{' '}
        <Link to="/register" className="text-amber hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
