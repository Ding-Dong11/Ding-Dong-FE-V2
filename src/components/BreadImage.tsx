type Props = {
  className?: string;
  dim?: boolean;
};

export default function BreadImage({ className = "", dim = false }: Props) {
  return (
    <div className={`relative overflow-hidden bg-[#F6F1EA] ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="200" height="200" fill="#F6F1EA" />
        <rect x="24" y="44" width="152" height="128" rx="14" fill="#8A5A33" />
        <rect x="32" y="52" width="136" height="112" rx="10" fill="#9A6A40" />
        <ellipse cx="118" cy="50" rx="12" ry="32" fill="#E9A34C" transform="rotate(-12 118 50)" />
        <ellipse cx="146" cy="54" rx="12" ry="32" fill="#F0B05B" transform="rotate(14 146 54)" />
        <circle cx="128" cy="108" r="42" fill="#F2B368" />
        <circle cx="112" cy="104" r="3" fill="#3F2E1B" />
        <circle cx="144" cy="104" r="3" fill="#3F2E1B" />
        <path d="M124 118 l10 4 m0 -4 l-10 4" stroke="#3F2E1B" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="52" cy="96" rx="10" ry="26" fill="#E9A34C" transform="rotate(-18 52 96)" />
        <ellipse cx="74" cy="92" rx="10" ry="26" fill="#F0B05B" transform="rotate(8 74 92)" />
        <circle cx="62" cy="138" r="34" fill="#EFAD5E" />
        <circle cx="50" cy="134" r="2.6" fill="#3F2E1B" />
        <circle cx="74" cy="134" r="2.6" fill="#3F2E1B" />
        <path d="M58 146 l8 3.5 m0 -3.5 l-8 3.5" stroke="#3F2E1B" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      {dim && <div className="absolute inset-0 bg-black/45" />}
    </div>
  );
}
