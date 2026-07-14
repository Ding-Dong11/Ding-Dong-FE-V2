import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { setAuthFailureHandler } from "./api";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import SignupEmail from "./pages/SignupEmail";
import SignupPassword from "./pages/SignupPassword";
import MapPage from "./pages/MapPage";
import QrScan from "./pages/QrScan";
import Recommend from "./pages/Recommend";
import Discount from "./pages/Discount";
import PointShop from "./pages/PointShop";
import CouponUse from "./pages/CouponUse";
import MyPage from "./pages/MyPage";
import Chatbot from "./pages/Chatbot";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // refresh_token까지 만료되어 재로그인이 필요할 때 client.ts가 호출한다.
    setAuthFailureHandler(() => navigate("/login", { replace: true }));
    return () => setAuthFailureHandler(null);
  }, [navigate]);

  return (
    <div className="app-frame">
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupEmail />} />
        <Route path="/signup/password" element={<SignupPassword />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/qr" element={<QrScan />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/discount" element={<Discount />} />
        <Route path="/coupon" element={<PointShop />} />
        <Route path="/coupon/use" element={<CouponUse />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </div>
  );
}
