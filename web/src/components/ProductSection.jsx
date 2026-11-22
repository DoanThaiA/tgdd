import { useEffect, useMemo, useState } from "react";
import { ArrowDownWideNarrow, PackageSearch, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";

const PRICE_RANGES = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 4 triệu", min: 0, max: 4e6 },
  { label: "4 - 7 triệu", min: 4e6, max: 7e6 },
  { label: "7 - 13 triệu", min: 7e6, max: 13e6 },
  { label: "13 - 20 triệu", min: 13e6, max: 20e6 },
  { label: "Trên 20 triệu", min: 20e6, max: Infinity },
];
const SORTS = [
  { key: "featured", label: "Nổi bật" },
  { key: "asc", label: "Giá thấp → cao" },
  { key: "desc", label: "Giá cao → thấp" },
  { key: "battery", label: "Pin lớn" },
  { key: "charge", label: "Sạc nhanh" },
];
const NEEDS = [
  { key: "all", label: "Mọi nhu cầu" },
  { key: "battery", label: "🔋 Pin ≥ 6000mAh", test: (p) => p.battery_mah >= 6000 },
  { key: "charge", label: "⚡ Sạc ≥ 65W", test: (p) => p.charging_w >= 65 },
  { key: "5g", label: "📶 Có 5G", test: (p) => p.has_5g },
  { key: "120hz", label: "✨ Màn 120Hz+", test: (p) => p.refresh_rate >= 120 },
  { key: "selfie", label: "🤳 Selfie 32MP+", test: (p) => p.front_camera_mp >= 32 },
  { key: "ip68", label: "💧 Chống nước IP68", test: (p) => p.ip_rating >= 68 },
  { key: "ram12", label: "🧠 RAM ≥ 12GB", test: (p) => p.ram >= 12 },
  { key: "ios", label: "🍎 iOS", test: (p) => p.is_ios },
  { key: "fold", label: "📱 Máy gập", test: (p) => /fold|flip|razr|find n|duo/i.test(p.name) },
];
const PAGE = 15;

export default function ProductSection({ products, keyword, onClearKeyword, brand, onBrand, compareIds, onToggleCompare, onOpen }) {
  const [price, setPrice] = useState(0);
  const [need, setNeed] = useState("all");
  const [sort, setSort] = useState("featured");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => setLimit(PAGE), [brand, price, need, keyword]);

  const brands = useMemo(() => {
    const count = {};
    products.forEach((p) => (count[p.brand] = (count[p.brand] || 0) + 1));
    return Object.entries(count).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const list = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const range = PRICE_RANGES[price];
    const needDef = NEEDS.find((n) => n.key === need);
    let out = products.filter(
      (p) =>
        (brand === "Tất cả" || p.brand === brand) &&
        p.price >= range.min &&
        p.price < range.max &&
        (!kw || kw.split(/\s+/).every((w) => p.name.toLowerCase().includes(w))) &&
        (!needDef.test || needDef.test(p)),
    );
    const by = {
      asc: (a, b) => a.price - b.price,
      desc: (a, b) => b.price - a.price,
      battery: (a, b) => (b.battery_mah ?? -1) - (a.battery_mah ?? -1),
      charge: (a, b) => (b.charging_w ?? -1) - (a.charging_w ?? -1),
      featured: (a, b) => a.id - b.id, // giữ thứ tự trong file CSV
    }[sort];
    return [...out].sort(by);
  }, [products, brand, price, need, sort, keyword]);

  const active = [
    brand !== "Tất cả" && { label: brand, clear: () => onBrand("Tất cả") },
    price > 0 && { label: PRICE_RANGES[price].label, clear: () => setPrice(0) },
    need !== "all" && { label: NEEDS.find((n) => n.key === need).label, clear: () => setNeed("all") },
    keyword.trim() && { label: `“${keyword.trim()}”`, clear: onClearKeyword },
  ].filter(Boolean);

  const chip = (on) =>
    `shrink-0 rounded-full border px-3 py-1.5 text-[13px] transition ${
      on ? "border-link bg-blue-50 font-semibold text-link" : "border-gray-200 bg-white hover:border-gray-400"
    }`;

  return (
    <section id="products" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-6">
      <div className="card p-4 md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="flex items-center gap-2.5 text-xl font-bold md:text-2xl"><span className="h-6 w-1.5 rounded-full bg-brand" aria-hidden="true" />Điện thoại</h2>
          <span className="text-sm text-gray-500">
            <b className="text-ink">{list.length}</b> / {products.length} sản phẩm
          </span>
        </div>

        {/* Hãng */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button onClick={() => onBrand("Tất cả")} className={chip(brand === "Tất cả")}>Tất cả hãng</button>
          {brands.map(([b, n]) => (
            <button key={b} onClick={() => onBrand(b)} className={chip(b === brand)}>
              {b} <span className="text-[11px] text-gray-400">{n}</span>
            </button>
          ))}
        </div>

        {/* Bộ lọc */}
        <div className="mt-3 grid gap-2 rounded-xl bg-gray-50 p-3 md:grid-cols-[auto_1fr] md:items-center md:gap-x-4">
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600"><SlidersHorizontal size={15} /> Mức giá</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {PRICE_RANGES.map((r, i) => (
              <button key={r.label} onClick={() => setPrice(i)} className={chip(i === price)}>{r.label}</button>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600"><PackageSearch size={15} /> Nhu cầu</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {NEEDS.map((n) => (
              <button key={n.key} onClick={() => setNeed(n.key)} className={chip(n.key === need)}>{n.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {active.map((a) => (
              <span key={a.label} className="flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[12px] text-white">
                {a.label}
                <button onClick={a.clear} aria-label="Bỏ lọc" className="opacity-70 hover:opacity-100"><X size={12} /></button>
              </span>
            ))}
            {active.length > 1 && (
              <button
                onClick={() => { onBrand("Tất cả"); setPrice(0); setNeed("all"); onClearKeyword(); }}
                className="text-[12px] text-link hover:underline"
              >
                Xoá tất cả
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto text-[13px] no-scrollbar">
            <ArrowDownWideNarrow size={16} className="shrink-0 text-gray-500" />
            {SORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`shrink-0 rounded-md px-2 py-1 ${s.key === sort ? "bg-blue-50 font-semibold text-link" : "text-gray-600 hover:text-link"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>


        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {list.slice(0, limit).map((p) => (
            <ProductCard key={p.id} p={p} inCompare={compareIds.includes(p.id)} onToggleCompare={() => onToggleCompare(p.id)} onOpen={() => onOpen(p)} />
          ))}
        </div>
        {products.length > 0 && !list.length && (
          <p className="py-12 text-center text-gray-500">Không có sản phẩm phù hợp bộ lọc. Thử bỏ bớt điều kiện nhé.</p>
        )}
        {list.length > limit && (
          <div className="mt-5 text-center">
            <button onClick={() => setLimit((l) => l + PAGE)} className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold hover:border-link hover:text-link">
              Xem thêm {Math.min(PAGE, list.length - limit)} / {list.length - limit} điện thoại
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
