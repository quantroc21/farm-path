import { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
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
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      // v goes from 0 to 1 over the container's height
      // Because the last chapter sticks at the end, we adjust the calculation slightly.
      const idx = Math.min(
        chapters.length - 1,
        Math.floor(v * chapters.length)
      );
      setActiveIndex(Math.max(0, idx));
    });
  }, [scrollYProgress]);

  return (
    <section className="bg-[#0A2319] text-white relative overflow-x-clip">
      {/* Section header */}
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

      {/* CSS Stacking Cards Experience */}
      <div ref={containerRef} className="relative w-full">
        {/* GLOBAL UI OVERLAY - Stays fixed over everything */}
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="sticky top-0 h-screen w-full flex flex-col justify-between">
            <div>
              {/* Top progress bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#E8B647] via-[#BC6C25] to-[#E8B647]" 
                  style={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Chapter counter — top */}
              <div className="absolute top-6 left-5 md:left-12 flex items-center gap-3 bg-[#0A2319]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
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

            {/* Bottom step dots */}
            <div className="relative z-50 px-5 md:px-12 pb-[110px] md:pb-[140px]">
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
        </div>

        {chapters.map((c, i) => (
          <div key={c.step} className="sticky top-0 h-screen w-full flex flex-col justify-end overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            
            {/* Background Image with subtle entrance animation */}
            <motion.img
              src={c.image}
              alt={c.title}
              className="absolute inset-0 w-full h-full object-cover origin-center -z-10"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ amount: 0.1 }}
              transition={{ duration: 3, ease: "easeOut" }}
            />
            
            {/* Cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2319] via-[#0A2319]/40 to-transparent -z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2319]/70 via-[#0A2319]/20 to-transparent -z-10" />

            {/* Foreground content */}
            <div className="relative z-20 px-5 md:px-12 pb-16 md:pb-24 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ amount: 0.4 }}
                transition={{ duration: 0.6, ease }}
              >
                {/* Meta tag */}
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8B647] animate-pulse" />
                  <span className="text-[10px] md:text-xs tracking-[0.18em] uppercase text-white/85 font-medium">
                    {c.meta}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[2.5rem] leading-[1.05] md:text-7xl font-bold tracking-tight text-white mb-5">
                  {c.title}
                </h3>

                {/* Description */}
                <p className="text-white/85 text-[15px] md:text-xl leading-[1.65] max-w-xl mb-5">
                  {c.desc}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-white/60 text-xs md:text-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span className="tracking-wide">{c.location}</span>
                </div>
              </motion.div>
            </div>

            {/* Scroll hint — only on first chapter */}
            {i === 0 && (
              <div className="absolute bottom-5 right-5 md:right-12 z-30 flex items-center gap-2 text-white/50 text-[10px] tracking-[0.25em] uppercase">
                <span>Cuộn</span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  ↓
                </motion.span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StickyStoryScroll;
