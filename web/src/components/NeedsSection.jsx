import { BatteryFull, Camera, Feather, Gamepad2, GraduationCap, HeartHandshake, Layers, SmilePlus, Sparkles } from "lucide-react";

const NEEDS = [
  { icon: Camera, label: "Chụp ảnh đẹp", q: "Tôi có khoảng 15 triệu, cần điện thoại chụp ảnh đẹp nhất", tone: "from-pink-500 to-rose-500" },
  { icon: Gamepad2, label: "Chơi game mượt", q: "Tầm 10 triệu, cần máy chơi game mượt, tần số quét cao", tone: "from-violet-500 to-indigo-500" },
  { icon: BatteryFull, label: "Pin trâu 2 ngày", q: "Điện thoại pin trâu nhất dưới 8 triệu", tone: "from-emerald-500 to-teal-500" },
  { icon: GraduationCap, label: "Học sinh – sinh viên", q: "Khoảng 6 triệu cho sinh viên, pin tốt, học online, chơi game nhẹ", tone: "from-sky-500 to-blue-500" },
  { icon: HeartHandshake, label: "Cho bố mẹ", q: "Điện thoại cho người lớn tuổi khoảng 5 triệu, màn hình lớn, pin lâu", tone: "from-amber-500 to-orange-500" },
  { icon: Feather, label: "Nhỏ gọn, nhẹ", q: "Điện thoại nhỏ gọn, nhẹ, dễ cầm một tay", tone: "from-cyan-500 to-sky-500" },
  { icon: Layers, label: "Màn hình gập", q: "Có những máy gập nào?", tone: "from-fuchsia-500 to-purple-500" },
  { icon: SmilePlus, label: "Selfie, livestream", q: "Khoảng 10 triệu cần máy selfie đẹp để livestream", tone: "from-lime-500 to-green-500" },
];

export default function NeedsSection({ onAsk }) {
  return (
    <section id="needs" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-6">
      <div className="card p-4 md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold md:text-2xl">
              <Sparkles className="text-amber-500" size={22} /> Chọn máy theo nhu cầu
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">Bấm một nhu cầu — trợ lý AI (Botpress) gợi ý máy phù hợp</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {NEEDS.map(({ icon: Icon, label, q, tone }) => (
            <button
              key={label}
              onClick={() => onAsk(q)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 p-3 text-center transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-sm transition group-hover:scale-105 ${tone}`}>
                <Icon size={22} />
              </span>
              <span className="text-[13px] font-semibold leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
