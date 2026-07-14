import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomOverlayMap, Map, useKakaoLoader } from "react-kakao-maps-sdk";
import BottomNav from "../components/BottomNav";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import Mascot from "../components/Mascot";
import { PRODUCT, STORE } from "../data/store";

type PinKind = "normal" | "noSale" | "sanctioned";

type Pin = {
  id: number;
  label: string;
  lat: number;
  lng: number;
  kind: PinKind;
};

const CENTER = { lat: 35.6866, lng: 127.9095 };
const DEFAULT_LEVEL = 4;
const CLUSTER_LEVEL = 6;

const PINS: Pin[] = [
  {
    id: 1,
    label: "맛있나?근\n데맛이있는\n빵집",
    lat: 35.6922,
    lng: 127.9128,
    kind: "normal",
  },
  { id: 2, label: "맛있는 빵집", lat: 35.6905, lng: 127.9022, kind: "normal" },
  { id: 3, label: "맛있는 빵집", lat: 35.6899, lng: 127.9182, kind: "noSale" },
  { id: 4, label: "맛있는 빵집", lat: 35.6889, lng: 127.9068, kind: "normal" },
  {
    id: 5,
    label: "맛있는 빵이\n였던집",
    lat: 35.6838,
    lng: 127.9148,
    kind: "normal",
  },
  { id: 6, label: "맛있는 빵집", lat: 35.6824, lng: 127.9008, kind: "normal" },
  { id: 7, label: "맛있는 빵집", lat: 35.6806, lng: 127.9016, kind: "noSale" },
  { id: 8, label: "맛있는 빵집", lat: 35.6808, lng: 127.9052, kind: "normal" },
  { id: 9, label: "", lat: 35.6892, lng: 127.9152, kind: "sanctioned" },
  { id: 10, label: "", lat: 35.6858, lng: 127.9032, kind: "sanctioned" },
  { id: 11, label: "", lat: 35.6852, lng: 127.9026, kind: "sanctioned" },
];

const CLUSTERS = [
  { n: 12, lat: 35.6902, lng: 127.9046, size: 180 },
  { n: 4, lat: 35.691, lng: 127.9166, size: 130 },
  { n: 2, lat: 35.6812, lng: 127.9032, size: 140 },
];

function PinOverlay({
  pin,
  onSelect,
}: {
  pin: Pin;
  onSelect: (p: Pin) => void;
}) {
  if (pin.kind === "sanctioned") {
    return (
      <CustomOverlayMap position={{ lat: pin.lat, lng: pin.lng }} yAnchor={0.5}>
        <button
          type="button"
          aria-label="행정처분 이력 매장"
          onClick={() => onSelect(pin)}
          className="block h-4 w-4 rounded-full border-2 border-white bg-danger shadow"
        />
      </CustomOverlayMap>
    );
  }
  const color = pin.kind === "noSale" ? "#9AA0A8" : "#F2A93B";
  return (
    <CustomOverlayMap position={{ lat: pin.lat, lng: pin.lng }} yAnchor={1}>
      <button
        type="button"
        onClick={() => onSelect(pin)}
        className="flex flex-col items-center"
      >
        <svg viewBox="0 0 32 40" className="h-10 w-8 drop-shadow">
          <path
            d="M16 2a13 13 0 0 1 13 13c0 9-13 23-13 23S3 24 3 15A13 13 0 0 1 16 2Z"
            fill={color}
          />
          <circle cx="16" cy="15" r="5" fill="#fff" />
        </svg>
        <span className="mt-0.5 whitespace-pre-line text-center text-xs font-medium text-neutral-700 [text-shadow:0_0_4px_#fff,0_0_4px_#fff]">
          {pin.label}
        </span>
      </button>
    </CustomOverlayMap>
  );
}

function StoreSheet({ pin, onClose }: { pin: Pin; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="min-h-0 flex-1 bg-black/20"
      />
      <div className="relative bg-white pb-24">
        <div className="zigzag absolute -top-[17px] left-0 w-full" />
        <div className="max-h-[52dvh] overflow-y-auto px-6 pt-8">
          {pin.kind === "sanctioned" && (
            <div className="mb-6">
              <p className="mb-4 text-center text-lg font-bold text-danger">
                ‘{STORE.name}’은 행정처분 이력이 있는 매장입니다.
              </p>
              <div className="rounded-2xl bg-field px-5 py-5 text-[15px] font-semibold leading-7">
                <p>처분 사유: 식품위생법 제OO조 위반</p>
                <p>처분 내용: 영업정지 OO일</p>
                <p>처분 기간: 2026년 O월 O일 ~ 2026년 O월 O일</p>
              </div>
            </div>
          )}
          <span
            className={`inline-block rounded-full px-3.5 py-1.5 text-sm font-semibold ${
              pin.kind === "noSale"
                ? "bg-[#E9EBEE] text-sub"
                : "bg-primary text-white"
            }`}
          >
            {pin.kind === "noSale" ? "7일 뒤 포인트 지급" : "포인트 지급"}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold">{STORE.name}</h2>
          <p className="mt-1 text-base">{STORE.road}</p>
          <p className="text-base text-sub">{STORE.lot}</p>
          <div className="mt-5 rounded-2xl bg-field p-5">
            <p className="mb-4 font-semibold text-sub">할인중인 상품</p>
            {pin.kind === "noSale" ? (
              <div className="flex h-72 items-center justify-center">
                <p className="text-lg text-neutral-400">
                  할인 중인 상품이 없습니다
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-xl"
                  >
                    <BreadImage className="h-full w-full" />
                    <div className="absolute bottom-2.5 left-3 text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                      <p className="text-sm font-medium">{PRODUCT.name}</p>
                      <p className="text-lg font-bold">
                        <span className="text-[#FF6B6B]">
                          {PRODUCT.discount}%
                        </span>{" "}
                        {PRODUCT.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitModal({ onClose }: { onClose: () => void }) {
  const pieces = [
    { l: "12%", t: "18%", r: "-30deg" },
    { l: "30%", t: "10%", r: "20deg" },
    { l: "66%", t: "12%", r: "-15deg" },
    { l: "84%", t: "20%", r: "35deg" },
    { l: "8%", t: "48%", r: "60deg" },
    { l: "90%", t: "50%", r: "-50deg" },
    { l: "20%", t: "72%", r: "15deg" },
    { l: "78%", t: "70%", r: "-20deg" },
  ];
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center px-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="pop-in relative flex h-[440px] w-full flex-col items-center overflow-hidden rounded-3xl bg-white pt-24 shadow-xl">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="confetti absolute h-2 w-5 rounded-sm bg-[#F6C86B]"
            style={{
              left: p.l,
              top: p.t,
              transform: `rotate(${p.r})`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
        <p className="text-sub">2026.07.11</p>
        <p className="mt-2 text-lg">
          <span className="font-bold text-primary">{STORE.name}</span> 방문 인증
          완료!
        </p>
        <p className="mt-2 text-3xl font-extrabold">2000포인트 적립</p>
        <Mascot pose="peek" className="absolute -bottom-2 w-56" />
      </div>
    </div>
  );
}

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
    libraries: ["services", "clusterer"],
  });

  console.log("KEY:", import.meta.env.VITE_KAKAO_JS_KEY);
  console.log("ERROR:", error);

  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [selected, setSelected] = useState<Pin | null>(null);
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    const state = location.state as {
      visited?: boolean;
      openStore?: boolean;
    } | null;
    if (state?.visited) setVisited(true);
    if (state?.openStore)
      setSelected(PINS.find((p) => p.kind === "normal") ?? null);
    if (state) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const clustered = level >= CLUSTER_LEVEL;

  const recenter = () => {
    if (!map) return;
    map.setLevel(DEFAULT_LEVEL);
    map.panTo(new kakao.maps.LatLng(CENTER.lat, CENTER.lng));
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className={`absolute inset-0 ${selected ? "grayscale" : ""}`}>
          {loading || error ? (
            <div className="flex h-full items-center justify-center bg-[#EDF1EA] text-sub">
              {error ? "지도를 불러오지 못했어요" : "지도를 불러오는 중..."}
            </div>
          ) : (
            <Map
              center={CENTER}
              level={DEFAULT_LEVEL}
              className="h-full w-full"
              onCreate={setMap}
              onZoomChanged={(m) => setLevel(m.getLevel())}
            >
              {clustered
                ? CLUSTERS.map((c) => (
                    <CustomOverlayMap
                      key={c.n}
                      position={{ lat: c.lat, lng: c.lng }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          map?.setLevel(DEFAULT_LEVEL, {
                            anchor: new kakao.maps.LatLng(c.lat, c.lng),
                          })
                        }
                        className="flex items-center justify-center rounded-full bg-[#F3D9A0]/60 text-2xl font-semibold text-primaryDeep"
                        style={{ width: c.size, height: c.size }}
                      >
                        {c.n}
                      </button>
                    </CustomOverlayMap>
                  ))
                : PINS.map((p) => (
                    <PinOverlay key={p.id} pin={p} onSelect={setSelected} />
                  ))}
              <CustomOverlayMap position={CENTER}>
                <div className="relative h-6 w-6">
                  <span className="pulse-ring absolute inset-0 rounded-full bg-primary/40" />
                  <span className="relative block h-6 w-6 rounded-full border-4 border-[#F6DFAF] bg-primary" />
                </div>
              </CustomOverlayMap>
            </Map>
          )}
        </div>

        <div className="absolute left-0 right-0 top-4 z-10 flex items-center gap-3 px-4">
          <label className="flex h-[52px] flex-1 items-center gap-2.5 rounded-full bg-white px-5 shadow-fab">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-ink"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
            <input
              placeholder="검색어를 입력해주세요"
              className="w-full bg-transparent text-base outline-none placeholder:text-sub"
            />
          </label>
          <ChatbotFab className="shrink-0" />
        </div>

        <button
          type="button"
          aria-label="원래 위치로 돌아가기"
          onClick={recenter}
          className="absolute bottom-24 right-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-fab"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 stroke-ink"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="1.6" fill="#1F2024" stroke="none" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => navigate("/map/qr")}
          className="absolute bottom-4 left-4 right-4 z-10 h-14 rounded-2xl bg-primary text-lg font-semibold text-white shadow-fab"
        >
          방문 확인
        </button>

        {selected && (
          <StoreSheet pin={selected} onClose={() => setSelected(null)} />
        )}
        {visited && <VisitModal onClose={() => setVisited(false)} />}
      </div>
      <BottomNav />
    </div>
  );
}
