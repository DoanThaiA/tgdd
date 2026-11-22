import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUp } from "lucide-react";
import { PRODUCTS } from "./data/products";
import { askBot, destroyBotpress, initBotpress } from "./botpress";
import Header from "./components/Header";
import Hero from "./components/Hero";
import NeedsSection from "./components/NeedsSection";
import ProductSection from "./components/ProductSection";
import ProductModal from "./components/ProductModal";
import CompareBar from "./components/CompareBar";
import Footer from "./components/Footer";
import ChatNudge from "./components/ChatNudge";
import StaffPage from "./components/StaffPage";

// Định tuyến đơn giản theo hash: "#/nhan-vien" = trang trợ lý nội bộ, còn lại = trang khách hàng
const isStaffHash = () => window.location.hash.startsWith("#/nhan-vien");

export default function App() {
  const products = PRODUCTS; // đọc từ CSV lúc build
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("Tất cả");
  const [selected, setSelected] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showTop, setShowTop] = useState(false);
  const [isStaff, setIsStaff] = useState(isStaffHash);

  useEffect(() => {
    const onHash = () => {
      const staff = isStaffHash();
      setIsStaff((prev) => {
        if (prev !== staff) window.scrollTo(0, 0); // đổi trang: về đầu; neo #products… thì giữ nguyên
        return staff;
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Trang khách: bong bóng chat. Trang nhân viên: gỡ bong bóng, khung chat nhúng do StaffPage tự gắn.
  useEffect(() => {
    if (isStaff) destroyBotpress();
    else initBotpress();
  }, [isStaff]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const askAI = useCallback((text) => askBot(text || ""), []);
  const pickBrand = useCallback((b) => {
    setBrand(b);
    document.getElementById("products")?.scrollIntoView();
  }, []);
  const toggleCompare = useCallback((id) => {
    setCompareIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= 3 ? ids : [...ids, id]));
  }, []);

  if (isStaff) return <StaffPage />;

  return (
    <div className="min-h-screen">
      <Header
        products={products}
        keyword={keyword}
        onKeyword={setKeyword}
        onOpenProduct={setSelected}
        onAskAI={askAI}
        onBrand={pickBrand}
      />
      <main>
        <Hero products={products} onAsk={askAI} onOpenProduct={setSelected} />
        <NeedsSection onAsk={askAI} />
        <ProductSection
          products={products}
          keyword={keyword}
          onClearKeyword={() => setKeyword("")}
          brand={brand}
          onBrand={setBrand}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
          onOpen={setSelected}
        />
      </main>
      <Footer products={products} onAsk={askAI} />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Lên đầu trang"
          className={`animate-fade fixed left-5 z-30 grid size-11 place-items-center rounded-full bg-white shadow-[var(--shadow-lift)] hover:bg-gray-50 ${compareIds.length ? "bottom-28" : "bottom-5"}`}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {selected && (
        <ProductModal
          product={selected}
          inCompare={compareIds.includes(selected.id)}
          onToggleCompare={() => toggleCompare(selected.id)}
          onClose={() => setSelected(null)}
          onAsk={(q) => {
            setSelected(null);
            askAI(q);
          }}
        />
      )}
      {!compareIds.length && <ChatNudge onOpen={() => askAI("")} />}
      <CompareBar
        items={compareIds.map((id) => byId[id]).filter(Boolean)}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onAsk={askAI}
      />
    </div>
  );
}
