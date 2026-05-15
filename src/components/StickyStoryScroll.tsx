import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowArt from "./FlowArt";
import FlowSection from "./FlowSection";

import seedling from "@/assets/seedling.jpg";
import heroFarm from "@/assets/hero-farm.jpg";
import harvest from "@/assets/coffee-harvest.jpg";
import drying from "@/assets/coffee-drying.jpg";
import farmerPortrait from "@/assets/farmer-portrait.jpg";
import productPkg from "@/assets/product-proud-vietnam.jpg";

gsap.registerPlugin(ScrollTrigger);

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
    desc: "Hái chín chọn lọc thủ công - chỉ những quả đạt độ chín trên 95% mới được thu. Mỗi mẻ được cân và ghi nhận trực tiếp tại rẫy.",
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
    desc: "Quét mã QR trên bao bì để xem toàn bộ hành trình - từ giống, người trồng, ngày thu hoạch đến lô vận chuyển.",
    image: productPkg,
    location: "Mỗi sản phẩm, một câu chuyện",
    meta: "QR · Blockchain ready",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const uiFadeVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const StickyStoryScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Sync the active index with ScrollTrigger for the UI overlay
    chapters.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: `#chapter-${i}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setActiveIndex(i);
        },
      });
    });

    // Ensure layout is correct after images load
    const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#0A2319]">
      {/* 1. Header Section - No Pinning */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="max-w-xl"
        >
          <p className="font-mono-accent text-[#E8B647] text-[11px] md:text-xs mb-4">
            Hành trình minh bạch
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-white mb-6">
            Từ rẫy đến<br />bàn ăn
          </h2>
          <p className="text-white/70 text-base md:text-xl leading-relaxed text-left max-w-lg">
            Mỗi sản phẩm Daklink mang theo một hành trình - từ hạt giống, qua bàn tay người nông dân, đến tách cà phê trên bàn bạn.
          </p>
        </motion.div>
      </div>

      {/* 2. Stacking Content Area */}
      <div className="relative">
        {/* Sticky UI Overlay - Persistent over all chapters */}
        <div className="sticky top-0 left-0 w-full h-screen z-50 pointer-events-none flex flex-col justify-between overflow-hidden">
          {/* Top Progress & Counter */}
          <div className="w-full">
            <div className="h-[4px] bg-white/10 w-full">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E8B647] via-[#BC6C25] to-[#E8B647]"
                animate={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }}
                transition={{ duration: 0.4, ease }}
              />
            </div>
            
            <div className="mt-8 ml-6 md:ml-12 inline-flex items-center gap-3 bg-[#0A2319]/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-2xl pointer-events-auto">
              <div className="font-mono text-[10px] tracking-[0.3em] text-white/90 uppercase">
                Chương
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  variants={uiFadeVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
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

          {/* Bottom Dots */}
          <div className="mb-14 md:mb-16 ml-6 md:ml-12 flex items-center gap-2 pointer-events-auto">
            {chapters.map((_, i) => (
              <div
                key={i}
                className={`h-[4px] rounded-full transition-all duration-500 ${
                  i === activeIndex
                    ? "w-8 bg-[#E8B647]"
                    : i < activeIndex
                    ? "w-2 bg-[#E8B647]/40"
                    : "w-2 bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Chapters - FlowArt/FlowSection automatically handles pinning/rotation */}
        <div className="mt-[-100vh]">
          <FlowArt>
            {chapters.map((chapter, i) => (
              <div key={i} id={`chapter-${i}`}>
                <FlowSection id={`journey-${i}`} bg="#0A2319" isFirst={i === 0}>
                  <div className="relative w-full h-full flex flex-col justify-end p-6 md:p-12">
                    {/* Image Layer */}
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2319] via-[#0A2319]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A2319]/90 via-[#0A2319]/10 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 max-w-4xl pb-12 md:pb-16">
                      <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-[#E8B647] animate-pulse" />
                        <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/90 font-semibold">
                          {chapter.meta}
                        </span>
                      </div>

                      <h3 className="font-display text-4xl md:text-8xl font-bold tracking-tighter text-white mb-6 leading-[0.95]">
                        {chapter.title}
                      </h3>

                      <p className="text-white/80 text-base md:text-2xl leading-relaxed max-w-2xl mb-8 font-light">
                        {chapter.desc}
                      </p>

                      <div className="flex items-center gap-2.5 text-white/50 text-xs md:text-base">
                        <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                          <circle cx="12" cy="9" r="2" />
                        </svg>
                        <span className="tracking-wide font-medium">{chapter.location}</span>
                      </div>
                    </div>
                  </div>
                </FlowSection>
              </div>
            ))}
          </FlowArt>
        </div>
      </div>
    </div>
  );
};

export default StickyStoryScroll;
