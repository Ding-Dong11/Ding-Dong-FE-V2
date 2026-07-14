import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function PasswordField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-6">
      <label className="mb-2 block text-base font-semibold">{label}</label>
      <div className="flex h-14 items-center rounded-xl bg-field px-4 focus-within:ring-2 focus-within:ring-primary/40">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="flex-1 bg-transparent text-base outline-none placeholder:text-sub"
        />
        <button type="button" aria-label="비밀번호 표시 전환" onClick={() => setShow((s) => !s)}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-sub" fill="none" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" />
            {!show && <path d="M4 20 20 4" />}
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SignupPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader />
      <div className="flex flex-1 flex-col px-6">
        <h1 className="mb-10 mt-4 text-center text-3xl font-extrabold text-primary">회원가입</h1>
        <PasswordField label="비밀번호" value={password} onChange={setPassword} />
        <PasswordField label="비밀번호 확인" value={confirm} onChange={setConfirm} />
        <div className="mt-auto pb-10">
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="h-14 w-full rounded-xl bg-primary text-lg font-semibold text-white"
          >
            회원가입
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
