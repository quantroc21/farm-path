import FadeIn from "@/components/FadeIn";
import { farmer, timelineEntries } from "@/lib/mockData";
import farmerPortrait from "@/assets/farmer-portrait.jpg";
import heroFarm from "@/assets/hero-farm.jpg";
import seedlingImg from "@/assets/seedling.jpg";
import harvestImg from "@/assets/coffee-harvest.jpg";
import dryingImg from "@/assets/coffee-drying.jpg";
import { MapPin, Award, Leaf } from "lucide-react";

const imageMap = {
  seedling: seedlingImg,
  harvest: harvestImg,
  drying: dryingImg,
};

const TracePage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-44 overflow-hidden">
        <img src={heroFarm} alt="Nông trại hữu cơ Tây Nguyên – truy xuất nguồn gốc nông sản Daklink" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 h-full flex items-end px-5 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={farmerPortrait}
              alt={`Nông dân ${farmer.name} – đối tác canh tác hữu cơ Daklink`}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-background shadow-lift"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">{farmer.fullName}</h1>
              <p className="text-sm text-primary/70 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {farmer.region}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey title */}
      <section className="px-5 py-6">
        <FadeIn>
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Hành trình truy xuất</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{farmer.crop}</h2>
          <p className="text-sm text-primary/70">{farmer.journey} · {farmer.region}</p>
        </FadeIn>
      </section>

      {/* Timeline */}
      <section className="px-5 pb-8">
        <div className="relative pl-10">
          <div className="timeline-line" />
          {timelineEntries.map((entry, i) => (
            <FadeIn key={entry.id} delay={i * 0.08}>
              <div className="relative mb-6 last:mb-0">
                <div className="timeline-dot" style={{ top: "24px" }} />
                <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border">
                  <img
                    src={imageMap[entry.imageKey]}
                    alt={`Giai đoạn ${entry.stage} – nhật ký canh tác số Daklink`}
                    className="w-48 h-32 object-cover rounded-xl"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge-terracotta">{entry.stage}</span>
                      <span className="text-xs text-primary/70">{entry.date}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-2">{entry.description}</p>
                    <p className="text-xs text-primary/70 italic">📝 {entry.note}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* AI Summary */}
      <section className="px-5 pb-8">
        <FadeIn>
          <div className="bg-sage-light rounded-3xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-forest" />
              <span className="text-sm font-bold text-foreground">Tóm tắt AI</span>
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Lô cà phê Liberica này được canh tác hoàn toàn hữu cơ tại M'Drak, Đắk Lắk bởi nông dân Nguyễn Văn Việt
              với hơn 25 năm kinh nghiệm. Quy trình từ gieo hạt đến chế biến đều tuân thủ tiêu chuẩn hữu cơ nghiêm ngặt,
              không sử dụng hóa chất. Năng suất đạt 3.2 tấn/ha với phương pháp phơi nắng truyền thống.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Farmer story */}
      <section className="px-5 pb-8">
        <FadeIn>
          <h3 className="text-lg font-bold text-foreground mb-3">Câu chuyện nông dân</h3>
          <p className="text-sm text-primary/70 leading-relaxed mb-4">{farmer.bio}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border">
            <img src={heroFarm} alt="Vùng canh tác hữu cơ Đắk Lắk – chuỗi cung ứng nông sản minh bạch" className="w-[60%] mx-auto py-3 object-contain rounded-lg" />
            <div className="p-4">
              <p className="text-xs font-semibold text-foreground mb-1">📍 Vùng canh tác</p>
              <p className="text-xs text-primary/70">{farmer.region} — Cao nguyên Trung phần, độ cao 500-700m</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="px-5 py-10 text-center bg-sage-light">
        <FadeIn>
          <p className="text-sm font-semibold text-foreground">Minh bạch & bền vững 🌱</p>
          <p className="text-xs text-primary/70 mt-1">Powered by Daklink</p>
        </FadeIn>
      </footer>
    </div>
  );
};

export default TracePage;
