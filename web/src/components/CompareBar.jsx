import { useState } from "react";
import { Bot, X } from "lucide-react";
import { modelName, orDash, storageText, vnd } from "../lib";
import { ProductImage } from "./ProductCard";

// [nhãn, giá trị hiển thị, giá trị để so (null = không so), lớn hơn là tốt hơn?]
const ROWS = [
  ["Giá", (p) => vnd(p.price), (p) => p.price, false],
  ["Hệ điều hành", (p) => p.os],
  ["Chip", (p) => p.chipset],
  ["RAM", (p) => orDash(p.ram, " GB"), (p) => p.ram, true],
  ["Bộ nhớ", (p) => storageText(p.storage), (p) => p.storage, true],
  ["Màn hình", (p) => p.screen || "—"],
  ["Tần số quét", (p) => orDash(p.refresh_rate, " Hz"), (p) => p.refresh_rate, true],
  ["Camera sau", (p) => p.rear_camera],
  ["Camera chính", (p) => orDash(p.camera_main_mp, " MP"), (p) => p.camera_main_mp, true],
  ["Camera trước", (p) => p.front_camera, (p) => p.front_camera_mp, true],
  ["Pin", (p) => p.battery_text, (p) => p.battery_mah, true],
  ["Sạc tối đa", (p) => orDash(p.charging_w, " W"), (p) => p.charging_w, true],
  ["Mạng", (p) => p.network],
  ["Kháng nước", (p) => p.water_resistance, (p) => p.ip_rating, true],
];

function bestIds(items, key, higher) {
  const vals = items.map((p) => [p.id, key(p)]).filter(([, v]) => v != null);
  if (vals.length < 2) return new Set();
  const target = higher ? Math.max(...vals.map(([, v]) => v)) : Math.min(...vals.map(([, v]) => v));
  const winners = vals.filter(([, v]) => v === target).map(([id]) => id);
  return winners.length === vals.length ? new Set() : new Set(winners); // tất cả bằng nhau -> không đánh dấu
}

export default function CompareBar({ items, onRemove, onClear, onAsk }) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;

  const askCompare = () => {
    setOpen(false);
    onAsk(`So sánh giúp tôi ${items.map((p) => modelName(p.name)).join(" và ")}`);
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,.08)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 pr-24">
          <div className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
            {items.map((p) => (
              <div key={p.id} className="relative flex w-56 shrink-0 items-center gap-2 rounded-xl border border-gray-200 p-2 pr-7">
                <ProductImage p={p} size={120} className="size-12 shrink-0" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs font-medium leading-4">{p.name}</p>
                  <p className="text-xs font-bold text-sale">{vnd(p.price)}</p>
                </div>
                <button onClick={() => onRemove(p.id)} aria-label="Bỏ" className="absolute right-1.5 top-1.5 rounded-full p-0.5 text-gray-400 hover:bg-gray-100">
                  <X size={14} />
                </button>
              </div>
            ))}
            {items.length < 3 && (
              <div className="grid w-40 shrink-0 place-items-center rounded-xl border border-dashed border-gray-300 text-xs text-gray-400">
                Thêm tối đa 3 máy
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-1.5">
            <button onClick={() => setOpen(true)} disabled={items.length < 2} className="rounded-xl bg-link px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">
              So sánh ngay
            </button>
            <button onClick={onClear} className="text-xs text-gray-500 hover:text-ink">Xoá tất cả</button>
          </div>
        </div>
      </div>

      {open && items.length >= 2 && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="animate-pop max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl thin-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">So sánh sản phẩm</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr>
                    <th className="w-32" />
                    {items.map((p) => (
                      <th key={p.id} className="p-2 align-top font-semibold">
                        <ProductImage p={p} size={200} className="mx-auto size-24" />
                        <span className="mt-1 block text-[13px] leading-4">{p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(([label, show, key, higher]) => {
                    const best = key ? bestIds(items, key, higher) : new Set();
                    return (
                      <tr key={label} className="border-t border-gray-100">
                        <td className="py-2 pr-2 align-top text-gray-500">{label}</td>
                        {items.map((p) => (
                          <td key={p.id} className={`p-2 text-center align-top ${best.has(p.id) ? "font-semibold text-emerald-700" : ""}`}>
                            {show(p)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-400">Chữ xanh: máy tốt nhất ở tiêu chí đó (giá: rẻ nhất). Số liệu theo file dữ liệu sản phẩm.</p>
              <button onClick={askCompare} className="flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black">
                <Bot size={16} /> Nhờ trợ lý AI nhận xét
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
