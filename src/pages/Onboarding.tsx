import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Mascot from "../components/Mascot";

export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-24">
      <div className="flex flex-col items-center">
        <Logo className="w-44" />
        <p className="mt-6 text-center text-base leading-relaxed text-sub">
          버려지는 마감 상품은 ZERO, 안심 골목 상권은
          <br />
          소생하는 상생 리워드 플랫폼, 띵동
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Mascot className="w-72 -rotate-6" />
      </div>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="h-14 rounded-xl border border-primary text-lg font-semibold text-primary"
        >
          회원가입
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="h-14 rounded-xl bg-primary text-lg font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
