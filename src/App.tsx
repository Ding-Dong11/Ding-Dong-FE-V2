import { Route, Routes } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import SignupEmail from "./pages/SignupEmail";
import SignupPassword from "./pages/SignupPassword";
import MapPage from "./pages/MapPage";
import Recommend from "./pages/Recommend";
import Discount from "./pages/Discount";
import PointShop from "./pages/PointShop";
import CouponUse from "./pages/CouponUse";
import MyPage from "./pages/MyPage";
import Chatbot from "./pages/Chatbot";

export default function App() {
  return (
    <div className="app-frame">
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupEmail />} />
        <Route path="/signup/password" element={<SignupPassword />} />
        <Route path="/map" element={<MapPage />} />
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
