import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, Calendar, TrendingUp, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { getList, removeFromList, KEYS } from '../utils/storage';
import { formatDate, isUpcoming, isPast, isThisWeek } from '../utils/dateHelpers';
import ConfirmDialog from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';
import { useNotifications } from '../context/NotificationContext';
import { GlowCard } from '../components/ui/spotlight-card';
import { ButtonColorful } from '../components/ui/button-colorful';

// ── Status helpers ────────────────────────────────────────────────────────────
function getStatus(dateString) {
  if (isPast(dateString)) return 'past';
  if (isThisWeek(dateString)) return 'this-week';
  return 'upcoming';
}

const STATUS_META = {
  'this-week': { label: 'Active / This Week', dot: 'bg-green-400', text: 'text-green-400', ring: 'border-green-500/30 bg-green-500/10' },
  upcoming:    { label: 'Upcoming',            dot: 'bg-zinc-400',  text: 'text-zinc-400',  ring: 'border-zinc-500/30 bg-zinc-500/10'  },
  past:        { label: 'Past',                dot: 'bg-slate-600', text: 'text-slate-500', ring: 'border-slate-700/30 bg-slate-800/30' },
};

function StatusBadge({ date }) {
  const s = STATUS_META[getStatus(date)];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.ring} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${getStatus(date) === 'this-week' ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
}

// ── Registrants expandable panel ──────────────────────────────────────────────
function RegistrantsList({ eventId, registrations }) {
  const [open, setOpen] = useState(false);
  const regs = registrations.filter(r => r.eventId === eventId);
  if (regs.length === 0) return <span className="text-slate-500 text-xs italic">No registrations yet</span>;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
      >
        <Users className="w-3.5 h-3.5" />
        {regs.length} registrant{regs.length !== 1 ? 's' : ''}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="mt-2 space-y-1.5 bg-slate-950/60 border border-white/5 rounded-lg p-3 max-h-40 overflow-y-auto">
          {regs.map(r => (
            <div key={r.ticketId} className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-200 font-medium truncate">{r.attendeeData?.fullName || 'Unknown'}</span>
              <span className="text-slate-500 shrink-0">{r.attendeeData?.department || ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { addNotification } = useNotifications();

  function loadData() {
    setEvents(getList(KEYS.EVENTS));
    setRegistrations(getList(KEYS.REGISTRATIONS));
  }

  useEffect(() => { loadData(); }, []);

  function deleteEvent(eventId) {
    removeFromList(KEYS.EVENTS, eventId);
    addNotification('An event was removed.', 'info');
    loadData();
    showToast('Event deleted.', 'error');
  }

  function registrationCount(eventId) {
    return registrations.filter((r) => r.eventId === eventId).length;
  }

  const activeEvents   = events.filter(e => isThisWeek(e.date)).length;
  const upcomingEvents = events.filter(e => isUpcoming(e.date) && !isThisWeek(e.date)).length;
  const pastEvents     = events.filter(e => isPast(e.date)).length;

  return (
    <div className="min-h-screen bg-transparent py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Hosted Events</h1>
            <p className="text-sm text-slate-400 mt-1">
              {events.length} events · {registrations.length} total registrations
            </p>
          </div>
          <Link to="/hosted-events/new">
            <ButtonColorful label="Add Event" />
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <GlowCard customSize={true} className="bg-black/40 border border-white/10 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total Events</p>
            <p className="text-3xl font-bold text-white mt-2">{events.length}</p>
          </GlowCard>
          <GlowCard customSize={true} className="bg-black/40 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Activity className="w-3.5 h-3.5 text-green-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wide">Active</p>
            </div>
            <p className="text-3xl font-bold text-green-400">{activeEvents}</p>
          </GlowCard>
          <GlowCard customSize={true} className="bg-black/40 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
              <p className="text-xs text-slate-500 uppercase tracking-wide">Upcoming</p>
            </div>
            <p className="text-3xl font-bold text-zinc-300">{upcomingEvents}</p>
          </GlowCard>
          <GlowCard customSize={true} className="bg-black/40 border border-white/10 rounded-xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Registrations</p>
            <p className="text-3xl font-bold text-white mt-2">{registrations.length}</p>
          </GlowCard>
        </div>

        {/* Events table */}
        <GlowCard customSize={true} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10 relative z-10">
                <tr>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Event</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Capacity</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Registrants</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 relative z-10">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No events yet. Click "Add Event" to create one.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => {
                    const count = registrationCount(event.id);
                    const fillPct = event.capacity ? Math.min(100, Math.round((count / event.capacity) * 100)) : 0;
                    return (
                      <tr key={event.id} className="hover:bg-white/5 transition-colors">
                        {/* Event name + location */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                              onError={(e) => { e.target.src = `https://picsum.photos/seed/${event.id}/80/80`; }}
                            />
                            <div>
                              <p className="font-medium text-slate-200 line-clamp-1">{event.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block mt-0.5">{event.location}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <StatusBadge date={event.date} />
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-slate-400 hidden md:table-cell">
                          {formatDate(event.date)}
                        </td>

                        {/* Capacity fill bar */}
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>{count}/{event.capacity ?? '∞'}</span>
                              <span>{fillPct}%</span>
                            </div>
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${fillPct >= 90 ? 'bg-red-500' : fillPct >= 60 ? 'bg-amber-400' : 'bg-green-400'}`}
                                style={{ width: `${fillPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Registrants expandable */}
                        <td className="px-5 py-4">
                          <RegistrantsList eventId={event.id} registrations={registrations} />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              to={`/hosted-events/edit/${event.id}`}
                              className="p-2 text-slate-400 hover:text-zinc-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
                              title="Edit event"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setConfirmDeleteId(event.id)}
                              className="p-2 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
                              title="Delete event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => deleteEvent(confirmDeleteId)}
        title="Delete Event"
        message="Are you sure you want to delete this event? All registrations for this event will be lost."
      />
    </div>
  );
}
