import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* ── Slide transition variants ── */
const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    scale: 0.95,
    opacity: 0,
  }),
  center: {
    y: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "-100%" : "100%",
    scale: 0.95,
    opacity: 0,
  }),
};

const StickyStoryScroll = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // +1 down, -1 up
  const [isLocked, setIsLocked] = useState(false); // true = section has captured scroll
  const isAnimating = useRef(false);
  const touchStartY = useRef(0);
  const accumulatedDelta = useRef(0);

  const SWIPE_THRESHOLD = 50; // px of accumulated wheel delta or touch distance to trigger
  const DEBOUNCE_MS = 600; // cooldown between transitions

  /* ── Navigate to a chapter ── */
  const goTo = useCallback((newIndex: number, dir: number) => {
    if (isAnimating.current) return;
    if (newIndex < 0 || newIndex >= chapters.length) return;

    isAnimating.current = true;
    accumulatedDelta.current = 0;
    setDirection(dir);
    setActiveIndex(newIndex);

    setTimeout(() => {
      isAnimating.current = false;
    }, DEBOUNCE_MS);
  }, []);

  /* ── Lock/unlock scroll capture with IntersectionObserver ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Lock when section is >60% visible
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          setIsLocked(true);
        }
      },
      { threshold: [0.6] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Wheel handler: capture scroll gestures while locked ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // At first chapter scrolling up → release to page
      if (goingUp && activeIndex === 0) {
        setIsLocked(false);
        return;
      }
      // At last chapter scrolling down → release to page
      if (goingDown && activeIndex === chapters.length - 1) {
        setIsLocked(false);
        return;
      }

      // We're in the middle - capture the scroll
      e.preventDefault();

      accumulatedDelta.current += e.deltaY;

      if (accumulatedDelta.current > SWIPE_THRESHOLD) {
        goTo(activeIndex + 1, 1);
      } else if (accumulatedDelta.current < -SWIPE_THRESHOLD) {
        goTo(activeIndex - 1, -1);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isLocked, activeIndex, goTo]);

  /* ── Touch handler: capture swipe gestures while locked ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      accumulatedDelta.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked) return;
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }

      const deltaY = touchStartY.current - e.touches[0].clientY;
      const goingDown = deltaY > 0;
      const goingUp = deltaY < 0;

      // At boundaries → release
      if (goingUp && activeIndex === 0) {
        setIsLocked(false);
        return;
      }
      if (goingDown && activeIndex === chapters.length - 1) {
        setIsLocked(false);
        return;
      }

      // Capture
      e.preventDefault();

      if (deltaY > SWIPE_THRESHOLD) {
        goTo(activeIndex + 1, 1);
      } else if (deltaY < -SWIPE_THRESHOLD) {
        goTo(activeIndex - 1, -1);
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isLocked, activeIndex, goTo]);

  /* ── Re-lock when scrolling back into view ── */
  useEffect(() => {
    if (isLocked) return;

    const el = sectionRef.current;
    if (!el) return;

    const relockObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
          // Only re-lock if we're at a boundary chapter
          if (activeIndex === 0 || activeIndex === chapters.length - 1) {
            setIsLocked(true);
          }
        }
      },
      { threshold: [0.8] }
    );

    relockObserver.observe(el);
    return () => relockObserver.disconnect();
  }, [isLocked, activeIndex]);

  const c = chapters[activeIndex];

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
            Mỗi sản phẩm Daklink mang theo một hành trình - từ hạt giống, qua bàn tay người nông dân, đến tách cà phê trên bàn bạn.
          </p>
        </motion.div>
      </div>

      {/* ── Reels Viewport ── */}
      <div
        ref={sectionRef}
        className="relative w-full h-[100dvh] overflow-hidden bg-black"
      >
        {/* ── UI Overlay ── */}
        <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between">
          <div>
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-[#E8B647] via-[#BC6C25] to-[#E8B647]"
                animate={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Chapter counter */}
            <div className="absolute top-6 left-5 md:left-12 flex items-center gap-3 bg-[#0A2319]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
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

        {/* ── Animated Chapter Content ── */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.35 },
            }}
            className="absolute inset-0 w-full h-full flex flex-col justify-end overflow-hidden"
          >
            {/* Background Image */}
            <img
              src={c.image}
              alt={c.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2319] via-[#0A2319]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2319]/80 via-[#0A2319]/20 to-transparent" />

            {/* Foreground content */}
            <div className="relative z-20 px-5 md:px-12 pb-[100px] md:pb-[140px] max-w-3xl">
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
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Scroll hint - only on first chapter */}
        {activeIndex === 0 && (
          <div className="absolute bottom-5 right-5 md:right-12 z-50 flex items-center gap-2 text-white/50 text-[10px] tracking-[0.25em] uppercase">
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
    </section>
  );
};

export default StickyStoryScroll;
