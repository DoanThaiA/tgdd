import { useEffect } from "react";
import { Bot, Check, Plus, X } from "lucide-react";
import { modelName, orDash, storageText, vnd } from "../lib";
import { Badges, ProductImage } from "./ProductCard";

export default function ProductModal({ product: p, inCompare, onToggleCompare, onClose, onAsk }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const short = modelName(p.name);
  // Đúng các cột của file CSV
  const specs = [
    ["Hệ điều hành", p.os],
    ["Chip xử lý", p.chipset],
    ["RAM / Bộ nhớ", `${orDash(p.ram, " GB")} / ${storageText(p.storage)}`],
    ["Màn hình", p.screen || "—"],
    ["Camera sau", p.rear_camera],
    ["Camera trước", p.front_camera],
    ["Pin", p.battery_text],
    ["Sạc tối đa", orDash(p.charging_w, " W")],
    ["Mạng", p.network],
    ["Kháng nước, bụi", p.water_resistance],
  ];
  const askList = [
    `${short} có chơi game tốt không?`,
    `Camera ${short} chụp ảnh có đẹp không?`,
    `Máy nào tương tự ${short} nhưng rẻ hơn?`,
  ];

  return (
    <div className="animate-fade fixed inset-0 z-50 grid place-items-center bg-black/50 p-3 backdrop-blur-[2px]" onClick={onClose}>
      <div className="animate-pop relative max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl thin-scroll" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Đóng" className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 hover:bg-gray-100">
          <X size={20} />
        </button>
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.15fr] md:p-6">
          <div className="rounded-2xl bg-gradient-to-b from-gray-50 to-white p-5">
            <ProductImage p={p} size={600} className="aspect-square w-full" />
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">{p.brand}</span>
            <h2 className="mt-0.5 pr-8 text-xl font-bold leading-snug md:text-2xl">{p.name}</h2>
            <div className="mt-2"><Badges p={p} /></div>
            <div className="mt-3 text-[28px] font-extrabold leading-none text-sale">{vnd(p.price)}</div>

            <table className="mt-4 w-full text-sm">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <td className="w-36 py-1.5 align-top text-gray-500">{k}</td>
                    <td className="py-1.5 font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => onAsk(`Tôi có khoảng ${Math.round(p.price / 1e6)} triệu, muốn máy tương tự ${short}. Có gợi ý nào không?`)}
                className="flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
              >
                <Bot size={16} /> Hỏi trợ lý AI về máy này
              </button>
              <button onClick={onToggleCompare} className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">
                {inCompare ? <Check size={16} /> : <Plus size={16} />} {inCompare ? "Đã thêm so sánh" : "Thêm so sánh"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {askList.map((q) => (
                <button key={q} onClick={() => onAsk(q)} className="rounded-full bg-gray-100 px-3 py-1 text-xs hover:bg-blue-50 hover:text-link">{q}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
