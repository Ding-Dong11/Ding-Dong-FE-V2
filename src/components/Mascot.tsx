type Props = {
  className?: string;
  pose?: "front" | "peek";
};

export default function Mascot({ className = "", pose = "front" }: Props) {
  if (pose === "peek") {
    return (
      <svg viewBox="0 0 120 70" className={className} aria-hidden="true">
        <path d="M10 70 C10 30 40 8 62 8 C90 8 110 32 110 70 Z" fill="#FCF0D4" />
        <ellipse cx="60" cy="44" rx="11" ry="8" fill="#F0B655" />
        <circle cx="41" cy="38" r="3" fill="#5B4A2F" />
        <circle cx="79" cy="38" r="3" fill="#5B4A2F" />
        <path d="M30 20 q6 -6 12 -4" stroke="#F3DDB0" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 190" className={className} aria-hidden="true">
      <path d="M22 132 C10 84 42 26 108 22 C176 18 206 66 200 116 C194 168 152 184 104 182 C60 180 30 168 22 132 Z" fill="#FCF0D4" />
      <ellipse cx="78" cy="52" rx="17" ry="14" fill="#F0B655" />
      <ellipse cx="176" cy="96" rx="15" ry="12" fill="#F0B655" />
      <ellipse cx="96" cy="118" rx="16" ry="11" fill="#F0B655" />
      <circle cx="66" cy="112" r="3.5" fill="#5B4A2F" />
      <circle cx="128" cy="122" r="3.5" fill="#5B4A2F" />
      <path d="M48 86 q14 -12 30 -8" stroke="#F3DDB0" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M40 140 q4 12 14 16" stroke="#F3DDB0" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M150 158 q10 6 20 4" stroke="#F3DDB0" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
