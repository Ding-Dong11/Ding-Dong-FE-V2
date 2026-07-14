import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function SignupEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [remain, setRemain] = useState(180);

  useEffect(() => {
    if (!sent || remain <= 0) return;
    const timer = setInterval(() => setRemain((r) => r - 1), 1000);
    return () => clearInterval(timer);
  }, [sent, remain]);

  const mm = Math.floor(remain / 60);
  const ss = String(remain % 60).padStart(2, "0");

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader />
      <div className="flex flex-1 flex-col px-6">
        <h1 className="mb-10 mt-4 text-center text-3xl font-extrabold text-primary">회원가입</h1>
        <label className="mb-2 text-base font-semibold">이메일</label>
        <div className="mb-6 flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            className="h-14 flex-1 rounded-xl bg-field px-4 text-base outline-none placeholder:text-sub focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            disabled={sent}
            onClick={() => {
              setSent(true);
              setRemain(180);
            }}
            className={`h-14 w-24 rounded-xl text-base font-semibold text-white ${sent ? "bg-[#DDE0E5]" : "bg-primary"}`}
          >
            인증
          </button>
        </div>
        <label className="mb-2 text-base font-semibold">인증 코드</label>
        <div className={`flex h-14 items-center rounded-xl px-4 ${sent ? "bg-field" : "bg-[#EDEFF3]"}`}>
          <input
            type="text"
            inputMode="numeric"
            value={code}
            disabled={!sent}
            onChange={(e) => setCode(e.target.value)}
            placeholder={sent ? "인증 코드를 입력해주세요" : "이메일 인증 버튼을 눌러주세요"}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-sub disabled:cursor-not-allowed"
          />
          {sent && (
            <span className="ml-2 text-base font-medium text-primary">
              {mm}:{ss}
            </span>
          )}
        </div>
        <div className="mt-auto pb-10">
          <button
            type="button"
            onClick={() => navigate("/signup/password")}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-lg font-semibold text-white"
          >
            다음
            <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-white" fill="none" strokeWidth="2.6" strokeLinecap="round">
              <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="mt-3 text-center text-sm text-sub">
            계정이 있으신가요?{" "}
            <Link to="/login" className="font-semibold text-primary">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
