export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 120" className={className} aria-label="띵동">
      <g fill="none" stroke="#F2A93B" strokeWidth="13" strokeLinecap="round">
        <path d="M28 34 v34 a10 10 0 0 0 10 10 h0 a10 10 0 0 0 10 -10 v-6" />
        <path d="M24 82 c4 12 26 14 34 4" />
        <circle cx="86" cy="46" r="20" />
        <path d="M64 90 c14 10 36 8 44 -2" />
        <circle cx="150" cy="52" r="22" />
        <path d="M132 92 c14 10 34 8 42 -2" />
        <circle cx="212" cy="56" r="20" />
        <path d="M196 94 c12 8 30 6 38 -4" />
        <path d="M236 22 q10 6 8 18" />
        <path d="M250 16 q10 8 6 20" />
      </g>
      <circle cx="30" cy="24" r="7" fill="#F2A93B" />
      <circle cx="244" cy="44" r="6" fill="#F2A93B" />
    </svg>
  );
}
