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

const StickyStoryScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  const progressWidth = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    return smooth.on("change", (v) => {
      const idx = Math.min(
        chapters.length - 1,
        Math.floor(v * chapters.length + 0.0001)
      );
      setActiveIndex(idx);
    });
  }, [smooth]);

  return (
    <section className="bg-[#0A2319] text-white relative overflow-x-clip">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-5 md:px-12 pt-20 md:pt-32 pb-10 md:pb-16">
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

      {/* Sticky scroll experience */}
      <div
        ref={containerRef}
        style={{ height: `${chapters.length * 100}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
          {/* Top progress bar */}
          <div className="absolute top-0 left-0 right-0 z-30 h-[3px] bg-white/10">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-gradient-to-r from-[#E8B647] via-[#BC6C25] to-[#E8B647]"
            />
          </div>

          {/* Chapter counter — top */}
          <div className="absolute top-6 left-5 md:left-12 z-30 flex items-center gap-3">
            <div className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
              Chương
            </div>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeIndex}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="font-mono text-sm tracking-wider text-[#E8B647] font-semibold"
              >
                {chapters[activeIndex].step}
              </motion.div>
            </AnimatePresence>
            <div className="font-mono text-[10px] tracking-wider text-white/30">
              / 0{chapters.length}
            </div>
          </div>

          {/* Stacked images with crossfade + Ken Burns */}
          <div className="absolute inset-0">
            {chapters.map((c, i) => (
              <motion.div
                key={c.step}
                initial={false}
                animate={{
                  opacity: i === activeIndex ? 1 : 0,
                  scale: i === activeIndex ? 1.06 : 1.18,
                }}
                transition={{
                  opacity: { duration: 0.9, ease },
                  scale: { duration: 6, ease: "linear" },
                }}
                className="absolute inset-0"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {/* Cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2319] via-[#0A2319]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A2319]/70 via-transparent to-transparent" />
              </motion.div>
            ))}
          </div>

          {/* Foreground content */}
          <div className="relative z-20 flex-1 flex flex-col justify-end px-5 md:px-12 pb-16 md:pb-24 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease }}
              >
                {/* Meta tag */}
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B647] animate-pulse" />
                  <span className="text-[10px] md:text-xs tracking-[0.18em] uppercase text-white/85 font-medium">
                    {chapters[activeIndex].meta}
                  </span>
                </div>

                {/* Title — large dynamic */}
                <h3 className="text-[2.5rem] leading-[1.05] md:text-7xl font-bold tracking-tight text-white mb-5">
                  {chapters[activeIndex].title}
                </h3>

                {/* Description */}
                <p className="text-white/85 text-[15px] md:text-xl leading-[1.65] max-w-xl mb-5">
                  {chapters[activeIndex].desc}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-white/60 text-xs md:text-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span className="tracking-wide">{chapters[activeIndex].location}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step dots — mobile friendly */}
            <div className="flex items-center gap-1.5 mt-8">
              {chapters.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === activeIndex ? 28 : 6,
                    backgroundColor:
                      i === activeIndex
                        ? "rgba(232,182,71,1)"
                        : i < activeIndex
                        ? "rgba(232,182,71,0.45)"
                        : "rgba(255,255,255,0.2)",
                  }}
                  transition={{ duration: 0.4, ease }}
                  className="h-[3px] rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Scroll hint — only on first chapter */}
          <AnimatePresence>
            {activeIndex === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute bottom-5 right-5 md:right-12 z-30 flex items-center gap-2 text-white/50 text-[10px] tracking-[0.25em] uppercase"
              >
                <span>Cuộn</span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  ↓
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default StickyStoryScroll;
