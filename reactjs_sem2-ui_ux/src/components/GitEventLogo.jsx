// GitEvent SVG Logo — used across all pages
export default function GitEventLogo({ size = 28, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon mark: git branch node style */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
        {/* Vertical stem */}
        <line x1="16" y1="8" x2="16" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Top node */}
        <circle cx="16" cy="8" r="2.5" fill="white" />
        {/* Bottom node */}
        <circle cx="16" cy="24" r="2.5" fill="white" fillOpacity="0.5" />
        {/* Branch arm left */}
        <path d="M16 14 Q8 14 8 20" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
        {/* Branch arm right */}
        <path d="M16 14 Q24 14 24 20" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
        {/* Branch end nodes */}
        <circle cx="8"  cy="20" r="2" fill="white" fillOpacity="0.6" />
        <circle cx="24" cy="20" r="2" fill="white" fillOpacity="0.6" />
        {/* Center calendar dot */}
        <circle cx="16" cy="14" r="2" fill="white" />
      </svg>

      {showText && (
        <span
          className="font-bold text-white tracking-tight"
          style={{ fontSize: size * 0.6, lineHeight: 1 }}
        >
          git<span className="text-zinc-400">Event</span>
        </span>
      )}
    </div>
  );
}
