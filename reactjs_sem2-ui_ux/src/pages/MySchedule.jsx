import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Trash2, Star } from 'lucide-react';
import { getList, removeFromList, KEYS } from '../utils/storage';
import { formatDate, formatTime, isPast } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';
import { GlowCard } from '../components/ui/spotlight-card';
import { ButtonColorful } from '../components/ui/button-colorful';

export default function MySchedule() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [confirmReg, setConfirmReg] = useState(null); // registration to cancel

  function loadSchedule() {
    const registrations = getList(KEYS.REGISTRATIONS);
    const events = getList(KEYS.EVENTS);
    const myRegistrations = registrations.filter((r) => r.userId === user.id);

    // Pair each registration with its event data and sort upcoming first.
    const paired = myRegistrations
      .map((registration) => ({
        registration,
        event: events.find((ev) => ev.id === registration.eventId),
      }))
      .filter((item) => item.event)
      .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

    setMyEvents(paired);
  }

  useEffect(() => {
    loadSchedule();
  }, [user]);

  function cancelRegistration(registrationId) {
    removeFromList(KEYS.REGISTRATIONS, registrationId);
    loadSchedule();
    showToast('Registration cancelled.', 'info');
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Schedule</h1>

        {myEvents.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium text-slate-400">No events on your schedule yet</p>
            <p className="text-base mt-2 mb-8">Register for an event and it will appear here</p>
            <Link to="/">
              <ButtonColorful label="Browse Events" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {myEvents.map(({ registration, event }) => {
              const past = isPast(event.date);
              return (
                <GlowCard key={registration.id} customSize={true} className="bg-card border border-border/50 rounded-2xl overflow-hidden p-0 flex flex-col sm:flex-row hover:border-zinc-500/50 transition-colors duration-300">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full sm:w-40 h-40 sm:h-auto object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${event.id}/800/400`;
                    }}
                  />
                  <div className="flex-1 p-5 relative z-10 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${past ? 'bg-slate-900/70 text-slate-400 border-slate-700/50' : 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'}`}>
                          {past ? 'Past' : 'Upcoming'}
                        </span>
                        <h3 className="font-bold text-lg text-white mt-3 leading-tight">{event.title}</h3>
                      </div>
                      {/* Only allow cancelling upcoming events */}
                      {!past && (
                        <button
                          onClick={() => setConfirmReg(registration)}
                          className="p-2 text-slate-500 hover:text-red-400 bg-slate-900/50 hover:bg-slate-900 rounded-lg transition-colors flex-shrink-0 border border-transparent hover:border-red-900/50"
                          title="Cancel registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 text-sm text-slate-400 mt-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-zinc-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                      <Link
                        to={`/ticket/${registration.ticketId}`}
                        className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
                      >
                        <Ticket className="w-4 h-4" /> View Ticket
                      </Link>
                      {past && (
                        <Link
                          to={`/events/${event.id}`}
                          className="flex items-center gap-1.5 text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
                        >
                          <Star className="w-4 h-4" /> Rate Event
                        </Link>
                      )}
                    </div>
                  </div>
                </GlowCard>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmReg}
        onClose={() => setConfirmReg(null)}
        onConfirm={() => cancelRegistration(confirmReg?.id)}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration? This action cannot be undone.`}
      />
    </div>
  );
}
