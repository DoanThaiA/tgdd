import { useEffect, useState } from "react";
import { X } from "lucide-react";

const KEY = "chat_nudge_dismissed";

/** Nhãn gợi ý cạnh nút bong bóng Botpress; ẩn khi chat đang mở hoặc khi người dùng tắt. */
export default function ChatNudge({ onOpen }) {
  const [show, setShow] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(KEY) === "1"; } catch { /* bỏ qua */ }
    if (dismissed) return;
    const t = setTimeout(() => setShow(true), 2500);

    // Theo dõi trạng thái mở/đóng của webchat qua class "vdk-edge-open"
    let mo;
    const watch = setInterval(() => {
      const root = document.querySelector(".vdk-edge");
      if (!root) return;
      clearInterval(watch);
      const sync = () => {
        const open = root.classList.contains("vdk-edge-open");
        setChatOpen(open);
        if (open) dismiss();
      };
      mo = new MutationObserver(sync);
      mo.observe(root, { attributes: true, attributeFilter: ["class"] });
      sync();
    }, 300);
    return () => { clearTimeout(t); clearInterval(watch); mo?.disconnect(); };
  }, []);

  function dismiss() {
    setShow(false);
    try { sessionStorage.setItem(KEY, "1"); } catch { /* bỏ qua */ }
  }

  if (!show || chatOpen) return null;
  return (
    <div className="animate-pop fixed bottom-[30px] right-[106px] z-40 hidden items-center sm:flex gap-1 rounded-2xl bg-white py-2 pl-3.5 pr-1.5 shadow-[var(--shadow-lift)] ring-1 ring-black/5">
      <button onClick={onOpen} className="text-left text-[13px] leading-tight">
        <b className="block">Cần tư vấn chọn máy? 👋</b>
        <span className="text-gray-500">Hỏi trợ lý AI — gửi được cả ảnh</span>
      </button>
      <button onClick={dismiss} aria-label="Ẩn gợi ý" className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-ink">
        <X size={14} />
      </button>
      <span className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 bg-white" />
    </div>
  );
}
