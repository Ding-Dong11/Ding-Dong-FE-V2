import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ChatbotFab from "../components/ChatbotFab";

export default function MyPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col bg-[#F7CE79]">
      <h1 className="py-8 text-center text-xl font-extrabold">마이페이지</h1>
      <div className="relative flex flex-1 flex-col rounded-t-3xl bg-white px-6 pt-8">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <p className="text-xl font-extrabold">email0101010@gmail.com</p>
          <span className="rounded-full bg-primary px-4 py-1.5 text-lg font-bold text-white">2000 P</span>
        </div>
        <button
          type="button"
          onClick={() => navigate("/coupon/use")}
          className="flex items-center justify-between py-5 text-lg"
        >
          쿠폰 사용하기
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-sub" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate("/coupon")}
          className="flex items-center justify-between py-5 text-lg"
        >
          포인트 사용
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-sub" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" onClick={() => navigate("/")} className="py-5 text-left text-lg text-danger">
          로그아웃
        </button>
        <button type="button" onClick={() => navigate("/signup")} className="py-5 text-left text-lg text-danger">
          회원가입
        </button>
        <ChatbotFab className="absolute bottom-8 right-5" />
      </div>
      <BottomNav />
    </div>
  );
}
