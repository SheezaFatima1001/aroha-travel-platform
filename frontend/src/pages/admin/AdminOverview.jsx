import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api.js';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';

const CARD_COLOR = '#D9A441';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (status === 'loading') return <Loading label="Loading analytics" />;
  if (status === 'error' || !stats) return <ErrorMessage message="Couldn't load admin stats." onRetry={load} />;

  const totalsCards = [
    ['Users', stats.totals.users],
    ['Destinations', stats.totals.destinations],
    ['Services', stats.totals.services],
    ['Bookings', stats.totals.bookings],
    ['Reviews', stats.totals.reviews],
    ['Trips', stats.totals.trips],
    ['Revenue', `$${stats.totals.revenue.toLocaleString()}`],
  ];

  const statusData = Object.entries(stats.bookingsByStatus).map(([status, count]) => ({ status, count }));
  const ratingData = Object.entries(stats.ratingDistribution).map(([rating, count]) => ({ rating: `${rating}\u2605`, count }));

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
        {totalsCards.map(([label, value]) => (
          <div key={label} className="border border-stone/10 rounded-2xl p-5 bg-duskdeep">
            <p className="font-display text-2xl text-amber">{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone/50 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {stats.revenueTimeline.length > 0 && (
        <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep mb-8">
          <h3 className="font-display text-lg text-stone mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.revenueTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE7DD1A" />
              <XAxis dataKey="label" stroke="#EDE7DD66" fontSize={11} />
              <YAxis stroke="#EDE7DD66" fontSize={11} />
              <Tooltip contentStyle={{ background: '#060A12', border: '1px solid #EDE7DD22', fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke={CARD_COLOR} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
          <h3 className="font-display text-lg text-stone mb-4">Bookings by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE7DD1A" />
              <XAxis dataKey="status" stroke="#EDE7DD66" fontSize={11} />
              <YAxis stroke="#EDE7DD66" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#060A12', border: '1px solid #EDE7DD22', fontSize: 12 }} />
              <Bar dataKey="count" fill={CARD_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
          <h3 className="font-display text-lg text-stone mb-4">Review Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE7DD1A" />
              <XAxis dataKey="rating" stroke="#EDE7DD66" fontSize={11} />
              <YAxis stroke="#EDE7DD66" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#060A12', border: '1px solid #EDE7DD22', fontSize: 12 }} />
              <Bar dataKey="count" fill="#2C6E63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
          <h3 className="font-display text-lg text-stone mb-4">Most Favorited Destinations</h3>
          {stats.topDestinations.length === 0 ? (
            <p className="font-body text-sm text-stone/40">No favorites recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topDestinations.map((d) => (
                <li key={d._id} className="flex justify-between font-body text-sm">
                  <span className="text-stone/80">{d.name}</span>
                  <span className="text-amber font-mono">{d.count} saves</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep">
          <h3 className="font-display text-lg text-stone mb-4">Top Booked Services</h3>
          {stats.topServices.length === 0 ? (
            <p className="font-body text-sm text-stone/40">No bookings recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topServices.map((s) => (
                <li key={s._id} className="flex justify-between font-body text-sm">
                  <span className="text-stone/80">{s.serviceName}</span>
                  <span className="text-amber font-mono">{s.bookings} bookings &middot; ${s.revenue}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}