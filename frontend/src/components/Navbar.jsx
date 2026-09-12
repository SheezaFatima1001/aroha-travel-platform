import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `font-body text-sm transition-colors duration-200 ${
    isActive ? 'text-amber' : 'text-stone/80 hover:text-stone'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const guestLinks = [
    { to: '/destinations', label: 'Destinations' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
  ];

  const userLinks = [
    { to: '/destinations', label: 'Destinations' },
    { to: '/services', label: 'Services' },
    { to: '/recommendations', label: 'For You' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/trips', label: 'My Trips' },
    { to: '/favorites', label: 'Favorites' },
    { to: '/bookings', label: 'Bookings' },
  ];

  const links = user ? userLinks : guestLinks;
  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-duskdeep/80 backdrop-blur-md border-b border-stone/10">
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl text-stone tracking-tight">
          Aroha
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                {user.name?.split(' ')[0] || 'Profile'}
              </NavLink>
              <button
                onClick={handleLogout}
                className="font-body text-sm px-4 py-2 rounded-full border border-stone/20 text-stone/80 hover:border-amber hover:text-amber transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="font-body text-sm px-4 py-2 rounded-full bg-amber text-dusk font-medium hover:bg-stone transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-stone"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 bg-duskdeep border-t border-stone/10">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                Profile
              </NavLink>
              <button onClick={handleLogout} className="text-left font-body text-sm text-stone/80">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}