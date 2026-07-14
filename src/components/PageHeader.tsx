import { useNavigate } from "react-router-dom";

type Props = {
  title?: string;
  action?: { label: string; onClick: () => void };
};

export default function PageHeader({ title, action }: Props) {
  const navigate = useNavigate();
  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center px-4">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className="absolute left-3 flex h-10 w-10 items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-ink" fill="none" strokeWidth="2.2" strokeLinecap="round">
          <path d="m14.5 5-7 7 7 7" strokeLinejoin="round" />
        </svg>
      </button>
      {title && <h1 className="text-lg font-bold">{title}</h1>}
      {action && (
        <button type="button" onClick={action.onClick} className="absolute right-4 text-sm font-medium text-sky-500">
          {action.label}
        </button>
      )}
    </header>
  );
}
