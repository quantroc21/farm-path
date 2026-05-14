import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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
};

const chapters: Chapter[] = [
  {
    step: "01",
    title: "Gieo hạt",
    desc: "Hạt giống được tuyển chọn từ những vườn ươm đạt chuẩn VietGAP. Mỗi lô đều được gắn mã truy xuất ngay từ ngày đầu tiên xuống đất.",
    image: seedling,
    location: "Vườn ươm M'Drak, Đắk Lắk",
  },
  {
    step: "02",
    title: "Chăm sóc",
    desc: "Quy trình canh tác bền vững theo tiêu chuẩn VietGAP. Tưới tiêu, bón phân hữu cơ và phòng trừ sâu bệnh được theo dõi qua dữ liệu cảm biến.",
    image: heroFarm,
    location: "VietGAP · Hữu cơ chuyển đổi",
  },
  {
    step: "03",
    title: "Thu hoạch",
    desc: "Hái chín chọn lọc thủ công — chỉ những quả đạt độ chín trên 95% mới được thu. Mỗi mẻ được cân và ghi nhận trực tiếp tại rẫy.",
    image: harvest,
    location: "Vụ mùa 2026 · 1.247 kg cherry",
  },
  {
    step: "04",
    title: "Sơ chế",
    desc: "Phương pháp natural và honey process trên giàn phơi cao. Nhiệt độ và độ ẩm được giám sát liên tục để giữ trọn hương vị.",
    image: drying,
    location: "Natural process · 18 ngày phơi",
  },
  {
    step: "05",
    title: "Nhật ký số",
    desc: "Mọi hoạt động canh tác được nông dân ghi nhận qua ứng dụng di động. Dữ liệu lưu trữ minh bạch, tạo nên bằng chứng số cho từng lô hàng.",
    image: farmerPortrait,
    location: "Daklink Farmer App · 168 nhật ký",
  },
  {
    step: "06",
    title: "Truy xuất",
    desc: "Quét mã QR trên bao bì để xem toàn bộ hành trình — từ giống, người trồng, ngày thu hoạch đến lô vận chuyển.",
    image: productPkg,
    location: "Mỗi sản phẩm, một câu chuyện",
  },
];

const ease = [0.25, 0.1, 0.25, 1] as const;

const shapes = [
  <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 text-[#FCE192] rotate-12"><path d="M20 90 Q40 100 70 70 Q90 50 90 20 Q70 40 50 60 Q30 75 20 90 Z" fill="currentColor"/></svg>,
  <svg viewBox="0 0 100 100" className="w-12 h-12 md:w-16 md:h-16 text-[#E53E3E] -rotate-12"><path d="M50 20 C80 20 90 40 85 70 C80 90 20 90 15 70 C10 40 20 20 50 20 Z" fill="currentColor"/><path d="M45 20 L50 5 L55 20 Z" fill="#718096"/></svg>,
  <svg viewBox="0 0 100 50" className="w-20 h-10 md:w-28 md:h-14 text-[#81C2B6] rotate-6"><path d="M5 48 Q25 25 30 30 Q50 5 60 20 Q75 -10 95 48 Z" fill="currentColor"/></svg>,
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-20 md:h-20 text-[#FDBA9B] -rotate-6"><path d="M25 80 C 10 65 10 40 25 25 C 40 10 65 10 80 25 C 95 40 85 70 70 70 C 55 70 60 50 50 40 C 40 30 25 40 25 55 C 25 65 30 75 25 80 Z" fill="currentColor"/></svg>,
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-20 md:h-20 text-[#2F855A] rotate-12"><path d="M40 90 L50 60 C30 60 20 40 30 25 C40 10 60 10 70 25 C80 40 70 60 50 60 L60 90 Z" fill="currentColor"/></svg>
];

const StickyStoryScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section className="bg-gradient-to-b from-[#15422D] to-[#0A2319] text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-24 md:py-40 relative z-10">
        {/* Header — calm, confident, no shouting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mb-20 md:mb-32 max-w-xl"
        >
          <p className="text-[#BC6C25] text-sm tracking-[0.15em] mb-4 font-semibold">
            Hành trình minh bạch
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-bold leading-[1.2] tracking-tight text-white mb-5">
            Từ rẫy đến bàn ăn
          </h2>
          <p className="text-white/80 text-base md:text-lg leading-relaxed">
            Mỗi sản phẩm Daklink mang theo một hành trình — từ hạt giống, qua
            bàn tay người nông dân, đến tách cà phê trên bàn bạn.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Vertical progress line */}
          <div className="absolute left-0 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px">
            <div className="absolute inset-0 bg-white/[0.06]" />
            <motion.div
              style={{ scaleY: smoothProgress, transformOrigin: "top" }}
              className="absolute inset-0 bg-[#BC6C25]/50"
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-28">
            {chapters.map((chapter, index) => (
              <TimelineChapter
                key={chapter.step}
                chapter={chapter}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Individual Chapter ─── */
const TimelineChapter = ({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) => {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Constrain parallax to a very small vertical range so it NEVER touches the text
  const yParallax = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <div ref={ref} className="relative">
      {/* Blank Space Decorative Graphic */}
      {index < 5 && (
        <motion.div 
          style={{ y: yParallax }}
          className={`absolute -bottom-12 md:-bottom-20 z-0 opacity-80 pointer-events-none ${
            isEven ? 'right-4 md:right-32' : 'left-8 md:left-32'
          }`}
        >
          {shapes[index % shapes.length]}
        </motion.div>
      )}

      {/* Dot on the line */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute left-0 md:left-1/2 top-3 -translate-x-1/2 z-10"
      >
        <div className="w-[11px] h-[11px] rounded-full bg-[#BC6C25] ring-[3px] ring-[#0a2319]" />
      </motion.div>

      {/* Content grid */}
      <div className="pl-6 md:pl-0 md:grid md:grid-cols-2 md:gap-16 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease }}
          className={`relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 md:mb-0 ${
            isEven ? "" : "md:order-2"
          }`}
        >
          <img
            src={chapter.image}
            alt={chapter.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className={`flex flex-col ${
            isEven
              ? "md:pl-14"
              : "md:pr-14 md:text-right md:items-end"
          }`}
        >
          <span className="text-[#BC6C25] text-[11px] md:text-xs tracking-[0.2em] font-semibold mb-3 font-mono">
            {chapter.step}
          </span>
          <h3 className="text-2xl md:text-[2rem] font-bold tracking-tight mb-4 text-white leading-tight">
            {chapter.title}
          </h3>
          <p className="text-white/80 text-[15px] md:text-base leading-[1.85] max-w-md">
            {chapter.desc}
          </p>
          <span className="mt-4 text-white/50 text-xs md:text-sm tracking-wide">
            {chapter.location}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default StickyStoryScroll;
