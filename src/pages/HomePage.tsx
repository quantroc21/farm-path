import { Link } from "react-router-dom";
import { Sprout, BarChart3, BookOpen, ShoppingCart, Search, Cpu, Truck, Globe, Award, CheckCircle, Zap, Shield } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import heroCoffeeFarm from "@/assets/hero-coffee-farm.jpg";
import exportBg from "@/assets/export-bg.jpg";

const features = [
  { icon: Sprout, title: "Quản lý trang trại", desc: "Quản lý đất đai, mùa vụ thông minh" },
  { icon: BarChart3, title: "Quản lý mùa vụ", desc: "Dự báo và tối ưu hóa sản xuất" },
  { icon: BookOpen, title: "Nhật ký sản xuất", desc: "Ghi nhận mọi hoạt động canh tác" },
  { icon: ShoppingCart, title: "Mua bán nông sản", desc: "Kết nối trực tiếp nông dân và người dùng" },
  { icon: Search, title: "Truy xuất nguồn gốc", desc: "Minh bạch xuyên suốt chuỗi cung ứng" },
];

const ecosystem = [
  {
    icon: Sprout,
    title: "Quản lý trang trại thông minh",
    desc: "Nền tảng EDEN HUB giúp nông dân quản lý đất đai, dựa trên dữ liệu phân tích cho từng loại cây trồng, mùa vụ, tối ưu chi phí và doanh thu.",
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
    icon: Award,
    title: "Chất lượng",
    desc: "100% cà phê specialty được tuyển chọn kỹ lưỡng, cupping score từ 83+ điểm.",
  },
  {
    icon: CheckCircle,
    title: "Giá hợp lý",
    desc: "Cắt bỏ trung gian, giá tốt nhất trực tiếp từ nông trại đến tay bạn.",
  },
  {
    icon: Zap,
    title: "Giao nhanh nhất",
    desc: "Rang tươi và giao hàng trong 24-48h trên toàn quốc.",
  },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <img
          src={heroCoffeeFarm}
          alt="Nông trại cà phê Việt Nam"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="relative z-10 px-5 md:px-8 max-w-7xl mx-auto w-full">
          <FadeIn>
            <div className="max-w-xl">
              <p className="text-primary-foreground/80 text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                NỀN TẢNG CÔNG NGHỆ NÔNG NGHIỆP
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Chấp cánh cho<br />nông sản Việt
              </h1>
              <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                Minh bạch từ nông trại đến tay bạn. Theo dõi hành trình từng sản phẩm — hoàn toàn minh bạch, hoàn toàn truy xuất được.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                  Khám phá sản phẩm
                </Link>
                <a href="#ecosystem" className="btn-outline-primary border-white text-white hover:bg-white hover:text-foreground inline-flex items-center gap-2">
                  Tìm hiểu thêm
                </a>
              </div>
              <div className="flex gap-3 mt-8">
                <a href="#" className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-black/80 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  App Store
                </a>
                <a href="#" className="bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-black/80 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                  Google Play
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features - 5 icons */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
              {features.map((f, i) => (
                <div key={f.title} className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <f.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{f.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Chấp cánh cho nông sản Việt - drone section */}
      <section className="relative py-24 overflow-hidden">
        <img src={heroCoffeeFarm} alt="Drone view" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-5">
          <FadeIn>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              NỀN TẢNG EDEN HUB
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Chấp cánh cho nông sản Việt
            </h2>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Nền tảng hệ sinh thái ứng dụng quản lý nông trại thông minh: bao gồm quản lý trang trại, 
              quy trình sản xuất, thu hoạch, dự báo mùa vụ, bán hàng, kho, và kết nối thiết bị IoT.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="section-padding bg-cream">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
              HỆ SINH THÁI
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Nền tảng & Ứng dụng
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {ecosystem.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="bg-card rounded-2xl p-8 shadow-card border border-border card-hover h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
              Chúng tôi đảm bảo
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Ba cam kết không thỏa hiệp dành cho khách hàng
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {guarantees.map((g, i) => (
              <FadeIn key={g.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <g.icon className="w-9 h-9 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-3">{g.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{g.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Core value */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <Shield className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              "Tốt nhất thay vì lớn nhất"
            </h2>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Eden Hub Coffee cam kết mang đến những sản phẩm chất lượng tốt nhất, 
              minh bạch nhất — vì chúng tôi tin rằng sự bền vững đến từ chất lượng, không phải số lượng.
            </p>
            <Link to="/shop" className="bg-white text-foreground px-8 py-3.5 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
              Khám phá sản phẩm
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Export section */}
      <section className="relative py-24 overflow-hidden">
        <img src={exportBg} alt="Xuất khẩu nông sản" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-5">
          <FadeIn>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              NỀN TẢNG EDEN X
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Xuất Khẩu Nông Sản
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
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

export default HomePage;
