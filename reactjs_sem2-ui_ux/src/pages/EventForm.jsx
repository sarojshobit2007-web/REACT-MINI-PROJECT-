import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import { getList, addToList, updateInList, KEYS } from '../utils/storage';
import { showToast } from '../components/Toast';
import { useNotifications } from '../context/NotificationContext';
import { GlowCard } from '../components/ui/spotlight-card';
import { Button } from '../components/ui/button';
import { ButtonColorful } from '../components/ui/button-colorful';

const CATEGORIES = ['Festival', 'Workshop', 'Sports'];

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'Festival',
  date: '',
  time: '',
  location: '',
  capacity: '',
  imageUrl: '',
};

function validateEventForm(form) {
  const errors = {};
  if (!form.title.trim() || form.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.date) errors.date = 'Date is required.';
  if (!form.time) errors.time = 'Time is required.';
  if (!form.location.trim()) errors.location = 'Location is required.';
  if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) {
    errors.capacity = 'Capacity must be a positive number.';
  }
  return errors;
}

export default function EventForm() {
  const { id } = useParams(); // present only on the edit route
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const isEditing = !!id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Pre-fill form when editing an existing event.
  useEffect(() => {
    if (isEditing) {
      const events = getList(KEYS.EVENTS);
      const existing = events.find((ev) => ev.id === id);
      if (existing) {
        setForm({
          title: existing.title,
          description: existing.description,
          category: existing.category,
          date: existing.date,
          time: existing.time,
          location: existing.location,
          capacity: String(existing.capacity),
          imageUrl: existing.imageUrl || '',
        });
      }
    }
  }, [id, isEditing]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateEventForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    const eventData = {
      ...form,
      capacity: Number(form.capacity),
      imageUrl: form.imageUrl.trim() || `https://picsum.photos/seed/${id || Date.now()}/400/250`,
    };

    if (isEditing) {
      updateInList(KEYS.EVENTS, id, eventData);
      addNotification(`Event "${form.title}" has been updated.`, 'info');
      showToast('Event updated successfully!', 'success');
    } else {
      const newEvent = {
        ...eventData,
        id: `evt-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      addToList(KEYS.EVENTS, newEvent);
      addNotification(`New event added: "${form.title}"`, 'info');
      showToast('Event created successfully!', 'success');
    }

    navigate('/hosted-events');
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/hosted-events" className="inline-flex">
          <Button variant="ghost" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-zinc-400 mb-6 px-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back to Hosted Events
          </Button>
        </Link>

        <GlowCard customSize={true} className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-white mb-8">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Event Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Annual Tech Fest 2026"
                className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.title ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1.5">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the event..."
                rows={4}
                className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none ${errors.description ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.description && <p className="text-red-400 text-xs mt-1.5">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.date ? 'border-red-500' : 'border-slate-800'}`}
                />
                {errors.date && <p className="text-red-400 text-xs mt-1.5">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Time *</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.time ? 'border-red-500' : 'border-slate-800'}`}
                />
                {errors.time && <p className="text-red-400 text-xs mt-1.5">{errors.time}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. Main Auditorium"
                className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.location ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.location && <p className="text-red-400 text-xs mt-1.5">{errors.location}</p>}
            </div>

            {/* Capacity + Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Capacity *</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  placeholder="e.g. 200"
                  min={1}
                  className={`w-full px-4 py-3 bg-slate-950/50 border rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 ${errors.capacity ? 'border-red-500' : 'border-slate-800'}`}
                />
                {errors.capacity && <p className="text-red-400 text-xs mt-1.5">{errors.capacity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image URL <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>
            </div>

            {/* Image preview */}
            {form.imageUrl && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Image preview:</p>
                <img
                  src={form.imageUrl}
                  alt="Event preview"
                  className="w-full h-40 object-cover rounded-xl border border-slate-800"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <Link to="/hosted-events" className="flex-1">
                <Button variant="outline" className="w-full h-12 text-base border-slate-700 hover:bg-slate-900">
                  Cancel
                </Button>
              </Link>
              <div className="flex-1">
                <ButtonColorful 
                  disabled={saving}
                  label={saving ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
                  className="w-full h-12 text-base"
                />
              </div>
            </div>
          </form>
        </GlowCard>
      </div>
    </div>
  );
}
