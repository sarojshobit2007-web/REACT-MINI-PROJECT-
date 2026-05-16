import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import GitEventLogo from '../components/GitEventLogo';

/* ─────────────────────────── Input Component ─────────────────────────────── */
const PillInput = ({ label, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full bg-transparent text-white border border-white/15 rounded-full py-3.5 px-5 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/35 text-sm"
    />
  </div>
);

/* ─────────────────────────── Main Auth Page ──────────────────────────────── */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/home';

  // Detect ?signup=true in URL to default to signup mode
  const searchParams = new URLSearchParams(location.search);
  const defaultSignup = searchParams.get('signup') === 'true';

  const [mode, setMode] = useState(defaultSignup ? 'signup' : 'login');
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [form, setForm] = useState({ email: '', name: '', collegeId: '', collegeName: '' });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  function validate() {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (mode === 'signup') {
      if (!form.name) errs.name = 'Full name is required';
      if (!form.collegeId) errs.collegeId = 'College ID is required';
      if (!form.collegeName) errs.collegeName = 'College name is required';
    }
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep('success');
    setTimeout(() => {
      const displayName = mode === 'signup' ? form.name : (form.email.split('@')[0]);
      login(displayName, 'student', {
        email: form.email,
        collegeId: form.collegeId || null,
        collegeName: form.collegeName || null,
      });
      navigate(from, { replace: true });
    }, 1600);
  }

  function handleGoogle() {
    login('Demo User', 'student', { email: 'demo@campusevents.com' });
    navigate(from, { replace: true });
  }

  const isLogin = mode === 'login';

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* CSS dot grid background — zero WebGL cost */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        {/* Dark radial vignette — focusses attention on the form */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_55%,_transparent_20%,_rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Floating pill nav */}
      <nav className="relative z-20 flex justify-center pt-7">
        <div className="flex items-center gap-8 px-6 py-3 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
          <Link to="/" className="flex items-center">
            <GitEventLogo size={24} />
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <Link to="/about" className="text-white/60 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link>
            <Link to="/home" className="text-white/60 hover:text-white transition-colors">Discover</Link>
          </div>
        </div>
      </nav>

      {/* Auth card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-sm"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h1>
                <p className="text-white/50 text-sm">
                  {isLogin
                    ? 'Sign in to discover and register for campus events'
                    : 'Join to discover, register, and host campus events'}
                </p>
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-full py-3.5 px-4 transition-all duration-200 text-sm font-medium mb-6"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <PillInput
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={set('name')}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1 pl-4">{errors.name}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <PillInput
                    type="email"
                    placeholder="student@university.edu"
                    value={form.email}
                    onChange={set('email')}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1 pl-4">{errors.email}</p>}
                </div>

                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      key="college-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, delay: 0.05 }}
                      className="overflow-hidden space-y-3"
                    >
                      <div>
                        <PillInput
                          type="text"
                          placeholder="College ID (e.g. 2024CS01)"
                          value={form.collegeId}
                          onChange={set('collegeId')}
                        />
                        {errors.collegeId && <p className="text-red-400 text-xs mt-1 pl-4">{errors.collegeId}</p>}
                      </div>
                      <div>
                        <PillInput
                          type="text"
                          placeholder="College Name"
                          value={form.collegeName}
                          onChange={set('collegeName')}
                        />
                        {errors.collegeName && <p className="text-red-400 text-xs mt-1 pl-4">{errors.collegeName}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full bg-white text-black font-semibold rounded-full py-3.5 hover:bg-white/90 active:scale-[0.98] transition-all duration-200 text-sm mt-2"
                >
                  {isLogin ? 'Sign in' : 'Create Account'}
                </button>
              </form>

              {/* Toggle mode */}
              <p className="text-center text-white/40 text-sm mt-6">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => { setMode(isLogin ? 'signup' : 'login'); setErrors({}); }}
                  className="text-white hover:text-white/80 font-medium underline underline-offset-2 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>

              {/* Terms */}
              <p className="text-center text-white/25 text-xs mt-6 leading-relaxed">
                By continuing, you agree to our{' '}
                <Link to="/about" className="underline hover:text-white/50 transition-colors">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/about" className="underline hover:text-white/50 transition-colors">Privacy Policy</Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome back!' : "You're in!"}
              </h2>
              <p className="text-white/50 text-sm">Redirecting you to events…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
