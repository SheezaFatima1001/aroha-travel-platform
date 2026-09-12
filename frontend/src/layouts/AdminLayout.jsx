import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/listings', label: 'Destinations & Services' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Admin</p>
      <h1 className="font-display text-4xl text-stone mb-8">Platform Admin</h1>

      <div className="flex flex-wrap gap-2 mb-10 border-b border-stone/10 pb-4">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full font-body text-xs border transition-colors ${
                isActive ? 'bg-amber text-dusk border-amber' : 'border-stone/15 text-stone/60 hover:border-amber hover:text-amber'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}