import { useState } from "react";
import { Check, Cpu, Plus, Smartphone, Zap } from "lucide-react";
import { storageText, thumb, vnd } from "../lib";

export function ProductImage({ p, size = 300, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!p.image_url || failed) {
    return (
      <div className={`grid place-items-center text-gray-300 ${className}`}>
        <Smartphone size={56} strokeWidth={1.2} />
      </div>
    );
  }
  return (
    <img
      src={thumb(p.image_url, size)}
      alt={p.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
    />
  );
}

export function Badges({ p }) {
  return (
    <div className="flex flex-wrap gap-1">
      {p.has_5g && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-700">5G</span>}
      {p.ip_rating >= 68 && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-sky-700">IP{p.ip_rating}</span>}
      {p.charging_w >= 65 && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-700">Sạc {p.charging_w}W</span>}
    </div>
  );
}

export default function ProductCard({ p, inCompare, onToggleCompare, onOpen }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[var(--shadow-lift)]">
      <button onClick={onOpen} className="flex flex-1 flex-col text-left">
        <div className="relative px-2 pt-2">
          <ProductImage p={p} className="aspect-square w-full transition duration-300 group-hover:scale-[1.04]" />
        </div>
        <div className="mt-2 min-h-[20px]">
          <Badges p={p} />
        </div>
        <h3 className="mt-1.5 line-clamp-2 min-h-10 text-[14px] font-medium leading-5 group-hover:text-link">{p.name}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-gray-600">
          {p.screen_inch && <span className="rounded bg-gray-100 px-1.5 py-0.5">{p.screen_inch}"</span>}
          <span className="rounded bg-gray-100 px-1.5 py-0.5">{p.ram}GB/{storageText(p.storage)}</span>
          {p.refresh_rate && <span className="rounded bg-gray-100 px-1.5 py-0.5">{p.refresh_rate}Hz</span>}
        </div>
        <div className="mt-2 text-[17px] font-bold text-sale">{vnd(p.price)}</div>
        <div className="mt-1.5 space-y-0.5 text-[12px] text-gray-500">
          <p className="flex items-center gap-1 truncate"><Cpu size={12} className="shrink-0" /> {p.chipset}</p>
          <p className="flex items-center gap-1 truncate">
            <Zap size={12} className="shrink-0" /> {p.battery_text}{p.charging_w ? ` · ${p.charging_w}W` : ""}
          </p>
        </div>
      </button>
      <button
        onClick={onToggleCompare}
        className={`mt-3 flex items-center justify-center gap-1 rounded-lg border py-1.5 text-[13px] font-medium transition ${
          inCompare ? "border-link bg-blue-50 text-link" : "border-gray-200 text-gray-600 hover:border-link hover:text-link"
        }`}
      >
        {inCompare ? <Check size={14} /> : <Plus size={14} />} {inCompare ? "Đã chọn so sánh" : "So sánh"}
      </button>
    </article>
  );
}
