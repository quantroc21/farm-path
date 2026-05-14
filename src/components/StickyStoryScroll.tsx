import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Sprout, Leaf, Wheat, Coffee, BookOpen, QrCode, type LucideIcon } from "lucide-react";
import seedling from "@/assets/seedling.jpg";
import cultivation from "@/assets/tabs/tab_cultivation_protocol_1773716426810.png";
import harvest from "@/assets/coffee-harvest.jpg";
import drying from "@/assets/coffee-drying.jpg";
import diary from "@/assets/tabs/tab_digital_diary_1773716443710.png";
import trace from "@/assets/tabs/tab_traceability_verification_1773716537899.png";

type Chapter = {
  id: string;
  step: string;
  title: string;
  desc: string;
  image: string;
  icon: LucideIcon;
  meta: string;
};

const chapters: Chapter[] = [
  {
    id: "gieo-hat",
    step: "01",
    title: "Gieo hạt",
    desc: "Hạt giống được tuyển chọn từ những vườn ươm đạt chuẩn VietGAP. Mỗi lô đều được gắn ID truy xuất ngay từ ngày đầu tiên xuống đất.",
    image: seedling,
    icon: Sprout,
    meta: "Vườn ươm M'Drak · Đắk Lắk",
  },
  {
    id: "cham-soc",
    step: "02",
    title: "Chăm sóc",
    desc: "Quy trình canh tác bền vững theo tiêu chuẩn VietGAP. Tưới tiêu, bón phân hữu cơ và phòng trừ sâu bệnh được lên lịch dựa trên dữ liệu cảm biến IoT.",
    image: cultivation,
    icon: Leaf,
    meta: "VietGAP · Hữu cơ chuyển đổi",
  },
  {
    id: "thu-hoach",
    step: "03",
    title: "Thu hoạch",
    desc: "Hái chín chọn lọc thủ công – chỉ những quả đạt độ chín >95% Brix mới được thu. Mỗi mẻ được cân và ghi nhận trực tiếp tại rẫy.",
    image: harvest,
    icon: Wheat,
    meta: "Vụ mùa 2026 · 1.247 kg cherry",
  },
  {
    id: "so-che",
    step: "04",
    title: "Sơ chế",
    desc: "Phương pháp natural & honey process trên giàn phơi cao. Nhiệt độ và độ ẩm được giám sát liên tục để giữ trọn hương vị bản địa.",
    image: drying,
    icon: Coffee,
    meta: "Natural process · 18 ngày phơi",
  },
  {
    id: "nhat-ky-so",
    step: "05",
    title: "Nhật ký số",
    desc: "Mọi hoạt động canh tác được nông dân ghi nhận qua app di động. Dữ liệu lưu trữ bất biến, tạo nên bằng chứng số cho từng lô hàng.",
    image: diary,
    icon: BookOpen,
    meta: "Daklink Farmer App · 168 nhật ký",
  },
  {
    id: "truy-xuat",
    step: "06",
    title: "Truy xuất QR",
    desc: "Khách hàng quét mã QR trên bao bì để xem toàn bộ hành trình – từ giống, người nông dân, ngày thu hoạch đến lô vận chuyển.",
    image: trace,
    icon: QrCode,
    meta: "Mỗi sản phẩm · Một câu chuyện",
  },
];

const StickyStoryScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="bg-[#0a2319] text-white">
      {/* Section intro */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-12 md:pt-32 md:pb-20">
        <p className="text-[#BC6C25] text-xs font-semibold uppercase tracking-[0.3em] mb-4">
          HỆ SINH THÁI · TRUY XUẤT NGUỒN GỐC
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.05] tracking-tight max-w-3xl">
          Hành trình từ rẫy <br className="hidden md:block" />
          <span className="text-white/60">đến tay bạn</span>
        </h2>
        <p className="text-white/60 text-base md:text-lg mt-6 max-w-xl leading-relaxed">
          Sáu mắt xích minh bạch. Mỗi bước được số hoá, đóng dấu thời gian, và sẵn sàng kiểm chứng.
        </p>
      </div>

      {/* Sticky scroll */}
      <div ref={containerRef} className="relative" style={{ height: `${chapters.length * 90}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left: text chapters stacked */}
            <div className="relative h-[60vh] md:h-[70vh]">
              {chapters.map((ch, i) => (
                <ChapterText
                  key={ch.id}
                  chapter={ch}
                  index={i}
                  total={chapters.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            {/* Right: image stack */}
            <div className="relative h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {chapters.map((ch, i) => (
                <ChapterImage
                  key={ch.id}
                  chapter={ch}
                  index={i}
                  total={chapters.length}
                  progress={scrollYProgress}
                />
              ))}

              {/* Step counter overlay */}
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <StepIndicator progress={scrollYProgress} total={chapters.length} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ChapterText = ({
  chapter,
  index,
  total,
  progress,
}: {
  chapter: Chapter;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const segment = 1 / total;
  const start = index * segment;
  const peak = start + segment * 0.5;
  const end = start + segment;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - segment * 0.15), peak - segment * 0.05, peak + segment * 0.05, Math.min(1, end + segment * 0.15)],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], [40, -40]);

  const Icon = chapter.icon;

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[#BC6C25] text-sm font-bold tracking-[0.25em]">{chapter.step}</span>
        <span className="h-px w-10 bg-[#BC6C25]/40" />
        <span className="text-white/50 text-xs uppercase tracking-[0.2em]">{chapter.meta}</span>
      </div>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#BC6C25]" />
        </div>
        <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">{chapter.title}</h3>
      </div>
      <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md">
        {chapter.desc}
      </p>
    </motion.div>
  );
};

const ChapterImage = ({
  chapter,
  index,
  total,
  progress,
}: {
  chapter: Chapter;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const segment = 1 / total;
  const start = index * segment;
  const peak = start + segment * 0.5;
  const end = start + segment;

  const opacity = useTransform(
    progress,
    [Math.max(0, start - segment * 0.1), peak - segment * 0.05, peak + segment * 0.05, Math.min(1, end + segment * 0.1)],
    [0, 1, 1, 0]
  );
  const scale = useTransform(progress, [start, end], [1.08, 1.18]);

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.img
        src={chapter.image}
        alt={chapter.title}
        style={{ scale }}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a2319]/70 via-transparent to-transparent" />
    </motion.div>
  );
};

const StepIndicator = ({ progress, total }: { progress: MotionValue<number>; total: number }) => {
  const current = useTransform(progress, (p) => {
    const idx = Math.min(total - 1, Math.floor(p * total));
    return `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  });
  return (
    <>
      <motion.span className="text-xs font-bold text-white tracking-[0.2em]">{current}</motion.span>
      <span className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Chapters</span>
    </>
  );
};

export default StickyStoryScroll;
