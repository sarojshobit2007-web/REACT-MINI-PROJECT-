import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  ArrowLeft, Calendar, MapPin, Clock, Users, AlignLeft,
  Ticket, CheckCircle2, ChevronRight,
} from 'lucide-react';
import { getList, addToList, KEYS } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { showToast } from '../components/Toast';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG 1st Year', 'PG 2nd Year'];
const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Business Administration',
  'Arts & Humanities', 'Commerce', 'Other',
];

function validate(form) {
  const errors = {};
  if (!form.fullName.trim() || form.fullName.trim().length < 3)
    errors.fullName = 'Full name must be at least 3 characters.';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Please enter a valid email address.';
  if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim()))
    errors.phone = 'Phone number must be exactly 10 digits.';
  if (!form.year) errors.year = 'Please select your year of study.';
  if (!form.department) errors.department = 'Please select your department.';
  return errors;
}

/* ── Pill-style section row (matches the Luma card rows) ─────────────────── */
function SectionRow({ icon: Icon, children, className = '' }) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl ${className}`}>
      <Icon className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/* ── Luma-style pill input ────────────────────────────────────────────────── */
function PillInput({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[10px] text-white/35 uppercase tracking-widest mb-1.5">{label}</label>
      )}
      <input
        {...props}
        className={`w-full bg-transparent text-white text-sm placeholder:text-white/25 focus:outline-none ${
          error ? 'border-b border-red-500/60 pb-1' : ''
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function Register() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [form, setForm] = useState({
    fullName:   user?.name || '',
    email:      user?.email || '',
    phone:      '',
    year:       '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const events = getList(KEYS.EVENTS);
    const found  = events.find((ev) => ev.id === eventId);
    setEvent(found || null);

    const registrations = getList(KEYS.REGISTRATIONS);
    setAlreadyRegistered(
      registrations.some((r) => r.eventId === eventId && r.userId === user?.id)
    );
  }, [eventId, user]);

  function handleChange(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setSubmitting(true);
    const ticketId    = uuidv4();
    const registration = {
      id:           `reg-${Date.now()}`,
      eventId,
      userId:       user.id,
      ticketId,
      attendeeData: { ...form },
      registeredAt: new Date().toISOString(),
    };
    addToList(KEYS.REGISTRATIONS, registration);
    addNotification(`You've successfully registered for "${event.title}"!`, 'success', user.id);
    showToast('Registration successful! Your ticket is ready.', 'success');
    navigate(`/ticket/${ticketId}`);
  }

  /* ── Loading / not found ────────────────────────────────────────────────── */
  if (!event) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <p className="text-white/40">Event not found.</p>
      </div>
    );
  }

  /* ── Already registered ─────────────────────────────────────────────────── */
  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="bg-black/60 border border-white/10 rounded-2xl p-10 max-w-sm w-full text-center backdrop-blur-md">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Already Registered</h2>
          <p className="text-white/40 text-sm mb-6">
            You have already registered for <strong className="text-white">{event.title}</strong>.
          </p>
          <Link
            to="/my-tickets"
            className="inline-flex items-center gap-2 bg-white text-black rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            View My Tickets <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main layout ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back */}
        <Link
          to={`/events/${eventId}`}
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to event
        </Link>

        {/* Two-column Luma-style layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

          {/* ── LEFT: event cover ──────────────────────────────────────────── */}
          <div className="space-y-3 lg:sticky lg:top-24">
            {/* Cover image */}
            <div className="relative rounded-2xl overflow-hidden aspect-square">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${event.id}/500/500`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Category badge */}
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 text-white/80 border border-white/15 backdrop-blur-sm">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Event meta under image */}
            <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <Ticket className="w-4 h-4 text-white/40 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/40">Registration</p>
                <p className="text-sm text-white font-medium">Free · {event.capacity} spots</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: details + form ──────────────────────────────────────── */}
          <div className="space-y-3">

            {/* Event name */}
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-white/40 text-sm mt-1">Complete your registration below</p>
            </div>

            {/* Date & time card */}
            <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_1fr] gap-0">
                <div className="flex flex-col justify-center px-4 border-r border-white/8">
                  <Calendar className="w-4 h-4 text-white/40" />
                </div>
                <div className="px-4 py-3.5 border-r border-white/8">
                  <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Date</p>
                  <p className="text-sm text-white font-medium">{formatDate(event.date)}</p>
                </div>
                <div className="px-4 py-3.5">
                  <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Time</p>
                  <p className="text-sm text-white font-medium">{formatTime(event.time)}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <SectionRow icon={MapPin}>
              <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">Location</p>
              <p className="text-sm text-white">{event.location}</p>
            </SectionRow>

            {/* Description */}
            {event.description && (
              <SectionRow icon={AlignLeft}>
                <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">About</p>
                <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{event.description}</p>
              </SectionRow>
            )}

            {/* ── Attendee info ──────────────────────────────────────────── */}
            <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                  Attendee Information
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="divide-y divide-white/8">

                  {/* Full Name */}
                  <div className="px-4 py-3.5">
                    <PillInput
                      label="Full Name *"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="Your full name"
                      error={errors.fullName}
                    />
                  </div>

                  {/* Email */}
                  <div className="px-4 py-3.5">
                    <PillInput
                      label="Email Address *"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="student@college.edu"
                      error={errors.email}
                    />
                  </div>

                  {/* Phone */}
                  <div className="px-4 py-3.5">
                    <PillInput
                      label="Phone Number *"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      error={errors.phone}
                    />
                  </div>

                  {/* Year + Department in a grid */}
                  <div className="grid grid-cols-2 divide-x divide-white/8">
                    <div className="px-4 py-3.5">
                      <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1.5">Year of Study *</p>
                      <select
                        value={form.year}
                        onChange={(e) => handleChange('year', e.target.value)}
                        className="w-full bg-transparent text-sm text-white focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-zinc-900">Select year</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y} className="bg-zinc-900">{y}</option>
                        ))}
                      </select>
                      {errors.year && <p className="text-red-400 text-xs mt-1">{errors.year}</p>}
                    </div>
                    <div className="px-4 py-3.5">
                      <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1.5">Department *</p>
                      <select
                        value={form.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        className="w-full bg-transparent text-sm text-white focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-zinc-900">Select dept.</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d} className="bg-zinc-900">{d}</option>
                        ))}
                      </select>
                      {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="px-4 py-4 border-t border-white/8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white text-black font-semibold rounded-full py-3 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {submitting ? 'Registering…' : 'Register for this Event'}
                  </button>
                </div>
              </form>
            </div>

            {/* Capacity info */}
            <div className="flex items-center gap-2 text-xs text-white/30 px-1">
              <Users className="w-3.5 h-3.5" />
              <span>Capacity: {event.capacity} · Free registration</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
