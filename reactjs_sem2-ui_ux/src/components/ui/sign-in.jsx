import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { GlowCard } from './spotlight-card';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({
  children
}) => (
  <div
    className="rounded-xl border border-slate-800 bg-slate-950/50 backdrop-blur-sm transition-colors focus-within:border-zinc-500 focus-within:bg-slate-900">
    {children}
  </div>
);

const TestimonialCard = ({
  testimonial,
  delay
}) => (
  <GlowCard customSize={true} className={`animate-testimonial ${delay} flex items-start gap-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 p-4 w-64`}>
    <img
      src={testimonial.avatarSrc}
      className="h-10 w-10 object-cover rounded-xl"
      alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-bold text-white">{testimonial.name}</p>
      <p className="text-zinc-400 text-xs">{testimonial.handle}</p>
      <p className="mt-2 text-slate-300 text-xs">{testimonial.text}</p>
    </div>
  </GlowCard>
);

// --- MAIN COMPONENT ---

export const SignInPage = ({
  title = <span className="font-light text-foreground tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  heroContent,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row font-sans w-full bg-background">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 z-10 relative">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1
              className="animate-element animate-delay-100 text-4xl md:text-5xl font-bold leading-tight text-white">{title}</h1>
            <p className="animate-element animate-delay-200 text-slate-400">{description}</p>

            <form className="space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email Address</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-3.5 text-white placeholder:text-slate-500 rounded-xl focus:outline-none" />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-3.5 pr-12 text-white placeholder:text-slate-500 rounded-xl focus:outline-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff
                        className="w-5 h-5 text-slate-400 hover:text-white transition-colors" /> : <Eye
                        className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div
                className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-zinc-500 focus:ring-zinc-500" />
                  <span className="text-slate-300">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); onResetPassword?.(); }}
                  className="hover:underline text-zinc-400 transition-colors">Reset password</a>
              </div>

              <button
                type="submit"
                className="animate-element animate-delay-600 w-full rounded-xl bg-zinc-600 py-3.5 font-semibold text-white hover:bg-zinc-700 transition-colors">
                Sign In
              </button>
            </form>

            <div
              className="animate-element animate-delay-700 relative flex items-center justify-center my-2">
              <span className="w-full border-t border-slate-800"></span>
              <span className="px-4 text-sm text-slate-500 bg-background absolute">Or continue with</span>
            </div>

            <button
              onClick={onGoogleSignIn}
              className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-slate-700 rounded-xl py-3.5 text-white hover:bg-slate-900 transition-colors font-medium">
                <GoogleIcon />
                Continue with Google
            </button>

            <p
              className="animate-element animate-delay-900 text-center text-sm text-slate-400 mt-2">
              New to our platform? <a
              href="#"
              onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }}
              className="text-zinc-400 font-medium hover:underline transition-colors">Create Account</a>
            </p>
          </div>
        </div>
      </section>
      {/* Right column: hero image + testimonials */}
      {(heroImageSrc || heroContent) && (
        <section className="hidden md:block flex-1 relative p-6">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-6 rounded-3xl bg-cover bg-center border border-border/30 overflow-hidden"
            style={heroImageSrc ? { backgroundImage: heroImageSrc.includes('gradient') ? heroImageSrc : `url(${heroImageSrc})` } : {}}>
            {heroContent}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent rounded-3xl pointer-events-none z-10"></div>
          </div>
          {testimonials.length > 0 && (
            <div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-5 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  );
};