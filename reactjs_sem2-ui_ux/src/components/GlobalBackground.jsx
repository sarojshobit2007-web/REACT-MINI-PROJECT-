// GlobalBackground — pure CSS dot grid matching the site aesthetic.
// Replaces the heavy WebGL shader to eliminate choppiness on inner pages.
// The landing page (/) and login page (/login) manage their own backgrounds.

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      {/* CSS dot grid — zero GPU shader cost */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Soft animated shimmer layer */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          backgroundPosition: '11px 11px',
          animation: 'bg-pulse 8s ease-in-out infinite',
        }}
      />
      {/* Edge vignettes — keep content readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,_transparent_30%,_rgba(0,0,0,0.75)_100%)]" />
    </div>
  );
}
