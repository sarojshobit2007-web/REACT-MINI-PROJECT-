import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, Star } from 'lucide-react';
import StarRating from '../components/StarRating';
import { getList, addToList, KEYS } from '../utils/storage';
import { formatDate, formatTime, isPast } from '../utils/dateHelpers';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import { GlowCard } from '../components/ui/spotlight-card';
import { Button } from '../components/ui/button';
import { ButtonColorful } from '../components/ui/button-colorful';

export default function EventDetails() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [userFeedback, setUserFeedback] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const events = getList(KEYS.EVENTS);
    const found = events.find((ev) => ev.id === id);
    setEvent(found || null);

    const allFeedback = getList(KEYS.FEEDBACK);
    const eventFeedback = allFeedback.filter((fb) => fb.eventId === id);
    setFeedbackList(eventFeedback);

    if (user) {
      const myFeedback = eventFeedback.find((fb) => fb.userId === user.id);
      setUserFeedback(myFeedback || null);

      const registrations = getList(KEYS.REGISTRATIONS);
      const registered = registrations.some(
        (r) => r.eventId === id && r.userId === user.id
      );
      setIsRegistered(registered);
    }
  }, [id, user]);

  function submitFeedback() {
    if (rating === 0) {
      showToast('Please select a star rating.', 'error');
      return;
    }
    const feedback = {
      id: `fb-${Date.now()}`,
      eventId: id,
      userId: user.id,
      userName: user.name,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    addToList(KEYS.FEEDBACK, feedback);
    setFeedbackList((prev) => [...prev, feedback]);
    setUserFeedback(feedback);
    showToast('Thanks for your feedback!', 'success');
  }

  const avgRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((sum, fb) => sum + fb.rating, 0) / feedbackList.length).toFixed(1)
      : null;

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-slate-500">
          <p className="text-xl font-medium">Event not found</p>
          <Link to="/" className="mt-3 inline-block text-zinc-600 hover:underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const eventIsPast = isPast(event.date);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-zinc-400 mb-6 transition-colors px-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <GlowCard customSize={true} className="bg-card rounded-2xl overflow-hidden p-0 border border-border/50">
          {/* Event image */}
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-56 md:h-72 object-cover"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${event.id}/800/400`;
            }}
          />

          <div className="p-6 md:p-8 relative z-10">
            {/* Category + title */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 mb-3">
              {event.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">{event.title}</h1>

            {/* Event meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-slate-500">Date & Time</p>
                  <p className="text-sm font-medium">{formatDate(event.date)}</p>
                  <p className="text-sm">{formatTime(event.time)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-sm font-medium">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-slate-500">Capacity</p>
                  <p className="text-sm font-medium">{event.capacity} seats</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 leading-relaxed mb-8">{event.description}</p>

            {/* Average rating display */}
            {avgRating && (
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow" />
                <span className="font-bold text-white text-lg">{avgRating}</span>
                <span className="text-sm text-slate-400">({feedbackList.length} ratings)</span>
              </div>
            )}

            {/* Register button */}
            {!eventIsPast && (
              <div className="mb-2">
                {isRegistered ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-medium">
                    ✓ You are registered for this event
                  </div>
                ) : (
                  <Link
                    to={isLoggedIn ? `/register/${event.id}` : '/login'}
                    state={!isLoggedIn ? { from: `/register/${event.id}` } : undefined}
                  >
                    <ButtonColorful label="Register Now" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </GlowCard>

        {/* Feedback section */}
        <GlowCard customSize={true} className="bg-card rounded-2xl p-6 md:p-8 mt-8 border border-border/50">
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white mb-6">Reviews & Ratings</h2>

            {/* Submit feedback form */}
            {eventIsPast && isLoggedIn && isRegistered && !userFeedback && (
              <div className="bg-slate-900/50 rounded-xl p-5 mb-8 border border-slate-800">
                <h3 className="font-semibold text-slate-100 mb-3">How was this event?</h3>
                <StarRating value={rating} onChange={setRating} />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience (optional)..."
                  rows={3}
                  className="w-full mt-4 px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
                />
                <Button onClick={submitFeedback} className="mt-4">
                  Submit Feedback
                </Button>
              </div>
            )}

            {userFeedback && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6 text-sm text-green-400">
                ✓ You rated this event {userFeedback.rating}/5
              </div>
            )}

            {/* Comments list */}
            {feedbackList.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No reviews yet. Be the first!</p>
            ) : (
              <div className="flex flex-col gap-5">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="border-b border-slate-800 pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-slate-200">{fb.userName}</span>
                      <StarRating value={fb.rating} readonly />
                    </div>
                    {fb.comment && <p className="text-sm text-slate-400 mb-2">{fb.comment}</p>}
                    <p className="text-xs text-slate-600">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
