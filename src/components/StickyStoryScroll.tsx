import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import seedling from "@/assets/seedling.jpg";
import heroFarm from "@/assets/hero-farm.jpg";
import harvest from "@/assets/coffee-harvest.jpg";
import drying from "@/assets/coffee-drying.jpg";
import farmerPortrait from "@/assets/farmer-portrait.jpg";
import productPkg from "@/assets/product-proud-vietnam.jpg";

type Chapter = {
  step: string;
  title: string;
  desc: string;
  image: string;
  location: string;
  meta: string;
};

const chapters: Chapter[] = [
  {
    step: "01",
    title: "Gieo hạt",
    desc: "Hạt giống được tuyển chọn từ những vườn ươm đạt chuẩn VietGAP. Mỗi lô đều được gắn mã truy xuất ngay từ ngày đầu tiên xuống đất.",
    image: seedling,
    location: "Vườn ươm M'Drak, Đắk Lắk",
    meta: "15.01.2026",
  },
  {
    step: "02",
    title: "Chăm sóc",
    desc: "Quy trình canh tác bền vững theo tiêu chuẩn VietGAP. Tưới tiêu, bón phân hữu cơ và phòng trừ sâu bệnh được theo dõi qua dữ liệu cảm biến.",
    image: heroFarm,
    location: "VietGAP · Hữu cơ chuyển đổi",
    meta: "180 ngày chăm sóc",
  },
  {
    step: "03",
    title: "Thu hoạch",
    desc: "Hái chín chọn lọc thủ công — chỉ những quả đạt độ chín trên 95% mới được thu. Mỗi mẻ được cân và ghi nhận trực tiếp tại rẫy.",
    image: harvest,
    location: "Vụ mùa 2026",
    meta: "1.247 kg cherry",
  },
  {
    step: "04",
    title: "Sơ chế",
    desc: "Phương pháp natural và honey process trên giàn phơi cao. Nhiệt độ và độ ẩm được giám sát liên tục để giữ trọn hương vị.",
    image: drying,
    location: "Natural process",
    meta: "18 ngày phơi nắng",
  },
  {
    step: "05",
    title: "Nhật ký số",
    desc: "Mọi hoạt động canh tác được nông dân ghi nhận qua ứng dụng di động. Dữ liệu lưu trữ minh bạch, tạo nên bằng chứng số cho từng lô hàng.",
    image: farmerPortrait,
    location: "Daklink Farmer App",
    meta: "168 nhật ký số",
  },
  {
    step: "06",
    title: "Truy xuất",
    desc: "Quét mã QR trên bao bì để xem toàn bộ hành trình — từ giống, người trồng, ngày thu hoạch đến lô vận chuyển.",
    image: productPkg,
    location: "Mỗi sản phẩm, một câu chuyện",
    meta: "QR · Blockchain ready",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const ChapterCard = ({ c, index, progress }: { c: Chapter, index: number, progress: any }) => {
  const sectionSize = 1 / chapters.length;
  const start = index * sectionSize;
  const end = start + sectionSize;

  const rotateX = useTransform(progress, [start, end], [0, 80]);
  const opacity = useTransform(progress, [start, end - 0.05], [1, 0]);
  const scale = useTransform(progress, [start, end], [1, 0.8]);
  const y = useTransform(progress, [start, end], ["0%", "-50%"]);

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
        rotateX,
        transformOrigin: "top center",
        zIndex: chapters.length - index,
      }}
      className="absolute inset-0 w-full h-full flex flex-col justify-end overflow-hidden will-change-transform"
    >
      <img
        src={c.image}
        alt={c.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2319] via-[#0A2319]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A2319]/80 via-[#0A2319]/20 to-transparent" />

      <div className="relative z-20 px-5 md:px-12 pb-[160px] md:pb-[180px] max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8B647] animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.18em] uppercase text-white/85 font-medium">
            {c.meta}
          </span>
        </div>

        <h3 className="text-[2.5rem] leading-[1.05] md:text-7xl font-bold tracking-tight text-white mb-5">
          {c.title}
        </h3>

        <p className="text-white/85 text-[15px] md:text-xl leading-[1.65] max-w-xl mb-5">
          {c.desc}
        </p>

        <div className="flex items-center gap-2 text-white/60 text-xs md:text-sm">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="tracking-wide">{c.location}</span>
        </div>
      </div>
    </motion.div>
  );
};

const StickyStoryScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    return smoothProgress.on("change", (v) => {
      const idx = Math.min(
        chapters.length - 1,
        Math.floor(v * chapters.length)
      );
      setActiveIndex(Math.max(0, idx));
    });
  }, [smoothProgress]);

  return (
    <section className="bg-[#0A2319] text-white relative overflow-x-clip">
      <div className="max-w-6xl mx-auto px-5 md:px-12 pt-20 md:pt-32 pb-10 md:pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="max-w-xl"
        >
          <p className="text-[#E8B647] text-[11px] md:text-xs tracking-[0.25em] mb-3 font-semibold uppercase">
            Hành trình minh bạch
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight text-white mb-4">
            Từ rẫy đến<br />bàn ăn
          </h2>
          <p className="text-white/70 text-[15px] md:text-lg leading-relaxed">
            Mỗi sản phẩm Daklink mang theo một hành trình — từ hạt giống, qua bàn tay người nông dân, đến tách cà phê trên bàn bạn.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} style={{ height: `${chapters.length * 100}vh` }} className="relative w-full">
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden [perspective:1000px]">
          
          <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between">
            <div>
              <div className="absolute top-[80px] md:top-[96px] left-0 right-0 h-[3px] bg-white/10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#E8B647] via-[#BC6C25] to-[#E8B647]" 
                  style={{ width: useTransform(smoothProgress, [0, 1], ["0%", "100%"]) }}
                />
              </div>

              <div className="absolute top-[104px] md:top-[124px] left-5 md:left-12 flex items-center gap-3 bg-[#0A2319]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                <div className="font-mono text-[10px] tracking-[0.3em] text-white/90 uppercase">
                  Chương
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className="font-mono text-sm tracking-wider text-[#E8B647] font-bold"
                  >
                    {chapters[activeIndex].step}
                  </motion.div>
                </AnimatePresence>
                <div className="font-mono text-[10px] tracking-wider text-white/50">
                  / 0{chapters.length}
                </div>
              </div>
            </div>

            <div className="px-5 md:px-12 pb-10 md:pb-12">
              <div className="flex items-center gap-1.5 max-w-3xl">
                {chapters.map((_, dotIndex) => (
                  <div
                    key={dotIndex}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      dotIndex === activeIndex
                        ? "w-7 bg-[#E8B647]"
                        : dotIndex < activeIndex
                        ? "w-1.5 bg-[#E8B647]/45"
                        : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Render Chapters in 3D Space */}
          {chapters.map((c, i) => (
            <ChapterCard key={c.step} c={c} index={i} progress={smoothProgress} />
          ))}

        </div>
      </div>
    </section>
  );
};

export default StickyStoryScroll;
