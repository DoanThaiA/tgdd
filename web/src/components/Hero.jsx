import { useMemo, useState } from "react";
import { ArrowRight, Bot, ImageIcon, Layers, Smartphone, Sparkles, Tags } from "lucide-react";
import { modelName, thumb, vnd } from "../lib";

const EXAMPLES = [
  "Tôi có 12 triệu, cần chụp ảnh đẹp, pin tốt và chơi game ổn",
  "iPhone nào dưới 25 triệu?",
  "Điện thoại pin trâu nhất dưới 8 triệu",
];

// Máy trưng bày ở banner: bản rẻ nhất của từng mẫu flagship (nếu có trong CSV)
const SHOWCASE = [/galaxy s26 ultra/i, /iphone 18 pro max/i, /xiaomi 17 ultra/i];

function pickShowcase(products) {
  const picked = SHOWCASE.map((re) =>
    products.filter((p) => re.test(p.name) && p.image_url).sort((a, b) => a.price - b.price)[0],
  ).filter(Boolean);
  if (picked.length === 3) return picked;
  // Dự phòng: 3 máy đắt nhất của 3 hãng khác nhau
  const seen = new Set();
  return [...products]
    .sort((a, b) => b.price - a.price)
    .filter((p) => p.image_url && !seen.has(p.brand) && seen.add(p.brand))
    .slice(0, 3);
}

const TILT = ["-rotate-6 translate-y-6", "z-10 -translate-y-3 scale-105", "rotate-6 translate-y-6"];

export default function Hero({ products, onAsk, onOpenProduct }) {
  const [text, setText] = useState("");
  const showcase = useMemo(() => pickShowcase(products), [products]);
  const stats = useMemo(() => {
    const prices = products.map((p) => p.price).filter(Boolean);
    return {
      count: products.length,
      brands: new Set(products.map((p) => p.brand)).size,
      min: Math.min(...prices),
      max: Math.max(...prices),
      g5: products.filter((p) => p.has_5g).length,
    };
  }, [products]);

  const submit = (e) => {
    e.preventDefault();
    onAsk(text.trim() || EXAMPLES[0]);
    setText("");
  };

  const tiles = [
    { icon: Smartphone, title: `${stats.count} mẫu điện thoại`, sub: `${stats.g5} máy hỗ trợ 5G`, tone: "bg-blue-50 text-blue-600" },
    { icon: Layers, title: `${stats.brands} thương hiệu`, sub: "Apple, Samsung, Xiaomi, OPPO…", tone: "bg-emerald-50 text-emerald-600" },
    { icon: Tags, title: "Đủ mọi tầm giá", sub: `${vnd(stats.min)} – ${vnd(stats.max)}`, tone: "bg-amber-50 text-amber-600" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4">
      <div className="relative overflow-hidden rounded-3xl bg-[#141416] text-white shadow-[var(--shadow-lift)]">
        {/* nền: quầng sáng vàng + lưới chấm */}
        <div className="pointer-events-none absolute -left-24 -top-32 size-[420px] rounded-full bg-brand/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-10 size-[460px] rounded-full bg-amber-500/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />

        <div className="relative grid grid-cols-1 items-center gap-6 p-6 md:p-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles size={14} /> Trợ lý AI tư vấn điện thoại
            </span>
            <h1 className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight md:text-[46px]">
              Nói nhu cầu,
              <br />
              <span className="relative inline-block text-brand">
                AI chọn máy
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 7 C 50 2, 150 2, 198 7" stroke="#ffd400" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>{" "}
              cho bạn.
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
              Mô tả ngân sách và mong muốn (chụp ảnh, pin, chơi game…) hoặc gửi ảnh chiếc máy bạn thích — trợ lý AI gợi ý
              mẫu phù hợp kèm giá và thông số.
            </p>

            <form onSubmit={submit} className="mt-6 flex max-w-xl gap-2 rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-18px_rgba(255,212,0,.6)]">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={EXAMPLES[0]}
                aria-label="Câu hỏi cho trợ lý AI"
                className="min-w-0 flex-1 rounded-xl px-3 text-[15px] text-ink outline-none"
              />
              <button className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-brand-dark">
                Hỏi AI <ArrowRight size={16} />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((q) => (
                <button
                  key={q}
                  onClick={() => onAsk(q)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:border-brand/60 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Trưng bày 3 máy flagship từ dữ liệu */}
          <div className="relative hidden h-[330px] items-center justify-center md:flex">
            {showcase.map((p, i) => (
              <button
                key={p.id}
                onClick={() => onOpenProduct(p)}
                className={`group relative mx-1 w-[158px] shrink-0 rounded-3xl bg-white p-3 text-left text-ink shadow-2xl transition duration-300 hover:z-20 hover:-translate-y-3 hover:rotate-0 ${TILT[i]}`}
              >
                <img src={thumb(p.image_url, 300)} alt={p.name} className="aspect-square w-full object-contain transition group-hover:scale-105" />
                <p className="mt-1 line-clamp-1 text-[13px] font-semibold">{modelName(p.name)}</p>
                <p className="text-[14px] font-extrabold text-sale">{vnd(p.price)}</p>
              </button>
            ))}
            <span className="absolute bottom-0 right-2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/60 backdrop-blur">
              Bấm vào máy để xem chi tiết
            </span>
          </div>
        </div>
      </div>

      {/* Thông số nhanh + mở chat */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ icon: Icon, title, sub, tone }) => (
          <a key={title} href="#products" className="card flex items-center gap-3.5 p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
            <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon size={21} />
            </span>
            <span className="min-w-0">
              <b className="block text-[15px]">{title}</b>
              <span className="block truncate text-[13px] text-gray-500">{sub}</span>
            </span>
          </a>
        ))}
        <button
          onClick={() => onAsk("")}
          className="flex items-center gap-3.5 rounded-2xl bg-brand p-4 text-left text-ink shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-brand">
            <Bot size={21} />
          </span>
          <span>
            <b className="block text-[15px]">Trò chuyện với trợ lý AI</b>
            <span className="flex items-center gap-1 text-[13px] text-ink/70">
              Hỏi bằng chữ hoặc gửi ảnh <ImageIcon size={13} />
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}
