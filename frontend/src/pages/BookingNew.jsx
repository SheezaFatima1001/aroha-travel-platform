import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

export default function BookingNew() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [status, setStatus] = useState('loading');
  const [step, setStep] = useState('form'); // form -> summary -> submitting
  const [error, setError] = useState('');
  const [form, setForm] = useState({ bookingDate: '', numberOfPeople: 1, specialRequest: '' });

  const load = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get(`/services/${serviceId}`);
      setService(data.data);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  if (status === 'loading') return <Loading label="Loading booking form" />;
  if (status === 'error' || !service) return <ErrorMessage message="Service not found." />;

  const totalPrice = service.price * Number(form.numberOfPeople || 1);

  const goToSummary = (e) => {
    e.preventDefault();
    setError('');
    if (!form.bookingDate) {
      setError('Please choose a booking date.');
      return;
    }
    setStep('summary');
  };

  const confirmBooking = async () => {
    setStep('submitting');
    setError('');
    try {
      const { data } = await api.post('/bookings', {
        service: service._id,
        bookingDate: form.bookingDate,
        numberOfPeople: form.numberOfPeople,
        specialRequest: form.specialRequest,
      });
      navigate(`/booking-confirmation/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete booking.');
      setStep('summary');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">
        {step === 'form' ? 'Booking Details' : 'Review & Confirm'}
      </p>
      <h1 className="font-display text-4xl text-stone mb-2">{service.serviceName}</h1>
      <p className="font-body text-stone/50 mb-10">{service.location}</p>

      {step === 'form' && (
        <form onSubmit={goToSummary} className="space-y-5">
          <div>
            <label className="font-body text-sm text-stone/60 block mb-2">Booking date</label>
            <input
              type="date"
              required
              value={form.bookingDate}
              onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div>
            <label className="font-body text-sm text-stone/60 block mb-2">Number of people</label>
            <input
              type="number"
              min={1}
              required
              value={form.numberOfPeople}
              onChange={(e) => setForm({ ...form, numberOfPeople: Number(e.target.value) })}
              className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none"
            />
          </div>
          <div>
            <label className="font-body text-sm text-stone/60 block mb-2">Special request (optional)</label>
            <textarea
              rows={3}
              value={form.specialRequest}
              onChange={(e) => setForm({ ...form, specialRequest: e.target.value })}
              className="w-full bg-duskdeep border border-stone/15 rounded-xl px-4 py-3 font-body text-sm text-stone focus:border-amber outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-stone/10 pt-5">
            <span className="font-body text-sm text-stone/50">Estimated total</span>
            <span className="font-display text-2xl text-stone">${totalPrice}</span>
          </div>

          {error && <p className="font-body text-sm text-clay">{error}</p>}

          <button
            type="submit"
            className="w-full px-6 py-3.5 bg-amber text-dusk font-body font-semibold rounded-full hover:bg-stone transition-colors"
          >
            Review Booking
          </button>
        </form>
      )}

      {(step === 'summary' || step === 'submitting') && (
        <div className="space-y-6">
          <div className="border border-stone/10 rounded-2xl p-6 bg-duskdeep space-y-3">
            {[
              ['Service', service.serviceName],
              ['Location', service.location],
              ['Booking date', new Date(form.bookingDate).toLocaleDateString()],
              ['Number of people', form.numberOfPeople],
              ['Price per person', `$${service.price}`],
              ['Special request', form.specialRequest || '\u2014'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between font-body text-sm">
                <span className="text-stone/50">{label}</span>
                <span className="text-stone">{value}</span>
              </div>
            ))}
            <div className="flex justify-between font-display text-xl pt-3 border-t border-stone/10">
              <span className="text-stone/70">Total price</span>
              <span className="text-amber">${totalPrice}</span>
            </div>
          </div>

          {error && <p className="font-body text-sm text-clay">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('form')}
              disabled={step === 'submitting'}
              className="flex-1 px-6 py-3.5 border border-stone/20 text-stone font-body font-medium rounded-full hover:border-amber hover:text-amber transition-colors disabled:opacity-50"
            >
              Edit details
            </button>
            <button
              onClick={confirmBooking}
              disabled={step === 'submitting'}
              className="flex-1 px-6 py-3.5 bg-amber text-dusk font-body font-semibold rounded-full hover:bg-stone transition-colors disabled:opacity-50"
            >
              {step === 'submitting' ? 'Confirming\u2026' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
