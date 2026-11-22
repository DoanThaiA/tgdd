// Tích hợp chatbot Botpress (webchat "edge" của bot đã publish).
// Tương đương đoạn embed: <link webchat.css> + <script webchat.js> + fetch(config) + VdkEdgeWebchat.mount(...)
export const BOTPRESS = {
  baseUrl: "https://vdk-viber-runtime-prod.bot.botpress.host",
  botId: "6dc8e91a-1ba3-47fb-8a38-06e9f4da463b",
};

// Câu hỏi gợi ý hiện ở màn hình chào (chỉ dùng khi bot chưa cấu hình starters trong Botpress)
const STARTERS = [
  "Tư vấn điện thoại khoảng 10 triệu chụp ảnh đẹp",
  "iPhone nào đáng mua nhất hiện nay?",
  "Máy pin trâu dưới 7 triệu",
  "So sánh Galaxy S26 Ultra và iPhone 18 Pro Max",
];

// Việt hoá chữ giao diện của webchat (thư viện chưa có sẵn tiếng Việt)
const STRINGS_VI = {
  newConversation: "Cuộc trò chuyện mới",
  back: "Quay lại",
  conversation: "Cuộc trò chuyện",
  conversations: "Lịch sử trò chuyện",
  history: "Lịch sử",
  you: "Bạn",
  noMessages: "Chưa có tin nhắn",
  noConversations: "Chưa có cuộc trò chuyện nào",
  loadFailed: "Không tải được lịch sử",
  connectFailed: "Mất kết nối — đang thử lại…",
  connecting: "Đang kết nối…",
  reconnecting: "Đang kết nối lại…",
  tryAgain: "Thử lại",
  unavailableDefault: "Trợ lý đang bận, bạn thử lại sau ít phút nhé.",
  rateLimited: "Bạn gửi hơi nhanh, đợi một chút nhé.",
  typing: "Đang trả lời…",
  copy: "Sao chép",
  attach: "Gửi kèm ảnh / tệp",
  removeAttachment: "Bỏ {name}",
  uploading: "Đang tải lên…",
  uploadFailed: "Tải lên thất bại",
  uploadRetry: "Gửi lại để thử tải lên lần nữa",
  download: "Tải tệp",
  voice: "Nói để nhập",
  stopVoice: "Dừng ghi âm",
  voiceListening: "Đang nghe…",
  today: "Hôm nay",
  yesterday: "Hôm qua",
  send: "Gửi",
  close: "Đóng",
  openChat: "Mở trợ lý AI",
  scrollToBottom: "Xuống tin mới nhất",
  more: "Thêm",
  mute: "Tắt âm",
  unmute: "Bật âm",
  stopGenerating: "Dừng trả lời",
  welcomeMessage: "Mình có thể giúp gì cho bạn?",
  disclaimerText: "Trợ lý AI có thể nhầm lẫn — vui lòng kiểm tra lại giá và thông số trước khi mua.",
};


// Câu hỏi gợi ý cho trang nhân viên (viết theo góc nhìn người xử lý nghiệp vụ)
export const STAFF_STARTERS = [
  "Khách muốn đổi sang model khác, tôi cần xử lý thế nào?",
  "Nếu khách phản ánh máy bị lỗi thì nhân viên cần làm những bước nào?",
  "Quy trình xử lý khi khách khiếu nại là gì?",
  "Khách muốn trả hàng, tôi tính phí và làm thủ tục ra sao?",
];

let loadPromise = null;
let customerPromise = null;

function loadOnce(tag, attrs) {
  const key = attrs.href || attrs.src;
  const existing = document.querySelector(`${tag}[${attrs.href ? "href" : "src"}="${key}"]`);
  if (existing) return existing.dataset.loaded ? Promise.resolve() : new Promise((r) => existing.addEventListener("load", r));
  return new Promise((resolve, reject) => {
    const el = Object.assign(document.createElement(tag), attrs);
    el.onload = () => { el.dataset.loaded = "1"; resolve(); };
    el.onerror = () => reject(new Error(`Không tải được ${key}`));
    document.head.appendChild(el);
  });
}

/** Nạp CSS + JS webchat và cấu hình bot (dùng chung cho khung khách hàng và khung nhân viên). */
function loadWebchat() {
  if (loadPromise) return loadPromise;
  const { baseUrl, botId } = BOTPRESS;
  loadPromise = (async () => {
    await Promise.all([
      loadOnce("link", { rel: "stylesheet", href: `${baseUrl}/edge/webchat.css` }),
      loadOnce("script", { src: `${baseUrl}/edge/webchat.js` }),
    ]);
    const { webchat } = await fetch(`${baseUrl}/edge/bots/${botId}/config`).then((r) => r.json());
    return webchat || {};
  })();
  loadPromise.catch((e) => {
    console.error("[Botpress]", e);
    loadPromise = null; // cho phép thử lại
  });
  return loadPromise;
}

/** Bong bóng chat cho KHÁCH HÀNG (chỉ gắn 1 lần cho đến khi destroyBotpress()). */
export function initBotpress() {
  if (customerPromise) return customerPromise;
  const { baseUrl, botId } = BOTPRESS;
  customerPromise = loadWebchat().then((webchat) =>
    window.VdkEdgeWebchat.mount({
      ...webchat,
      starters: webchat.starters?.length ? webchat.starters : STARTERS,
      placeholder: webchat.placeholder || "Hỏi về điện thoại, giá, so sánh… hoặc gửi kèm ảnh",
      // Giao diện theo màu thương hiệu (style chi tiết trong botpress-theme.css)
      color: "#ffd400",
      avatarUrl: `${window.location.origin}/bot-avatar.svg`,
      showAgentMessageBubbles: true,
      disclaimerText: "Trợ lý AI có thể nhầm lẫn — vui lòng kiểm tra lại giá và thông số trước khi mua.",
      strings: STRINGS_VI,
      mode: "bubble",
      baseUrl,
      botId,
    }),
  );
  customerPromise.catch(() => { customerPromise = null; });
  return customerPromise;
}

/** Gỡ bong bóng chat của khách (khi chuyển sang trang nhân viên). */
export async function destroyBotpress() {
  const p = customerPromise;
  customerPromise = null;
  try { (await p)?.destroy(); } catch { /* chưa gắn hoặc đã gỡ */ }
}

/**
 * Khung chat cho NHÂN VIÊN: cùng bot Botpress (cùng botId) nhưng gắn vào một phần tử trên trang (mode "embed"),
 * dùng storageKey riêng nên lịch sử hội thoại tách hoàn toàn với khung của khách, và gắn userData role=staff.
 */
export async function mountStaffBot(target) {
  const { baseUrl, botId } = BOTPRESS;
  const webchat = await loadWebchat();
  const ctrl = await window.VdkEdgeWebchat.mount({
    ...webchat,
    mode: "embed",
    target,
    storageKey: "tgdd-staff-chat",
    botName: "Trợ lý nội bộ",
    description: "Tra cứu quy trình, nghiệp vụ và chính sách dành cho nhân viên cửa hàng.",
    welcomeMessage: "Bạn cần tra cứu quy trình nào?",
    placeholder: "Hỏi về quy trình, nghiệp vụ… (VD: khách muốn đổi máy thì làm gì?)",
    starters: STAFF_STARTERS,
    color: "#1d1d1f",
    avatarUrl: `${window.location.origin}/bot-avatar.svg`,
    showAgentMessageBubbles: true,
    conversationList: false,
    disclaimerText: "Trợ lý AI có thể nhầm lẫn — với các trường hợp đặc biệt hãy hỏi quản lý ca.",
    strings: STRINGS_VI,
    baseUrl,
    botId,
  });
  // Cho bot biết người hỏi là nhân viên (bot dùng được hay không tuỳ cấu hình trong Botpress Studio)
  try { ctrl.client?.setUserData?.({ role: "staff", audience: "internal" }); } catch { /* bỏ qua */ }
  return ctrl;
}

const waitFor = async (fn, timeout = 6000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const v = fn();
    if (v) return v;
    await new Promise((r) => setTimeout(r, 80));
  }
  return null;
};

/** Điền `text` vào ô nhập của một khung webchat (gốc `.vdk-edge`) rồi gửi. */
async function sendInto(rootSelector, text) {
  const input = await waitFor(() => document.querySelector(`${rootSelector} textarea, ${rootSelector} input[type='text']`));
  if (!input) return;
  // Đặt giá trị qua setter gốc để webchat nhận sự kiện input như người dùng gõ
  const proto = input.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(input, text);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  const send = await waitFor(() => {
    const b = document.querySelector(`${rootSelector} .vdk-edge-send`);
    return b && !b.disabled ? b : null;
  }, 2000);
  if (send) send.click();
  else input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, bubbles: true }));
}

/** Mở bot của khách; nếu có `text` thì điền sẵn và gửi luôn. */
export async function askBot(text = "") {
  const ctrl = await initBotpress();
  ctrl.open();
  const q = text.trim();
  if (q) await sendInto(".vdk-edge-mode-bubble", q);
}

/** Gửi câu hỏi vào khung chat nhân viên đang hiển thị trên trang. */
export async function askStaffBot(text) {
  const q = (text || "").trim();
  if (q) await sendInto(".vdk-edge-mode-embed", q);
}
