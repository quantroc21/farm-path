import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, BarChart3, BookOpen, ShoppingCart, Search, Cpu, Truck, Globe, Award, CheckCircle, Zap, Shield, MapPin, Calendar, ArrowRight, Star } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import StickyStoryScroll from "@/components/StickyStoryScroll";
import heroCoffeeFarm from "@/assets/hero-coffee-farm.jpg";
import heroVideo from "@/assets/hero-video.mp4";
import heroFlycam from "@/assets/hero-flycam.mp4";
import exportBg from "@/assets/export-bg.jpg";
import { useQuery } from "@tanstack/react-query";
import { LandingService } from "@/services/landing.service";
import { ProductService } from "@/lib/productData";
import ProductCard from "@/components/ProductCard";
import tabFarm from "@/assets/tabs/tab_farm_infrastructure_1773716368645.png";
import tabCultivation from "@/assets/tabs/tab_cultivation_protocol_1773716426810.png";
import tabDiary from "@/assets/tabs/tab_digital_diary_1773716443710.png";
import tabTrade from "@/assets/tabs/tab_direct_trade_1773716492148.png";
import tabTrace from "@/assets/tabs/tab_traceability_verification_1773716537899.png";

const tabFeatures = [
  {
    id: 'farm',
    label: 'TRANG TRẠI',
    title: 'Quản lý hạ tầng số',
    desc: 'DAKLINK giúp số hóa toàn bộ bản đồ khu vực, tài sản và cơ sở hạ tầng nông trại. Nắm bắt mọi biến động thực địa theo thời gian thực một cách chính xác.',
    image: tabFarm,
    icon: Sprout
  },
  {
    id: 'cultivation',
    label: 'CANH TÁC',
    title: 'Quy trình chuẩn VietGAP',
    desc: 'Thiết lập và theo dõi lộ trình phát triển của cây trồng một cách khoa học. Tối ưu hóa việc chăm sóc và bón phân theo các tiêu chuẩn nông nghiệp bền vững.',
    image: tabCultivation,
    icon: BarChart3
  },
  {
    id: 'diary',
    label: 'NHẬT KÝ',
    title: 'Minh bạch hóa sản xuất',
    desc: 'Ghi nhận mọi hoạt động canh tác qua ứng dụng di động ngay tại rẫy. Toàn bộ dữ liệu được lưu trữ an toàn, tạo nên bằng chứng số cho chất lượng nông sản.',
    image: tabDiary,
    icon: BookOpen
  },
  {
    id: 'trade',
    label: 'THƯƠNG MẠI',
    title: 'Gần hơn với khách hàng',
    desc: 'Cầu nối trực tiếp giúp nông dân tiếp cận thị trường nhanh chóng. Giảm thiểu trung gian để mang lại giá trị công bằng nhất cho cả người trồng và người dùng.',
    image: tabTrade,
    icon: ShoppingCart
  },
  {
    id: 'trace',
    label: 'TRUY XUẤT',
    title: 'Niềm tin từ sự minh bạch',
    desc: 'Mỗi sản phẩm là một câu chuyện. Chỉ cần quét mã QR để truy xuất toàn bộ hành trình từ giống, quy trình chăm sóc đến khi thu hoạch và đóng gói.',
    image: tabTrace,
    icon: Search
  },
];

const ecosystem = [
  {
    icon: Sprout,
    title: "Quản lý trang trại thông minh",
    desc: "Nền tảng DAKLINK giúp nông dân quản lý đất đai, dựa trên dữ liệu phân tích cho từng loại cây trồng, mùa vụ, tối ưu chi phí và doanh thu.",
  },
  {
    icon: Truck,
    title: "Phân phối nông sản",
    desc: "Kết nối giao dịch nông sản sỉ và lẻ nội địa, cho phép mua bán trực tiếp giữa nông dân và người tiêu dùng.",
  },
  {
    icon: Globe,
    title: "Xuất khẩu nông sản",
    desc: "Sàn giao dịch xuất nhập khẩu trực tuyến kết nối cộng đồng doanh nghiệp từ hơn 150 quốc gia.",
  },
  {
    icon: Cpu,
    title: "Hệ thống tiến cử AI",
    desc: "Ứng dụng AI phân tích dữ liệu thời gian thực, đưa ra khuyến nghị tối ưu cho canh tác và kinh doanh.",
  },
];

const guarantees = [
  {
    icon: Truck,
    text: "Miễn phí vận chuyển cho đơn hàng từ 490k",
  },
  {
    icon: Sprout,
    text: "Nông sản chất lượng cao từ vườn nhà đến tay bạn",
  },
  {
    icon: Star,
    text: "Tự hào thương hiệu thuần Việt 100%",
  },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[520px] flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ x: [0, -6, 4, -3, 0], y: [0, 3, -4, 2, 0] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        >
          <video
            ref={(el) => { if (el) el.playbackRate = 0.7; }}
            src={heroFlycam}
            poster={heroCoffeeFarm}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-110"
            style={{ filter: "blur(0.6px) saturate(1.05)" }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="relative z-10 px-6 md:px-10 max-w-7xl mx-auto w-full">
          <FadeIn>
            <div className="max-w-xl">
              <p className="font-mono-accent text-white/80 text-[11px] mb-4">
                NỀN TẢNG CÔNG NGHỆ NÔNG NGHIỆP
              </p>
              <h1 className="font-display text-[2.5rem] md:text-5xl font-bold text-white leading-[1.1] mb-5 tracking-tight">
                Chấp cánh cho<br />nông sản Việt
              </h1>
              <p className="text-white/90 text-sm md:text-base mb-8 leading-[1.7] max-w-md">
                Minh bạch từ nông trại đến tay bạn. Theo dõi hành trình từng sản phẩm, hoàn toàn minh bạch, hoàn toàn truy xuất được.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary inline-flex items-center gap-2 min-h-[48px]">
                  Khám phá sản phẩm
                </Link>
                <a
                  href="https://app.daklink.vn/register"
                  className="btn-outline-primary border-white text-white hover:bg-white hover:text-foreground inline-flex items-center gap-2 min-h-[48px]"
                >
                  Bắt đầu ngay
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Tabbed Feature Section */}
      <section className="bg-[#F8F8F7] py-14 px-6 md:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <TabbedFeatureSection />
        </div>
      </section>

      {/* Drone section */}
      <section className="relative py-16 overflow-hidden min-h-[400px] flex items-center">
        <motion.img 
          src={heroCoffeeFarm} 
          alt="Nông trại cà phê Tây Nguyên ứng dụng nhật ký canh tác số Daklink" 
          className="absolute inset-0 w-full h-full object-cover origin-center"
          initial={{ scale: 1.4 }}
          animate={{
            scale: [1.4, 1.05, 1.4],
            x: ["0%", "3%", "0%"],
            y: ["0%", "-2%", "0%"],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <FadeIn>
            <p className="font-mono-accent text-white/80 text-[11px] mb-3">
              NỀN TẢNG DAKLINK
            </p>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Nền tảng nông nghiệp số toàn diện
            </h2>
            <p className="text-white text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Nền tảng hệ sinh thái ứng dụng quản lý nông trại thông minh: bao gồm quản lý trang trại, 
              quy trình sản xuất, thu hoạch, dự báo mùa vụ, bán hàng, kho, và kết nối thiết bị IoT.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="font-mono-accent text-primary/70 text-[11px] mb-2">
                SẢN PHẨM CỦA CHÚNG TÔI
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                Minh bạch từ rẫy đến bạn
              </h2>
              <p className="text-primary/70 text-sm max-w-xl mx-auto">
                Khám phá các lô hàng thực tế được quản lý bởi hệ thống Daklink. 
                Chúng tôi tin rằng sự tin tưởng bắt đầu từ sự minh bạch.
              </p>
            </div>
          </FadeIn>

          <FeaturedProductsGrid />
        </div>
      </section>

      {/* Ecosystem - Sticky Scroll Storytelling */}
      <StickyStoryScroll />

      {/* Guarantees */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-3 tracking-tight">
              Chúng tôi đảm bảo
            </h2>
            <p className="text-primary/70 text-center mb-10 max-w-lg mx-auto text-sm">
              Ba cam kết không thỏa hiệp dành cho khách hàng
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {guarantees.map((g, i) => (
              <FadeIn key={g.text} delay={i * 0.1}>
                <div className="flex items-center gap-6 group justify-center md:justify-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:rounded-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                    <g.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-base font-bold text-foreground leading-snug max-w-[220px] md:max-w-xs">{g.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Export section */}
      <section className="relative py-16 overflow-hidden">
        <img src={exportBg} alt="Xuất khẩu nông sản Việt Nam đạt chuẩn quốc tế qua nền tảng Daklink" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <FadeIn>
            <p className="font-mono-accent text-white/80 text-[11px] mb-3">
              NỀN TẢNG DAKLINK X
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              Xuất Khẩu Nông Sản
            </h2>
            <p className="text-white text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Sàn giao dịch xuất nhập khẩu trực tuyến hàng đầu trong khu vực và toàn cầu, 
              kết nối cộng đồng doanh nghiệp từ hơn 150 quốc gia. Cầu nối quan trọng 
              kết nối thị trường Việt Nam với thế giới.
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};



const FeaturedProductsGrid = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["shop-products-home"],
    queryFn: () => ProductService.getAll(),
  });
  
  const displayProducts = products?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl h-80 border border-border/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-3xl border border-dashed border-border">
        <p className="text-primary/70 italic">Không có dữ liệu sản phẩm thực tế hiện tại.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {displayProducts.map((product, i) => (
        <FadeIn key={product.id} delay={i * 0.1}>
          <ProductCard product={product} />
        </FadeIn>
      ))}
    </div>
  );
};

const TabbedFeatureSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const activeData = tabFeatures[activeIndex];
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % tabFeatures.length);
    }, 10000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, []);

  const handleTabClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    startAutoPlay();
  };

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % tabFeatures.length);
      startAutoPlay();
    } else if (info.offset.x > swipeThreshold) {
      setDirection(-1);
      setActiveIndex((prev) => (prev - 1 + tabFeatures.length) % tabFeatures.length);
      startAutoPlay();
    }
  };

  return (
    <div className="space-y-0 relative">
      {/* Tab Navigation */}
      <div className="flex md:grid md:grid-cols-5 mb-1 bg-muted/20 border-b border-border overflow-x-auto no-scrollbar scroll-smooth">
        {tabFeatures.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(idx)}
            className={`py-5 md:py-7 px-6 md:px-4 min-w-fit md:min-w-0 text-xs md:text-base font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap outline-none ${
              activeIndex === idx 
                ? 'bg-[#E7E7E2] border-primary text-primary shadow-sm' 
                : 'border-transparent text-primary/70 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with Slideshow behavior */}
      <div className="relative overflow-hidden bg-[#E7E7E2] rounded-b-3xl shadow-sm min-h-fit md:min-h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? "100%" : "-100%",
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
                zIndex: 1
              },
              exit: (dir: number) => ({
                x: dir > 0 ? "-100%" : "100%",
                opacity: 0,
                zIndex: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="p-6 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 cursor-grab active:cursor-grabbing w-full"
          >
            <div className="flex-1 space-y-6 md:space-y-8 text-left select-none">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-0">
                <activeData.icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight px-0 tracking-tight">
                {activeData.title}
              </h3>
              <p className="text-primary/70 text-base md:text-lg leading-relaxed max-w-xl mx-0">
                {activeData.desc}
              </p>
              <div className="pt-4 flex items-center justify-start gap-4 md:gap-6">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04]">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <span className="font-mono-accent text-[10px] md:text-xs text-primary/70">Digital Agri</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04]">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <span className="font-mono-accent text-[10px] md:text-xs text-primary/70">VietGAP</span>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative order-first md:order-last pointer-events-none">
              <div className="relative aspect-[16/10] md:aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl group">
                <img 
                  src={activeData.image} 
                  alt={activeData.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
