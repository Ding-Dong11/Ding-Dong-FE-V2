import { NavLink } from "react-router-dom";

const tabs = [
  {
    to: "/map",
    label: "지도",
    icon: <path d="M3 6.5 8 4l5 2.5L18 4v13.5L13 20l-5-2.5L3 20Zm5-2.5v13M13 6.5v13" strokeLinejoin="round" />
  },
  {
    to: "/recommend",
    label: "추천",
    icon: <path d="M11.5 3H5a2 2 0 0 0-2 2v6.5L11.5 20 20 11.5ZM7.5 7.5h.01" strokeLinejoin="round" />
  },
  {
    to: "/discount",
    label: "할인",
    icon: <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8-4.3-4.1 5.9-.9Z" strokeLinejoin="round" />
  },
  {
    to: "/coupon",
    label: "쿠폰",
    icon: <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.5a2.5 2.5 0 0 0 0 5V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5a2.5 2.5 0 0 0 0-5ZM10 6v12" strokeLinejoin="round" />
  },
  {
    to: "/my",
    label: "마이",
    icon: <path d="M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 9a7 7 0 0 1 14 0" strokeLinejoin="round" />
  }
];

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 flex shrink-0 items-center justify-around border-t border-line bg-white px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} className="flex w-16 flex-col items-center gap-1">
          {({ isActive }) => (
            <>
              <span className={`flex h-10 w-12 items-center justify-center rounded-full transition-colors ${isActive ? "bg-primarySoft" : ""}`}>
                <svg viewBox="0 0 24 24" className={`h-6 w-6 ${isActive ? "stroke-primary" : "stroke-sub"}`} fill="none" strokeWidth="1.7" strokeLinecap="round">
                  {t.icon}
                </svg>
              </span>
              <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-sub"}`}>{t.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
