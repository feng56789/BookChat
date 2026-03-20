export default function BookAvatar({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: '50%', flexShrink: 0 }}
    >
      <circle cx="20" cy="20" r="20" fill="url(#bookGrad)" />
      <defs>
        <linearGradient id="bookGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      {/* Book shape */}
      <rect x="11" y="10" width="18" height="22" rx="2" fill="white" opacity="0.9" />
      <rect x="11" y="10" width="3" height="22" rx="1" fill="#a855f7" opacity="0.8" />
      <rect x="15" y="15" width="11" height="1.5" rx="0.75" fill="#6366f1" opacity="0.6" />
      <rect x="15" y="19" width="9" height="1.5" rx="0.75" fill="#6366f1" opacity="0.6" />
      <rect x="15" y="23" width="10" height="1.5" rx="0.75" fill="#6366f1" opacity="0.6" />
    </svg>
  )
}
