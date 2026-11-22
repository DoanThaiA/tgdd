import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, LockKeyhole, Search, Smartphone, Sparkles, X } from "lucide-react";
import { thumb, vnd } from "../lib";

const NAV = [
  { label: "Điện thoại", href: "#products" },
  { label: "Gợi ý theo nhu cầu", href: "#needs" },
];

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

export default function Header({ products, keyword, onKeyword, onOpenProduct, onAskAI, onBrand }) {
  const [focus, setFocus] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const close = (e) => box.current && !box.current.contains(e.target) && setFocus(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const hits = useMemo(() => {
    const kw = norm(keyword.trim());
    if (!kw) return [];
    const words = kw.split(/\s+/);
    return products.filter((p) => words.every((w) => norm(p.name).includes(w))).slice(0, 6);
  }, [products, keyword]);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].slice(0, 10), [products]);
  const goProducts = () => {
    setFocus(false);
    document.getElementById("products")?.scrollIntoView();
  };

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-ink px-4 py-1.5 text-center text-[12px] text-gray-300">
        <span className="font-semibold text-brand">Website demo đồ án</span> — Hệ thống AI tư vấn điện thoại. Không phải
        website chính thức của Thế Giới Di Động / MWG.
      </div>
      <div className="bg-brand shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <a href="#" className="flex shrink-0 items-center gap-2" aria-label="Trang chủ">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-brand shadow-sm">
              <Smartphone size={21} strokeWidth={2.5} />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-[18px] font-extrabold tracking-tight">TGDĐ</span>
              <span className="-mt-0.5 flex items-center gap-1 text-[11px] font-semibold">
                <Sparkles size={11} /> AI Advisor
              </span>
            </span>
          </a>

          <div ref={box} className="relative mx-1 flex-1 md:mx-3">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={keyword}
              onChange={(e) => onKeyword(e.target.value)}
              onFocus={() => setFocus(true)}
              onKeyDown={(e) => e.key === "Enter" && goProducts()}
              placeholder="Bạn tìm gì hôm nay? (iPhone 17, Galaxy A57, Redmi Note...)"
              className="h-10 w-full rounded-full bg-white pl-10 pr-9 text-sm shadow-inner outline-none ring-ink/20 focus:ring-2"
            />
            {keyword && (
              <button onClick={() => onKeyword("")} aria-label="Xoá" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink">
                <X size={16} />
              </button>
            )}
            {focus && keyword.trim() && (
              <div className="animate-fade absolute inset-x-0 top-12 overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-lift)]">
                {hits.length ? (
                  <>
                    <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Sản phẩm gợi ý</p>
                    {hits.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setFocus(false);
                          onOpenProduct(p);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-50"
                      >
                        <img src={thumb(p.image_url, 100)} alt="" className="size-10 object-contain" />
                        <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                        <span className="text-sm font-bold text-sale">{vnd(p.price)}</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <p className="px-4 pt-3 text-sm text-gray-500">Không tìm thấy máy khớp “{keyword}”.</p>
                )}
                <button
                  onClick={() => {
                    setFocus(false);
                    onAskAI(`${keyword}`);
                  }}
                  className="mt-1 flex w-full items-center gap-2 border-t border-gray-100 px-4 py-3 text-left text-sm font-medium text-link hover:bg-blue-50"
                >
                  <Bot size={16} /> Hỏi trợ lý AI về “{keyword}”
                </button>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a href="#/nhan-vien" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold hover:bg-black/5" title="Trợ lý nội bộ dành cho nhân viên">
              <LockKeyhole size={16} /> <span className="hidden md:inline">Nhân viên</span>
            </a>
            <button onClick={() => onAskAI("")} className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white hover:bg-black">
              <Bot size={18} /> <span className="hidden sm:inline">Hỏi trợ lý AI</span>
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 pb-2 text-[13.5px] font-medium no-scrollbar">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} className="shrink-0 rounded-lg px-2.5 py-1 hover:bg-black/5">
              {n.label}
            </a>
          ))}
          <span className="mx-1 hidden h-4 w-px bg-black/15 md:block" />
          {brands.map((b) => (
            <button key={b} onClick={() => onBrand(b)} className="hidden shrink-0 rounded-lg px-2 py-1 text-black/70 hover:bg-black/5 hover:text-black md:block">
              {b}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
