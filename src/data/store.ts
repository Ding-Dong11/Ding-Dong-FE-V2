export const STORE = {
  name: "맛있는 빵집",
  road: "경남 거창군 거창읍 거함대로 3339-39 1층",
  lot: "(우) 50146(지번) 거창읍 대평리 871"
};

export const PRODUCT = {
  store: STORE.name,
  name: "미피 구운빵",
  discount: 34,
  price: 1800
};

export const RECOMMEND_STORES = [
  { name: "맛있는 빵집", road: "경남 거창군 거창읍 거함대로 39-39", lot: "(우) 50146(지번) 거창읍 대평리 871" },
  { name: "맛있는 빵집", road: "경남 거창군 소한대로 3339-39", lot: "(우) 50146(지번) 거창읍 대평리 871" },
  { name: "맛있는 빵집", road: "경남 거창군 거창읍 거함대로 999-39", lot: "(우) 50146(지번) 거창읍 대평리 871" },
  { name: "맛있는 빵집", road: "경남 거창읍 거함대로 3339-39", lot: "(우) 50146(지번) 거창읍 대평리 871" },
  { name: "맛있는 빵집", road: "대전 거창군 대읍 거함대로 3339-39", lot: "(우) 50146(지번) 거창읍 대평리 871" },
  { name: "맛있는 빵집", road: "대전 거창군 대읍 거함대로 3339-39", lot: "(우) 50146(지번) 거창읍 대평리 871" }
];

export const DISCOUNT_ITEMS = [
  { id: 1, stock: 1, soldOut: false },
  { id: 2, stock: 12, soldOut: false },
  { id: 3, stock: 3, soldOut: false },
  { id: 4, stock: 0, soldOut: true },
  { id: 5, stock: 2, soldOut: false },
  { id: 6, stock: 3, soldOut: false }
];

export const POINT_ITEMS = [
  { id: 1, exchanged: false },
  { id: 2, exchanged: false },
  { id: 3, exchanged: false },
  { id: 4, exchanged: true },
  { id: 5, exchanged: false },
  { id: 6, exchanged: false }
];
