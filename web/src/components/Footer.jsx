import { Bot, Smartphone } from "lucide-react";

export default function Footer({ products, onAsk }) {
  const brands = [...new Set(products.map((p) => p.brand))];
  return (
    <footer className="mt-10 bg-white pb-28">
      <div className="h-1 bg-gradient-to-r from-brand via-amber-400 to-orange-400" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
        <div>
          <span className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-ink text-brand"><Smartphone size={19} /></span>
            <b className="text-base">TGDĐ AI Advisor</b>
          </span>
          <p className="mt-3 leading-relaxed text-gray-500">
            Đồ án: Hệ thống AI hỗ trợ tư vấn và đề xuất điện thoại thông minh theo nhu cầu khách hàng tại Công ty Cổ phần
            Đầu tư Thế Giới Di Động (MWG).
          </p>
          <button onClick={() => onAsk("")} className="mt-4 flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white hover:bg-black">
            <Bot size={16} /> Trò chuyện với trợ lý AI
          </button>
        </div>
        <div>
          <b>Thương hiệu</b>
          <p className="mt-3 leading-relaxed text-gray-500">{brands.join(" · ")}</p>
        </div>
        <div>
          <b>Công nghệ & dữ liệu</b>
          <p className="mt-3 text-gray-500">React · Tailwind CSS · Chatbot Botpress</p>
          <p className="mt-3 leading-relaxed text-gray-500">
            {products.length} sản phẩm hiển thị từ file dữ liệu <code>dien_thoai_tgdd_200.csv</code> (tên, giá, thông số,
            ảnh theo thegioididong.com). Câu trả lời của trợ lý AI do bot Botpress cung cấp.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © 2026 Đồ án môn học · Website demo, không phải website chính thức của Thế Giới Di Động / MWG. ·{" "}
        <a href="#/nhan-vien" className="underline hover:text-ink">Dành cho nhân viên</a>
      </div>
    </footer>
  );
}
