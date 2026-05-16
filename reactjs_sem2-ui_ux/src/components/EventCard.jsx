import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDate } from '../utils/dateHelpers';
import { GlowCard } from './ui/spotlight-card';

const CATEGORY_COLORS = {
  Festival: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  Workshop: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Sports: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default function EventCard({ event, actionLabel, onAction }) {
  const categoryStyle = CATEGORY_COLORS[event.category] || 'bg-card text-slate-200 border-border';

  return (
    <GlowCard customSize={true} className="w-full h-full p-0 overflow-hidden bg-card border border-border/50 hover:border-zinc-500/50 transition-colors duration-500 flex flex-col rounded-2xl group cursor-pointer">
      <div className="relative h-48 overflow-hidden" onClick={onAction}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${event.id}/400/250`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md ${categoryStyle}`}>
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between z-10 relative">
        <div onClick={onAction}>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-zinc-400 transition-colors">
            {event.title}
          </h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-slate-300">
              <Calendar className="w-4 h-4 mr-2.5 text-zinc-400" />
              {formatDate(event.date)} • {event.time}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <MapPin className="w-4 h-4 mr-2.5 text-zinc-400" />
              {event.location}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <Users className="w-4 h-4 mr-2.5 text-zinc-400" />
              Capacity: {event.capacity}
            </div>
          </div>
        </div>

        {actionLabel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="w-full py-2.5 bg-zinc-600/10 hover:bg-zinc-600/20 text-zinc-400 border border-zinc-500/30 rounded-xl font-medium transition-colors text-sm"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </GlowCard>
  );
}
