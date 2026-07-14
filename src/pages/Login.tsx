import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader />
      <div className="flex flex-1 flex-col px-6">
        <h1 className="mb-10 mt-4 text-center text-3xl font-extrabold text-primary">로그인</h1>
        <label className="mb-2 text-base font-semibold">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력해주세요"
          className="mb-6 h-14 rounded-xl bg-field px-4 text-base outline-none placeholder:text-sub focus:ring-2 focus:ring-primary/40"
        />
        <label className="mb-2 text-base font-semibold">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          className="h-14 rounded-xl bg-field px-4 text-base outline-none placeholder:text-sub focus:ring-2 focus:ring-primary/40"
        />
        <div className="mt-auto pb-10">
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="h-14 w-full rounded-xl bg-primary text-lg font-semibold text-white"
          >
            로그인
          </button>
          <p className="mt-3 text-center text-sm text-sub">
            계정이 없으신가요?{" "}
            <Link to="/signup" className="font-semibold text-primary">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
