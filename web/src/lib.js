// Tiện ích định dạng dùng chung
export const vnd = (n) => `${Number(n || 0).toLocaleString("vi-VN")}₫`;

// Ảnh nhỏ qua dịch vụ resize của CDN TGDĐ để tải nhanh hơn (webp)
export const thumb = (url, size = 300) =>
  url && url.startsWith("https://cdn") ? `https://img.tgdd.vn/imgt/ecom/f_webp,fit_outside,quality_100,s_${size}x${size}/${url}` : url;

// "Samsung Galaxy A57 5G 12GB/256GB Xám" -> "Samsung Galaxy A57 5G"
export const modelName = (name = "") => {
  const m = name.match(/\b\d+\s*GB\s*\/\s*\d+\s*(GB|TB)\b|\b\d+\s*(GB|TB)\b/i);
  return m ? name.slice(0, m.index).trim() : name;
};

export const storageText = (gb) => (gb == null ? "—" : gb >= 1024 ? `${gb / 1024}TB` : `${gb}GB`);
export const orDash = (v, unit = "") => (v == null || v === "" ? "—" : `${v}${unit}`);
