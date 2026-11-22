// Dữ liệu hiển thị: đọc trực tiếp file CSV (đóng gói sẵn khi build, không cần backend/DB).
// Muốn cập nhật sản phẩm: thay file dien_thoai_tgdd_200.csv (giữ nguyên tên cột) rồi build lại.
import csvText from "./dien_thoai_tgdd_200.csv?raw";

/** Parser CSV chuẩn RFC 4180: hỗ trợ ô có dấu phẩy, xuống dòng và "" trong ngoặc kép. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim()));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const num = (v) => {
  const n = Number(String(v).replace(",", "."));
  return v !== "" && Number.isFinite(n) ? n : null;
};
const firstNum = (text, re) => {
  const m = text && text.match(re);
  return m ? Number(m[1].replace(",", ".")) : null;
};

function toProduct(r) {
  const screen = r.screen || "";
  // Pin: "6100 mAh" | "34 giờ" (iPhone, giờ xem video) | "6500" (thiếu đơn vị -> mAh)
  const battery = /^\d{3,5}$/.test(r.battery || "") ? `${r.battery} mAh` : r.battery || "";
  const ip = [...(r.water_resistance || "").matchAll(/IP(\d{2})/g)].map((m) => Number(m[1]));
  return {
    id: Number(r.product_id),
    name: r.product_name,
    brand: r.brand,
    price: num(r.price_vnd) ?? 0,
    os: r.os || "—",
    is_ios: /ios/i.test(r.os),
    chipset: r.chip || "—",
    ram: num(r.ram_gb),
    storage: num(r.storage_gb),
    screen,
    screen_inch: firstNum(screen, /(\d+(?:\.\d+)?)\s*"/),
    screen_tech: (screen.split('"')[1] || "").replace(/\d+\s*Hz/i, "").trim(),
    refresh_rate: firstNum(screen, /(\d+)\s*Hz/i),
    rear_camera: r.rear_camera || "—",
    camera_main_mp: firstNum(r.rear_camera, /(\d+)\s*MP/i),
    front_camera: r.front_camera || "—",
    front_camera_mp: firstNum(r.front_camera, /(\d+)\s*MP/i),
    battery_text: battery || "Chưa công bố",
    battery_mah: firstNum(battery, /(\d{3,5})\s*mAh/i),
    charging_w: num(r.max_charge_w),
    network: r.network || "—",
    has_5g: /5G/i.test(r.network),
    water_resistance: r.water_resistance || "—",
    ip_rating: ip.length ? Math.max(...ip) : null,
    image_url: r.image_url,
  };
}

export const PRODUCTS = parseCsv(csvText).map(toProduct).filter((p) => p.id && p.name);
