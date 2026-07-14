import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError, authApi } from "../api";
import PageHeader from "../components/PageHeader";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await authApi.login({ email, password });
      navigate("/map");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <div className="mt-auto pb-10">
          <button
            type="button"
            onClick={login}
            disabled={loading}
            className="h-14 w-full rounded-xl bg-primary text-lg font-semibold text-white disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
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
