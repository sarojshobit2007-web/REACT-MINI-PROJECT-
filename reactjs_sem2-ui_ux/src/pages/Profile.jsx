import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, LogOut, User, Mail, Building, Hash, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlowCard } from '../components/ui/spotlight-card';
import GitEventLogo from '../components/GitEventLogo';

export default function Profile() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name:        user?.name        || '',
    email:       user?.email       || '',
    collegeId:   user?.collegeId   || '',
    collegeName: user?.collegeName || '',
    bio:         user?.bio         || '',
  });
  const [avatar, setAvatar]     = useState(user?.avatar || null);
  const [saved, setSaved]       = useState(false);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();
    // Persist back into AuthContext + localStorage via the login helper
    login(form.name || user.name, user.role, {
      email:       form.email,
      collegeId:   form.collegeId,
      collegeName: form.collegeName,
      bio:         form.bio,
      avatar,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const initials = (form.name || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-transparent py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-full transition-colors bg-black/30"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Avatar card */}
          <GlowCard customSize className="bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{initials}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5 text-black" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Name + role pill */}
              <div>
                <p className="text-white font-bold text-xl">{form.name || 'Your Name'}</p>
                <p className="text-white/40 text-sm mt-0.5">{form.email || 'email@campus.edu'}</p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white/60 capitalize">
                  {user?.role || 'student'}
                </span>
              </div>
            </div>
          </GlowCard>

          {/* Personal info */}
          <GlowCard customSize className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">Personal Information</h2>

            {[
              { icon: User,     label: 'Full Name',    field: 'name',        type: 'text',  placeholder: 'Your full name' },
              { icon: Mail,     label: 'Email',        field: 'email',       type: 'email', placeholder: 'student@university.edu' },
            ].map(({ icon: Icon, label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                  <input
                    type={type}
                    value={form[field]}
                    onChange={set(field)}
                    placeholder={placeholder}
                    className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-11 pr-5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>
            ))}

            {/* Bio */}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={set('bio')}
                rows={3}
                placeholder="Tell us a bit about yourself…"
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>
          </GlowCard>

          {/* College info */}
          <GlowCard customSize className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold text-sm uppercase tracking-widest mb-2">College Information</h2>

            {[
              { icon: Hash,     label: 'College ID',    field: 'collegeId',   placeholder: 'e.g. 2024CS01' },
              { icon: Building, label: 'College Name',  field: 'collegeName', placeholder: 'e.g. MIT' },
            ].map(({ icon: Icon, label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-3.5 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={form[field]}
                    onChange={set(field)}
                    placeholder={placeholder}
                    className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-11 pr-5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>
            ))}
          </GlowCard>

          {/* Save button */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-sm transition-all duration-300 ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </form>

        {/* Footer branding */}
        <div className="flex justify-center mt-10 opacity-30">
          <GitEventLogo size={20} />
        </div>
      </div>
    </div>
  );
}
