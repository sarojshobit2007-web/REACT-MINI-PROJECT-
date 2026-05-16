import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin } from 'lucide-react';
import { getList, KEYS } from '../utils/storage';
import { formatDate, formatTime, isPast } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import { GlowCard } from '../components/ui/spotlight-card';
import { ButtonColorful } from '../components/ui/button-colorful';

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const registrations = getList(KEYS.REGISTRATIONS);
    const events = getList(KEYS.EVENTS);
    const myRegistrations = registrations.filter((r) => r.userId === user.id);

    const paired = myRegistrations
      .map((registration) => ({
        registration,
        event: events.find((ev) => ev.id === registration.eventId),
      }))
      .filter((item) => item.event)
      .sort((a, b) => new Date(b.registration.registeredAt) - new Date(a.registration.registeredAt));

    setTickets(paired);
  }, [user]);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <Ticket className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium text-slate-400">No tickets yet</p>
            <p className="text-base mt-2 mb-8">Register for an event to get your ticket</p>
            <Link to="/">
              <ButtonColorful label="Browse Events" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map(({ registration, event }) => {
              const past = isPast(event.date);
              const shortId = registration.ticketId.split('-')[0].toUpperCase();

              return (
                <Link
                  key={registration.id}
                  to={`/ticket/${registration.ticketId}`}
                  className="block group h-full"
                >
                  <GlowCard customSize={true} className="bg-card border border-border/50 rounded-2xl overflow-hidden p-0 h-full flex flex-col hover:border-zinc-500/50 transition-all duration-300">
                    <div className="relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.target.src = `https://picsum.photos/seed/${event.id}/800/400`;
                        }}
                      />
                      <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${past ? 'bg-slate-900/70 text-slate-300 border-slate-700/50' : 'bg-zinc-500/80 text-white border-zinc-400/50'}`}>
                        {past ? 'Past Event' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow relative z-10">
                      <p className="font-bold text-white text-lg mb-3 line-clamp-1">{event.title}</p>
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Calendar className="w-4 h-4 text-zinc-400" />
                          <span>{formatDate(event.date)} · {formatTime(event.time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          ID: {shortId}
                        </span>
                        <span className="text-sm text-zinc-400 font-medium group-hover:text-zinc-300 group-hover:translate-x-1 transition-transform">
                          View Ticket →
                        </span>
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
