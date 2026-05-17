import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

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

const StickyStoryScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    chapters.forEach((_, i) => {
      // Active Index for Progress Bar
      ScrollTrigger.create({
        trigger: `#chapter-${i}`,
        start: "top 60%",
        end: "bottom 60%",
        onToggle: (self) => {
          if (self.isActive) setActiveIndex(i);
        }
      });
    });

    // Toggle global class for hiding floating buttons on mobile
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) {
          document.body.classList.add('story-mode-active');
        } else {
          document.body.classList.remove('story-mode-active');
        }
      }
    });

    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative z-40 bg-[#0A2319] isolate">
      <style>{`
        @media (max-width: 768px) {
          body.story-mode-active div[class*="fixed bottom-6 right-6"],
          body.story-mode-active button[class*="fixed right-4"] {
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.3s ease;
          }
        }
      `}</style>
      {/* Header — editorial cover for the journey */}
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-16 md:pb-24">
        {/* decorative chapter index */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          className="relative max-w-2xl"
        >
          {/* eyebrow */}
          <div className="flex items-center gap-3 mb-5 md:mb-6">
            <span className="h-px w-8 md:w-12 bg-[#E8B647]" />
            <p className="font-mono-accent text-[#E8B647] text-[10px] md:text-xs tracking-[0.3em] uppercase">
              Hành trình minh bạch
            </p>
          </div>

          {/* headline */}
          <h2 className="font-display text-[44px] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 md:mb-8">
            Từ rẫy đến<br />
            <span className="italic font-light text-[#E8B647]">bàn ăn</span>
          </h2>

          {/* lede */}
          <p className="text-white/75 text-base md:text-xl leading-relaxed max-w-lg">
            Mỗi sản phẩm Daklink mang theo một hành trình — từ hạt giống, qua bàn tay người nông dân, đến tách cà phê trên bàn bạn.
          </p>

          {/* scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease }}
            className="mt-12 md:mt-16 flex flex-col items-start gap-3 text-white/50"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase leading-none">
              Cuộn để bắt đầu
            </span>
            <div className="relative h-10 w-px bg-white/10 overflow-hidden">
              <motion.span
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-[#E8B647] to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Sticky progress bar (scoped to this section only) */}
      <div className="sticky top-[80px] md:top-[96px] z-30 w-full pointer-events-none h-0">
        <div className="h-[3px] bg-white/10 w-full pointer-events-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#E8B647] via-[#BC6C25] to-[#E8B647]"
            animate={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }}
            transition={{ duration: 0.4, ease }}
          />
        </div>
        <div className="mt-4 ml-6 md:ml-12 inline-flex items-center gap-4 bg-[#0A2319]/80 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/10 shadow-2xl pointer-events-auto">
          <span className="font-mono text-xs tracking-[0.3em] text-white/90 uppercase">Chương</span>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="font-mono text-lg tracking-widest text-[#E8B647] font-bold ml-1"
            >
              {chapters[activeIndex].step}
            </motion.div>
          </AnimatePresence>
          <span className="font-mono text-sm tracking-[0.2em] text-white/50 ml-1">/ 0{chapters.length}</span>
        </div>
      </div>

      {/* Vertical chapter stack — each chapter takes full viewport height so user reads it fully before the next */}
      <div className="relative">
        {chapters.map((chapter, i) => (
          <article
            key={i}
            id={`chapter-${i}`}
            className="sticky top-0 w-full h-screen overflow-hidden bg-[#0A2319]"
            style={{ zIndex: i + 1 }}
          >
            <img
              src={chapter.image}
              alt={chapter.title}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Reduced opacity for gradients to show more of the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2319]/90 via-[#0A2319]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2319]/60 via-[#0A2319]/10 to-transparent" />

            <div className="relative z-10 h-screen flex flex-col justify-end max-w-5xl px-6 md:px-16 pb-32 md:pb-48">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease }}
              >
                <div className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E8B647] animate-pulse" />
                  <span className="font-mono text-xs md:text-sm tracking-[0.2em] uppercase text-white font-bold drop-shadow-sm">
                    {chapter.step} · {chapter.meta}
                  </span>
                </div>

                <h3 className="font-display text-5xl md:text-8xl font-extrabold tracking-tighter text-white mb-6 leading-[0.95] drop-shadow-lg">
                  {chapter.title}
                </h3>

                <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed max-w-3xl mb-8 font-medium drop-shadow-lg">
                  {chapter.desc}
                </p>

                <div className="flex items-center gap-3 text-white/90 text-sm md:text-base font-medium drop-shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <span className="tracking-wide">{chapter.location}</span>
                </div>
              </motion.div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StickyStoryScroll;
