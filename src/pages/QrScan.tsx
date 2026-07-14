import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function QrScan() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="방문 확인" />
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-neutral-900 px-8">
        <button
          type="button"
          aria-label="QR 스캔"
          onClick={() => navigate("/map", { state: { visited: true } })}
          className="relative aspect-square w-64"
        >
          <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-white" />
          <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-white" />
          <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-white" />
          <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-white" />
          <span className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-primary/80" />
        </button>
        <p className="mt-10 text-center text-lg font-medium leading-8 text-white">
          방문한 가게에 있는
          <br />
          QR을 스캔해주세요!
        </p>
      </div>
    </div>
  );
}
