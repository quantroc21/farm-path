import { Link } from "react-router-dom";
import { Sprout, Users, Globe, Shield } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import heroFarm from "@/assets/hero-farm.jpg";

const features = [
  {
    icon: Sprout,
    title: "Cập nhật dễ dàng",
    desc: "Nông dân ghi nhận hành trình canh tác chỉ với vài thao tác đơn giản trên điện thoại.",
  },
  {
    icon: Users,
    title: "Câu chuyện thật",
    desc: "Người tiêu dùng kết nối trực tiếp với nông dân qua hành trình minh bạch.",
  },
  {
    icon: Globe,
    title: "Hỗ trợ xuất khẩu",
    desc: "Dữ liệu truy xuất đạt chuẩn quốc tế, sẵn sàng cho thị trường toàn cầu.",
  },
  {
    icon: Shield,
    title: "Tin cậy & bảo mật",
    desc: "Mỗi bản ghi được xác thực và lưu trữ an toàn, không thể chỉnh sửa.",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] flex items-end overflow-hidden">
        <img
          src={heroFarm}
          alt="Nông trại cà phê Việt Nam"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="relative z-10 px-5 pb-12 md:pb-20 md:px-8 max-w-2xl">
          <FadeIn>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground leading-tight mb-4">
              Minh bạch từ rẫy<br />đến tay bạn
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-base md:text-lg text-primary-foreground/80 mb-8 max-w-md leading-relaxed">
              Theo dõi hành trình từng sản phẩm hữu cơ - từ hạt giống đến bàn ăn, hoàn toàn minh bạch.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link to="/trace" className="btn-terracotta inline-flex items-center gap-2 text-lg">
              Xem demo hành trình
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Nền tảng truy xuất thông minh
            </h2>
            <p className="text-muted-foreground mb-10 text-base">
              Được thiết kế cho nông nghiệp hữu cơ Việt Nam
            </p>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <div className="card-hover bg-card rounded-3xl p-6 shadow-card border border-border">
                  <div className="w-12 h-12 rounded-2xl bg-sage-light flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-forest" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-sage-light">
        <FadeIn>
          <div className="max-w-lg mx-auto text-center">
            <p className="text-3xl mb-2">🌱</p>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              Sẵn sàng trải nghiệm?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Khám phá trang truy xuất mẫu với dữ liệu thật từ nông trại cà phê Đắk Lắk.
            </p>
            <Link to="/trace" className="btn-forest inline-block">
              Xem trang truy xuất
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default Index;
