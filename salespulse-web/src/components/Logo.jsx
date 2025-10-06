export default function Logo({ size = 28, text = true }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 48 48" className="drop-shadow">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa"/>
            <stop offset="100%" stopColor="#a78bfa"/>
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="36" height="36" rx="10" fill="url(#g)"/>
        <path d="M16 28c6-2 10-6 12-12 2 8 4 12 8 16" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
      {text && <span className="text-lg font-semibold tracking-tight">SalesPulse</span>}
    </div>
  )
}
