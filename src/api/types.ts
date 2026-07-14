// api.yaml의 components.schemas와 1:1로 대응하는 타입 정의

export type ErrorResponse = {
  code: string;
  message: string;
};

// ── Auth ─────────────────────────────────────────────────────────────────
export type EmailCodeRequest = {
  email: string;
};

export type EmailVerifyRequest = {
  email: string;
  code: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  password_confirm: string;
};

export type SignupResponse = {
  user_id: number;
  email: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user_id: number;
  email: string;
};

export type WithdrawRequest = {
  password: string;
};

// ── Stores ───────────────────────────────────────────────────────────────
export type StoreMarker = {
  type: "store";
  store_id: number;
  store_name: string;
  longitude: number;
  latitude: number;
  has_active_qr: boolean;
  has_disposition: boolean;
  has_sale: boolean;
};

/** level 8~14 구간에서 서버가 격자(grid)로 집계해 내려주는 영역 단위 마커 */
export type AreaMarker = {
  type: "area";
  longitude: number;
  latitude: number;
  count: number;
  has_active_qr: boolean;
  has_disposition: boolean;
  has_sale: boolean;
};

export type MarkerItem = StoreMarker | AreaMarker;

export type EffectiveStatus = "ON_SALE" | "SOLD_OUT" | "EXPIRED";

export type SaleProductSummary = {
  sale_product_id: number;
  name: string;
  original_price: number;
  sale_price: number;
  image_url: string | null;
  effective_status: EffectiveStatus;
  discount_rate: number;
};

export type DispositionSummary = {
  disposition_id: number;
  type_name: string;
  disposition_date: string;
  violation_content?: string | null;
  legal_basis?: string | null;
};

export type StoreDetail = {
  store_id: number;
  store_name: string;
  branch_name?: string | null;
  road_address?: string | null;
  jibun_address?: string | null;
  longitude: number;
  latitude: number;
  image_url?: string | null;
  has_active_qr: boolean;
  sale_products: SaleProductSummary[];
  dispositions: DispositionSummary[];
};

export type StoreMarkersParams = {
  /** 현재 지도 줌(카카오맵 level) 값. 서버 클러스터링 판단 기준이라 항상 포함해야 한다. */
  zoom: number;
  min_lat?: number;
  max_lat?: number;
  min_lon?: number;
  max_lon?: number;
  limit?: number;
};

// ── Rewards ──────────────────────────────────────────────────────────────
export type QrVerifyRequest = {
  qr_token: string;
};

export type QrVerifyResponse = {
  store_id: number;
  store_name: string;
  awarded_point: number;
  balance_after: number;
};

// ── Sales ────────────────────────────────────────────────────────────────
export type SaleProductCard = {
  sale_product_id: number;
  sale_store_id: number;
  store_name: string;
  name: string;
  original_price: number;
  sale_price: number;
  discount_rate: number;
  stock_quantity: number;
  sale_deadline: string;
  effective_status: EffectiveStatus;
  small_code?: string | null;
};

export type FeedResponse = {
  items: SaleProductCard[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
};

export type SalesFeedSort = "deadline" | "discount" | "distance";

export type SalesFeedParams = {
  small_code?: string;
  sort?: SalesFeedSort;
  q?: string;
  user_lat?: number;
  user_lon?: number;
  page?: number;
  size?: number;
};

export type SubscribeResponse = {
  subscribed: boolean;
  sale_store_id: number;
};

export type SaleStoreMarker = {
  sale_store_id: number;
  name: string;
  longitude: number;
  latitude: number;
  is_expiring_soon: boolean;
};

export type SaleStoreMarkersParams = {
  min_lat?: number;
  max_lat?: number;
  min_lon?: number;
  max_lon?: number;
  limit?: number;
};

export type SaleProductDetail = {
  sale_product_id: number;
  sale_store_id: number;
  store_name: string;
  name: string;
  original_price: number;
  sale_price: number;
  discount_rate: number;
  stock_quantity: number;
  sale_deadline: string;
  effective_status: EffectiveStatus;
  small_code?: string | null;
};

// ── Recommendations ──────────────────────────────────────────────────────
export type RecommendationItem = {
  store_id: number;
  store_name: string;
  branch_name?: string | null;
  road_address?: string | null;
  jibun_address?: string | null;
  longitude: number;
  latitude: number;
  small_code?: string | null;
  image_url?: string | null;
};

export type RecommendationResponse = {
  date: string;
  top_small_code?: string | null;
  items: RecommendationItem[];
};

export type RecommendationsParams = {
  lat: number;
  lon: number;
  radius_km?: number;
  limit?: number;
};

// ── Chat ─────────────────────────────────────────────────────────────────
export type ChatInitRequest = {
  lat: number;
  lon: number;
};

export type ChatMessageRequest = {
  content: string;
  lat?: number | null;
  lon?: number | null;
};

export type ChatRole = "user" | "assistant";

export type ChatHistoryMessage = {
  role: ChatRole;
  content: string;
};

export type ChatHistoryResponse = {
  messages: ChatHistoryMessage[];
};

export type ChatStreamChunk = {
  text: string;
  done: boolean;
};

// ── Coupons ──────────────────────────────────────────────────────────────
export type CouponItem = {
  coupon_id: number;
  name: string;
  image_url?: string | null;
  point_price: number;
  description?: string | null;
};

export type CouponDetail = CouponItem;

export type CouponStatus = "UNUSED" | "USED" | "EXPIRED";

export type CouponPurchaseResponse = {
  user_coupon_id: number;
  coupon_id: number;
  name: string;
  barcode: string;
  status: CouponStatus;
  purchased_at: string;
  valid_until?: string | null;
  balance_after: number;
};

// ── MyPage ───────────────────────────────────────────────────────────────
export type PointResponse = {
  user_id: number;
  email: string;
  point_balance: number;
};

export type UserCouponItem = {
  user_coupon_id: number;
  coupon_id: number;
  name: string;
  image_url?: string | null;
  status: CouponStatus;
  purchased_at: string;
  valid_until?: string | null;
};

export type UserCouponDetail = UserCouponItem & {
  barcode: string;
  description?: string | null;
};

export type MyCouponsParams = {
  status?: CouponStatus;
};

// ── Admin ────────────────────────────────────────────────────────────────
export type QrIssueRequest = {
  reward_point: number;
};

export type QrIssueResponse = {
  qr_id: number;
  store_id: number;
  store_name: string;
  qr_token: string;
  qr_url: string;
  reward_point: number;
  is_active: boolean;
};
