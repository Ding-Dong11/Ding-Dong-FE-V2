import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomOverlayMap, Map, MarkerClusterer, useKakaoLoader } from "react-kakao-maps-sdk";
import BottomNav from "../components/BottomNav";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import Mascot from "../components/Mascot";
import { storesApi } from "../api";
import type { AreaMarker, MarkerItem, StoreDetail, StoreMarker, StoreSearchItem } from "../api";

const CENTER = { lat: 35.6866, lng: 127.9095 };
const DEFAULT_LEVEL = 4;
const FETCH_DEBOUNCE_MS = 300;
// 값이 클수록 같은 화면 픽셀 반경 안의 상가를 더 넓게 묶는다.
const CLUSTERER_GRID_SIZE = 40;
// level 1(최대 확대)은 더 확대해서 풀 방법이 없으므로 클러스터링하지 않고 항상 개별 마커로 보여준다.
const CLUSTERER_MIN_LEVEL = 2;
const STORE_LABEL_MAX_LENGTH = 15;
// 위경도를 이 소수 자릿수로 반올림해서 같은 값이면 "같은 위치(건물)"로 본다 (5자리 ≈ 1m 오차).
const SAME_LOCATION_PRECISION = 5;
// store 클러스터 개수 구간 경계 → 아래 CLUSTERER_STYLES 3단계와 짝지어진다.
const CLUSTERER_CALCULATOR = [10, 30];
// 크림톤 반투명 배지 (레퍼런스 디자인과 동일 톤)
const CLUSTERER_STYLES: CSSProperties[] = [
  {
    width: "44px",
    height: "44px",
    lineHeight: "44px",
    textAlign: "center",
    borderRadius: "50%",
    background: "rgba(253, 243, 220, 0.85)",
    border: "1px solid rgba(240, 182, 85, 0.7)",
    color: "#C97D14",
    fontWeight: 700,
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },
  {
    width: "56px",
    height: "56px",
    lineHeight: "56px",
    textAlign: "center",
    borderRadius: "50%",
    background: "rgba(253, 243, 220, 0.85)",
    border: "1px solid rgba(240, 182, 85, 0.7)",
    color: "#C97D14",
    fontWeight: 700,
    fontSize: "17px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },
  {
    width: "70px",
    height: "70px",
    lineHeight: "70px",
    textAlign: "center",
    borderRadius: "50%",
    background: "rgba(253, 243, 220, 0.85)",
    border: "1px solid rgba(240, 182, 85, 0.7)",
    color: "#C97D14",
    fontWeight: 700,
    fontSize: "19px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },
];

type PinKind = "normal" | "noSale" | "sanctioned";

function pinKind(marker: StoreMarker): PinKind {
  if (marker.has_disposition) return "sanctioned";
  return marker.has_sale ? "normal" : "noSale";
}

// area.count 범위(수십~수만)에 맞춰 뱃지 크기를 몇 단계로 구분
function areaSize(count: number) {
  if (count >= 5000) return 76;
  if (count >= 500) return 64;
  if (count >= 50) return 52;
  return 44;
}

const AreaPin = memo(function AreaPin({
  area,
  onSelect,
}: {
  area: AreaMarker;
  onSelect: (area: AreaMarker) => void;
}) {
  const size = areaSize(area.count);
  const fontSize = size >= 76 ? 19 : size >= 64 ? 17 : size >= 52 ? 16 : 15;

  return (
    <CustomOverlayMap position={{ lat: area.latitude, lng: area.longitude }} yAnchor={0.5}>
      <button
        type="button"
        aria-label={`상가 ${area.count}개 영역`}
        onClick={() => onSelect(area)}
        className="relative flex items-center justify-center rounded-full border-2 border-white/70 font-bold text-white shadow-fab backdrop-blur-sm"
        style={{
          width: size,
          height: size,
          fontSize,
          background: "rgba(232, 154, 37, 0.72)",
        }}
      >
        {area.count.toLocaleString()}
        {area.has_active_qr && (
          <span className="absolute -top-1.5 left-0 -translate-x-1/3 whitespace-nowrap rounded-full bg-[#2E7D32] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow">
            QR
          </span>
        )}
        {area.has_sale && (
          <span className="absolute -top-1.5 right-0 translate-x-1/3 whitespace-nowrap rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow">
            할인
          </span>
        )}
        {area.has_disposition && (
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow">
            주의
          </span>
        )}
      </button>
    </CustomOverlayMap>
  );
});

const PinOverlay = memo(function PinOverlay({
  marker,
  onSelect,
}: {
  marker: StoreMarker;
  onSelect: (storeId: number) => void;
}) {
  const kind = pinKind(marker);
  const position = { lat: marker.latitude, lng: marker.longitude };

  if (kind === "sanctioned") {
    return (
      <CustomOverlayMap position={position} yAnchor={0.5}>
        <button
          type="button"
          aria-label="행정처분 이력 매장"
          onClick={() => onSelect(marker.store_id)}
          className="block h-4 w-4 rounded-full border-2 border-white bg-danger shadow"
        />
      </CustomOverlayMap>
    );
  }

  const color = kind === "noSale" ? "#9AA0A8" : "#F2A93B";
  return (
    <CustomOverlayMap position={position} yAnchor={1}>
      <button
        type="button"
        onClick={() => onSelect(marker.store_id)}
        className="flex flex-col items-center"
      >
        <svg viewBox="0 0 32 40" className="h-10 w-8 drop-shadow">
          <path
            d="M16 2a13 13 0 0 1 13 13c0 9-13 23-13 23S3 24 3 15A13 13 0 0 1 16 2Z"
            fill={color}
          />
          <circle cx="16" cy="15" r="5" fill="#fff" />
        </svg>
        <span className="mt-0.5 whitespace-pre-line break-keep text-center text-xs font-medium text-neutral-700 [text-shadow:0_0_4px_#fff,0_0_4px_#fff]">
          {marker.store_name.slice(0, STORE_LABEL_MAX_LENGTH)}
        </span>
      </button>
    </CustomOverlayMap>
  );
});

// 같은 위치(건물)에 상가가 여러 개 있을 때 하나의 핀 + "N개 상가" 라벨로 합쳐 보여준다.
const GroupedPinOverlay = memo(function GroupedPinOverlay({
  group,
  onSelect,
}: {
  group: StoreGroup;
  onSelect: (group: StoreGroup) => void;
}) {
  const hasDisposition = group.stores.some((s) => s.has_disposition);
  const hasSale = group.stores.some((s) => s.has_sale);
  const color = hasDisposition ? "#FF4D4F" : hasSale ? "#F2A93B" : "#9AA0A8";

  return (
    <CustomOverlayMap position={{ lat: group.lat, lng: group.lng }} yAnchor={1}>
      <button
        type="button"
        aria-label={`이 위치의 상가 ${group.stores.length}곳`}
        onClick={() => onSelect(group)}
        className="flex flex-col items-center"
      >
        <svg viewBox="0 0 32 40" className="h-10 w-8 drop-shadow">
          <path
            d="M16 2a13 13 0 0 1 13 13c0 9-13 23-13 23S3 24 3 15A13 13 0 0 1 16 2Z"
            fill={color}
          />
          <circle cx="16" cy="15" r="5" fill="#fff" />
        </svg>
        <span className="mt-0.5 whitespace-nowrap rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-semibold text-white shadow [text-shadow:none]">
          {group.stores.length}개 상가
        </span>
      </button>
    </CustomOverlayMap>
  );
});

function StoreSheet({
  detail,
  loading,
  onClose,
}: {
  detail: StoreDetail | null;
  loading: boolean;
  onClose: () => void;
}) {
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
          {loading || !detail ? (
            <div className="flex h-40 items-center justify-center text-sub">
              불러오는 중...
            </div>
          ) : (
            <>
              {detail.dispositions.length > 0 && (
                <div className="mb-6">
                  <p className="mb-4 text-center text-lg font-bold text-danger">
                    ‘{detail.store_name}’은 행정처분 이력이 있는 매장입니다.
                  </p>
                  <div className="space-y-3">
                    {detail.dispositions.map((d) => (
                      <div
                        key={d.disposition_id}
                        className="rounded-2xl bg-field px-5 py-5 text-[15px] font-semibold leading-7"
                      >
                        <p>처분 종류: {d.type_name}</p>
                        {d.violation_content && <p>처분 사유: {d.violation_content}</p>}
                        {d.legal_basis && <p>근거 법령: {d.legal_basis}</p>}
                        <p>처분일: {d.disposition_date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <span
                className={`inline-block rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                  detail.has_active_qr
                    ? "bg-primary text-white"
                    : "bg-[#E9EBEE] text-sub"
                }`}
              >
                {detail.has_active_qr ? "포인트 지급" : "7일 뒤 포인트 지급"}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold">
                {detail.store_name}
                {detail.branch_name ? ` ${detail.branch_name}` : ""}
              </h2>
              {detail.road_address && (
                <p className="mt-1 text-base">{detail.road_address}</p>
              )}
              {detail.jibun_address && (
                <p className="text-base text-sub">{detail.jibun_address}</p>
              )}
              <div className="mt-5 rounded-2xl bg-field p-5">
                <p className="mb-4 font-semibold text-sub">할인중인 상품</p>
                {detail.sale_products.length === 0 ? (
                  <div className="flex h-72 items-center justify-center">
                    <p className="text-lg text-neutral-400">
                      할인 중인 상품이 없습니다
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {detail.sale_products.map((p) => (
                      <div
                        key={p.sale_product_id}
                        className="relative aspect-square overflow-hidden rounded-xl"
                      >
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <BreadImage className="h-full w-full" />
                        )}
                        <div className="absolute bottom-2.5 left-3 text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-lg font-bold">
                            <span className="text-[#FF6B6B]">
                              {Math.round(p.discount_rate)}%
                            </span>{" "}
                            {p.sale_price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StoreGroupSheet({
  stores,
  onSelectStore,
  onClose,
}: {
  stores: StoreMarker[];
  onSelectStore: (storeId: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="min-h-0 flex-1 bg-black/20"
      />
      <div className="relative bg-white pb-8">
        <div className="zigzag absolute -top-[17px] left-0 w-full" />
        <div className="max-h-[52dvh] overflow-y-auto px-6 pt-8">
          <h2 className="mb-4 text-xl font-extrabold">이 위치의 상가 {stores.length}곳</h2>
          <div className="space-y-3">
            {stores.map((s) => (
              <button
                key={s.store_id}
                type="button"
                onClick={() => onSelectStore(s.store_id)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-field px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">{s.store_name}</p>
                  {(s.has_sale || s.has_active_qr || s.has_disposition) && (
                    <div className="mt-1.5 flex gap-1.5">
                      {s.has_sale && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                          할인
                        </span>
                      )}
                      {s.has_active_qr && (
                        <span className="rounded-full bg-[#2E7D32] px-2 py-0.5 text-xs font-semibold text-white">
                          QR
                        </span>
                      )}
                      {s.has_disposition && (
                        <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white">
                          행정처분
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 stroke-sub"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitModal({
  storeName,
  awardedPoint,
  onClose,
}: {
  storeName: string;
  awardedPoint: number;
  onClose: () => void;
}) {
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
  const today = new Date();
  const dateLabel = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;

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
        <p className="text-sub">{dateLabel}</p>
        <p className="mt-2 text-lg">
          <span className="font-bold text-primary">{storeName}</span> 방문 인증
          완료!
        </p>
        <p className="mt-2 text-3xl font-extrabold">{awardedPoint}포인트 적립</p>
        <Mascot pose="peek" className="absolute -bottom-2 w-56" />
      </div>
    </div>
  );
}

function markerKey(item: MarkerItem): string {
  return item.type === "store" ? `store-${item.store_id}` : `area-${item.latitude}-${item.longitude}`;
}

function sameMarker(a: MarkerItem, b: MarkerItem): boolean {
  if (a.type !== b.type) return false;
  if (a.type === "store" && b.type === "store") {
    return (
      a.store_id === b.store_id &&
      a.store_name === b.store_name &&
      a.latitude === b.latitude &&
      a.longitude === b.longitude &&
      a.has_active_qr === b.has_active_qr &&
      a.has_disposition === b.has_disposition &&
      a.has_sale === b.has_sale
    );
  }
  if (a.type === "area" && b.type === "area") {
    return (
      a.latitude === b.latitude &&
      a.longitude === b.longitude &&
      a.count === b.count &&
      a.has_active_qr === b.has_active_qr &&
      a.has_disposition === b.has_disposition &&
      a.has_sale === b.has_sale
    );
  }
  return false;
}

// 내용이 그대로인 마커는 이전 객체 참조를 재사용해서 React.memo가 리렌더를 건너뛸 수 있게 한다.
function mergeMarkers(prev: MarkerItem[], next: MarkerItem[]): MarkerItem[] {
  // 이 파일은 react-kakao-maps-sdk의 Map 컴포넌트를 import해서 전역 Map 생성자를 가리므로 globalThis로 명시.
  const prevByKey = new globalThis.Map(prev.map((m) => [markerKey(m), m] as const));
  return next.map((item) => {
    const existing = prevByKey.get(markerKey(item));
    return existing && sameMarker(existing, item) ? existing : item;
  });
}

type FetchedBounds = {
  zoom: number;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

type StoreGroup = { key: string; lat: number; lng: number; stores: StoreMarker[] };

// 위경도를 반올림한 값을 key로 묶어서, 같은 위치(건물)에 있는 store들을 하나의 그룹으로 합친다.
function groupBySameLocation(stores: StoreMarker[]): StoreGroup[] {
  const groups = new globalThis.Map<string, StoreGroup>();
  for (const marker of stores) {
    const key = `${marker.latitude.toFixed(SAME_LOCATION_PRECISION)}_${marker.longitude.toFixed(SAME_LOCATION_PRECISION)}`;
    const existing = groups.get(key);
    if (existing) {
      existing.stores.push(marker);
    } else {
      groups.set(key, { key, lat: marker.latitude, lng: marker.longitude, stores: [marker] });
    }
  }
  return Array.from(groups.values());
}

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_JS_KEY,
    libraries: ["services", "clusterer"],
  });

  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  // 접속 직후 geolocation을 받기 전까지는 기본 좌표(거창)로 먼저 띄우고, 위치를 받으면 그쪽으로 이동한다.
  const [center, setCenter] = useState(CENTER);
  const [markers, setMarkers] = useState<MarkerItem[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [groupedStores, setGroupedStores] = useState<StoreMarker[] | null>(null);
  const [detail, setDetail] = useState<StoreDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  // 다른 페이지에서 openStoreId로 진입했을 때만 상세 로드 후 그 상가 좌표로 지도를 이동시킨다.
  const [pendingPan, setPendingPan] = useState(false);
  const [visit, setVisit] = useState<{ storeName: string; awardedPoint: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // null: 검색 시작 전(드롭다운 닫힘) / []: 검색했지만 결과 없음
  const [searchResults, setSearchResults] = useState<StoreSearchItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const fetchTimerRef = useRef<number | null>(null);
  const lastFetchRef = useRef<FetchedBounds | null>(null);

  // props로 <Map>에 넘기는 콜백은 반드시 안정된 참조여야 한다. react-kakao-maps-sdk의 Map은
  // onCreate를 [map, onCreate] 의존성 effect에서 실행하고, onZoomChanged/onIdle 리스너도
  // [target, type, callback] 의존성으로 재부착한다 — 매 렌더마다 새 함수를 넘기면 그때마다
  // onCreate가 재실행되고 리스너가 뜯겼다 다시 붙으면서 fetchMarkers가 불필요하게 반복 호출된다.
  const fetchMarkers = useCallback((m: kakao.maps.Map) => {
    const bounds = m.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const zoom = m.getLevel();
    const minLat = sw.getLat();
    const maxLat = ne.getLat();
    const minLon = sw.getLng();
    const maxLon = ne.getLng();

    // 같은 줌에서 이미 불러온 영역 안으로만 이동했다면 재조회하지 않고 기존 마커를 그대로 둔다.
    const last = lastFetchRef.current;
    const alreadyLoaded =
      last !== null &&
      last.zoom === zoom &&
      minLat >= last.minLat &&
      maxLat <= last.maxLat &&
      minLon >= last.minLon &&
      maxLon <= last.maxLon;
    if (alreadyLoaded) return;

    storesApi
      .getMarkers({ zoom, min_lat: minLat, max_lat: maxLat, min_lon: minLon, max_lon: maxLon })
      .then((next) => {
        lastFetchRef.current = { zoom, minLat, maxLat, minLon, maxLon };
        setMarkers((prev) => mergeMarkers(prev, next));
      })
      .catch(() => {});
  }, []);

  const fetchMarkersDebounced = useCallback(
    (m: kakao.maps.Map) => {
      if (fetchTimerRef.current !== null) window.clearTimeout(fetchTimerRef.current);
      fetchTimerRef.current = window.setTimeout(() => fetchMarkers(m), FETCH_DEBOUNCE_MS);
    },
    [fetchMarkers]
  );

  const handleMapCreate = useCallback(
    (m: kakao.maps.Map) => {
      setMap(m);
      setLevel(m.getLevel());
      fetchMarkers(m);
    },
    [fetchMarkers]
  );

  const handleZoomChanged = useCallback((m: kakao.maps.Map) => setLevel(m.getLevel()), []);

  const handleAreaClick = useCallback(
    (area: AreaMarker) => {
      if (!map) return;
      // 카카오맵은 level 숫자가 낮을수록 확대된 상태라 2단계 내려서 줌인한다.
      map.setLevel(Math.max(1, map.getLevel() - 2));
      map.panTo(new kakao.maps.LatLng(area.latitude, area.longitude));
    },
    [map]
  );

  const stores = useMemo(
    () => markers.filter((item): item is StoreMarker => item.type === "store"),
    [markers]
  );
  const areas = useMemo(
    () => markers.filter((item): item is AreaMarker => item.type === "area"),
    [markers]
  );

  // level 1(클러스터링 비활성 구간)에서만 같은 위치의 store를 하나의 그룹으로 합친다.
  const storeGroups = useMemo<StoreGroup[]>(() => {
    if (level >= CLUSTERER_MIN_LEVEL) {
      return stores.map((marker) => ({
        key: `s-${marker.store_id}`,
        lat: marker.latitude,
        lng: marker.longitude,
        stores: [marker],
      }));
    }
    return groupBySameLocation(stores);
  }, [stores, level]);

  const handleGroupSelect = useCallback((group: StoreGroup) => {
    if (group.stores.length === 1) {
      setSelectedStoreId(group.stores[0].store_id);
    } else {
      setGroupedStores(group.stores);
    }
  }, []);

  const handleGroupCardSelect = useCallback((storeId: number) => {
    setGroupedStores(null);
    setSelectedStoreId(storeId);
  }, []);

  useEffect(() => {
    return () => {
      if (fetchTimerRef.current !== null) window.clearTimeout(fetchTimerRef.current);
    };
  }, []);

  // 접속 시 현재 위치를 한 번 받아온다. 거부/실패하면 기본 좌표(거창)에 그대로 머문다.
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  // map 생성과 geolocation 응답 중 늦게 끝나는 쪽에 맞춰, 둘 다 준비되면 그 위치로 이동한다.
  useEffect(() => {
    if (!map || !userLocation) return;
    map.setLevel(DEFAULT_LEVEL);
    map.panTo(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    setCenter(userLocation);
  }, [map, userLocation]);

  useEffect(() => {
    const state = location.state as
      | { visited?: boolean; awardedPoint?: number; storeName?: string; openStoreId?: number }
      | null;
    if (state?.visited) {
      setVisit({ storeName: state.storeName ?? "", awardedPoint: state.awardedPoint ?? 0 });
    }
    if (state?.openStoreId) {
      setPendingPan(true);
      setSelectedStoreId(state.openStoreId);
    }
    if (state) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (selectedStoreId === null) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    storesApi
      .getDetail(selectedStoreId)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedStoreId]);

  // map과 detail이 모두 준비되는 시점(순서 무관)에 한 번만 그 상가 좌표로 이동한다.
  useEffect(() => {
    if (!pendingPan || !map || !detail) return;
    map.setLevel(3);
    map.panTo(new kakao.maps.LatLng(detail.latitude, detail.longitude));
    setPendingPan(false);
  }, [pendingPan, map, detail]);

  // 검색어 입력 300ms 후 조회. 그 사이 입력이 바뀌면 이전 타이머를 취소한다.
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const timer = window.setTimeout(() => {
      storesApi
        .search(q, 20)
        .then(setSearchResults)
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSelect = useCallback(
    (item: StoreSearchItem) => {
      if (map) {
        map.setLevel(3);
        map.panTo(new kakao.maps.LatLng(item.latitude, item.longitude));
      }
      setSelectedStoreId(item.store_id);
      setSearchQuery("");
      setSearchResults(null);
    },
    [map]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults(null);
  }, []);

  const recenter = () => {
    if (!map) return;
    map.setLevel(DEFAULT_LEVEL);
    map.panTo(new kakao.maps.LatLng(center.lat, center.lng));
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div
          className={`absolute inset-0 ${
            selectedStoreId !== null || groupedStores !== null ? "grayscale" : ""
          }`}
        >
          {loading || error ? (
            <div className="flex h-full items-center justify-center bg-[#EDF1EA] text-sub">
              {error ? "지도를 불러오지 못했어요" : "지도를 불러오는 중..."}
            </div>
          ) : (
            <Map
              center={CENTER}
              level={DEFAULT_LEVEL}
              className="h-full w-full"
              onCreate={handleMapCreate}
              onZoomChanged={handleZoomChanged}
              onIdle={fetchMarkersDebounced}
            >
              {/*
                level 1~7: 개별 store 마커 → 카카오 네이티브 클러스터러에 위임.
                단, level 1은 더 확대해서 풀 방법이 없으니 클러스터링 대상에서 제외한다
                (좌표가 거의 같은 상가라도 항상 개별 핀으로 노출되도록).
              */}
              <MarkerClusterer
                gridSize={CLUSTERER_GRID_SIZE}
                averageCenter
                minLevel={CLUSTERER_MIN_LEVEL}
                calculator={CLUSTERER_CALCULATOR}
                styles={CLUSTERER_STYLES}
              >
                {storeGroups.map((group) =>
                  group.stores.length === 1 ? (
                    <PinOverlay key={group.key} marker={group.stores[0]} onSelect={setSelectedStoreId} />
                  ) : (
                    <GroupedPinOverlay key={group.key} group={group} onSelect={handleGroupSelect} />
                  )
                )}
              </MarkerClusterer>

              {/* level 8~14: 서버가 격자로 집계해 내려주는 area 마커 */}
              {areas.map((a) => (
                <AreaPin key={`area-${a.latitude}-${a.longitude}`} area={a} onSelect={handleAreaClick} />
              ))}

              <CustomOverlayMap position={center}>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력해주세요"
              className="min-w-0 w-full bg-transparent text-base outline-none placeholder:text-sub"
            />
            {searchQuery && (
              <button type="button" aria-label="검색어 지우기" onClick={clearSearch} className="shrink-0">
                <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-sub" fill="none" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6 18 18M18 6 6 18" />
                </svg>
              </button>
            )}
          </label>
          <ChatbotFab className="shrink-0" />
        </div>

        {searchResults !== null && (
          <div className="absolute left-4 right-[84px] top-[72px] z-10 max-h-[60vh] overflow-y-auto rounded-2xl bg-white p-2 shadow-fab">
            {searchLoading ? (
              <p className="p-4 text-center text-sm text-sub">검색 중...</p>
            ) : searchResults.length === 0 ? (
              <p className="p-4 text-center text-sm text-sub">검색 결과가 없습니다</p>
            ) : (
              searchResults.map((item) => (
                <button
                  key={item.store_id}
                  type="button"
                  onClick={() => handleSearchSelect(item)}
                  className="flex w-full flex-col items-start gap-1 rounded-xl px-3 py-2.5 text-left active:bg-field"
                >
                  <p className="text-base font-semibold">
                    {item.store_name}
                    {item.branch_name ? ` ${item.branch_name}` : ""}
                  </p>
                  {item.road_address && (
                    <p className="truncate text-xs text-sub">{item.road_address}</p>
                  )}
                  {(item.has_active_qr || item.has_sale || item.has_disposition) && (
                    <div className="flex gap-1.5">
                      {item.has_active_qr && (
                        <span className="rounded-full bg-[#2E7D32] px-2 py-0.5 text-[10px] font-semibold text-white">
                          QR 적립 가능
                        </span>
                      )}
                      {item.has_sale && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                          할인 상품
                        </span>
                      )}
                      {item.has_disposition && (
                        <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold text-white">
                          행정처분
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        )}

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

        {groupedStores && (
          <StoreGroupSheet
            stores={groupedStores}
            onSelectStore={handleGroupCardSelect}
            onClose={() => setGroupedStores(null)}
          />
        )}
        {selectedStoreId !== null && (
          <StoreSheet
            detail={detail}
            loading={detailLoading}
            onClose={() => setSelectedStoreId(null)}
          />
        )}
        {visit && (
          <VisitModal
            storeName={visit.storeName}
            awardedPoint={visit.awardedPoint}
            onClose={() => setVisit(null)}
          />
        )}
      </div>
      <BottomNav />
    </div>
  );
}
