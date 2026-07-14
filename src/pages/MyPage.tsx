import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, authApi, mypageApi } from "../api";
import BottomNav from "../components/BottomNav";
import ChatbotFab from "../components/ChatbotFab";

function WithdrawModal({
  onClose,
  onWithdrawn,
}: {
  onClose: () => void;
  onWithdrawn: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const withdraw = async () => {
    if (loading || !password) return;
    setError("");
    setLoading(true);
    try {
      await authApi.withdraw({ password });
      onWithdrawn();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "회원 탈퇴에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col justify-center bg-black/20 px-5"
      onClick={onClose}
    >
      <div
        className="pop-in rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">회원 탈퇴</h2>
        <p className="mt-1 text-sm text-sub">계속하려면 비밀번호를 입력해주세요.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="mt-4 h-14 w-full rounded-xl bg-field px-4 text-base outline-none placeholder:text-sub focus:ring-2 focus:ring-primary/40"
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <button
          type="button"
          onClick={withdraw}
          disabled={loading || !password}
          className="mt-5 h-14 w-full rounded-2xl bg-danger text-lg font-semibold text-white disabled:opacity-60"
        >
          {loading ? "처리 중..." : "탈퇴하기"}
        </button>
      </div>
    </div>
  );
}

export default function MyPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [point, setPoint] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    mypageApi
      .getPoint()
      .then((res) => {
        setEmail(res.email);
        setPoint(res.point_balance);
      })
      .catch(() => {});
  }, []);

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-[#F7CE79]">
      <h1 className="py-8 text-center text-xl font-extrabold">마이페이지</h1>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-3xl bg-white">
        <div className="flex h-full flex-col overflow-y-auto px-6 pt-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
            <p className="text-xl font-extrabold">{email}</p>
            <span className="rounded-full bg-primary px-4 py-1.5 text-lg font-bold text-white">
              {point} P
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate("/coupon/use")}
            className="flex items-center justify-between py-5 text-lg"
          >
            쿠폰 사용하기
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-sub"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => navigate("/coupon")}
            className="flex items-center justify-between py-5 text-lg"
          >
            포인트 사용
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-sub"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={logout}
            className="py-5 text-left text-lg text-danger"
          >
            로그아웃
          </button>
          <button
            type="button"
            onClick={() => setShowWithdraw(true)}
            className="py-5 text-left text-lg text-danger"
          >
            회원탈퇴
          </button>
        </div>
        <ChatbotFab className="absolute bottom-6 right-5 z-20" />
      </div>
      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onWithdrawn={() => navigate("/")}
        />
      )}
      <BottomNav />
    </div>
  );
}
