import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-stone/10 bg-duskdeep">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <p className="font-display text-xl text-stone mb-3">Aroha</p>
          <p className="font-body text-sm text-stone/60 max-w-sm">
            A travel platform for people who plan their own routes through Pakistan&rsquo;s
            northern valleys &mdash; not a package tour.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone/40 mb-4">Explore</p>
          <ul className="space-y-2 font-body text-sm text-stone/70">
            <li><Link to="/destinations" className="hover:text-amber">Destinations</Link></li>
            <li><Link to="/services" className="hover:text-amber">Services</Link></li>
            <li><Link to="/about" className="hover:text-amber">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone/40 mb-4">Account</p>
          <ul className="space-y-2 font-body text-sm text-stone/70">
            <li><Link to="/login" className="hover:text-amber">Login</Link></li>
            <li><Link to="/register" className="hover:text-amber">Register</Link></li>
            <li><Link to="/dashboard" className="hover:text-amber">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone/10 py-6 text-center font-mono text-xs text-stone/30">
        Built with the MERN stack
      </div>
    </footer>
  );
}
