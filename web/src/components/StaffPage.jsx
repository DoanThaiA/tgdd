import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ClipboardList, Headset, LifeBuoy, RefreshCcw, Smartphone, Sparkles, Undo2 } from "lucide-react";
import { STAFF_STARTERS, askStaffBot, mountStaffBot } from "../botpress";

const TOPICS = [
  { icon: RefreshCcw, label: "Đổi máy / đổi model", q: STAFF_STARTERS[0] },
  { icon: LifeBuoy, label: "Máy khách bị lỗi", q: STAFF_STARTERS[1] },
  { icon: Headset, label: "Khách khiếu nại", q: STAFF_STARTERS[2] },
  { icon: Undo2, label: "Trả hàng, hoàn tiền", q: STAFF_STARTERS[3] },
  { icon: ClipboardList, label: "Quy trình bán hàng", q: "Quy trình bán hàng chuẩn tại cửa hàng gồm những bước nào?" },
  { icon: Sparkles, label: "Tư vấn nhanh cho khách", q: "Khách có 10 triệu, cần chụp ảnh đẹp thì tôi nên giới thiệu máy nào?" },
];

export default function StaffPage() {
  const box = useRef(null);
  const [state, setState] = useState("loading"); // loading | ready | error

  // Trang nội bộ: không cho công cụ tìm kiếm lập chỉ mục
  useEffect(() => {
    const prev = document.title;
    document.title = "Trợ lý nội bộ — TGDĐ AI Advisor";
    const meta = Object.assign(document.createElement("meta"), { name: "robots", content: "noindex,nofollow" });
    document.head.appendChild(meta);
    return () => { document.title = prev; meta.remove(); };
  }, []);

  // Gắn khung chat nhân viên (cùng bot Botpress, lịch sử riêng)
  useEffect(() => {
    let cancelled = false;
    let ctrl = null;
    mountStaffBot(box.current)
      .then((c) => {
        if (cancelled) c.destroy();
        else { ctrl = c; setState("ready"); }
      })
      .catch((e) => { console.error("[Botpress staff]", e); if (!cancelled) setState("error"); });
    return () => { cancelled = true; ctrl?.destroy(); };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="bg-ink text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <span className="grid size-10 place-items-center rounded-xl bg-brand text-ink"><Smartphone size={21} strokeWidth={2.5} /></span>
          <span className="leading-tight">
            <b className="block text-[17px] font-extrabold tracking-tight">TGDĐ AI Advisor</b>
            <span className="text-[12px] text-brand">Trợ lý nội bộ · dành cho nhân viên</span>
          </span>
          <a href="#" className="ml-auto flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-sm font-semibold hover:bg-white/10">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Về trang khách hàng</span>
          </a>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[1fr_1.4fr]">
        <aside className="order-2 space-y-4 lg:order-1">
          <div className="card p-5">
            <h1 className="flex items-center gap-2.5 text-xl font-bold">
              <span className="h-6 w-1.5 rounded-full bg-brand" aria-hidden="true" />
              Hỏi đáp nghiệp vụ cho nhân viên
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Tra cứu nhanh cách xử lý tình huống tại quầy: đổi trả, bảo hành, khiếu nại, tư vấn sản phẩm. Gõ câu hỏi ở khung
              bên cạnh hoặc chọn nhanh một chủ đề bên dưới.
            </p>
          </div>

          <div className="card p-5">
            <b className="text-[15px]">Chủ đề thường hỏi</b>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {TOPICS.map(({ icon: Icon, label, q }) => (
                <button
                  key={label}
                  onClick={() => askStaffBot(q)}
                  disabled={state !== "ready"}
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-left transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand-soft hover:shadow-[var(--shadow-lift)] disabled:opacity-50"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink text-brand"><Icon size={17} /></span>
                  <span className="text-[13.5px] font-semibold leading-snug">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="px-1 text-xs leading-relaxed text-gray-500">
            Trợ lý AI có thể nhầm lẫn. Với trường hợp ngoại lệ hoặc cần quyết định (giảm phí, hoàn tiền lớn…), hãy hỏi quản lý ca.
          </p>
        </aside>

        <section className="staff-chat order-1 h-[min(780px,calc(100vh-110px))] min-h-[520px] lg:order-2">
          {state === "loading" && (
            <div className="grid h-full place-items-center rounded-3xl bg-white text-sm text-gray-500 shadow-[var(--shadow-card)]">
              Đang kết nối trợ lý…
            </div>
          )}
          {state === "error" && (
            <div className="grid h-full place-items-center rounded-3xl bg-white p-6 text-center text-sm text-red-600 shadow-[var(--shadow-card)]">
              Không kết nối được trợ lý. Kiểm tra mạng rồi tải lại trang.
            </div>
          )}
          {/* Webchat gắn vào div này; để ngoài điều kiện để ref luôn tồn tại */}
          <div ref={box} className={state === "ready" ? "h-full" : "hidden"} />
        </section>
      </main>
    </div>
  );
}
