import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { farmer, timelineEntries } from "@/lib/mockData";
import farmerPortrait from "@/assets/farmer-portrait.jpg";
import seedlingImg from "@/assets/seedling.jpg";
import harvestImg from "@/assets/coffee-harvest.jpg";
import dryingImg from "@/assets/coffee-drying.jpg";

const imageMap = {
  seedling: seedlingImg,
  harvest: harvestImg,
  drying: dryingImg,
};

const FarmerDashboard = () => {
  return (
    <div className="section-padding max-w-2xl mx-auto">
      {/* Welcome */}
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <img
            src={farmerPortrait}
            alt={farmer.name}
            className="w-14 h-14 rounded-2xl object-cover shadow-card"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Chào {farmer.name} 🌿
            </h1>
            <p className="text-sm text-muted-foreground">
              {farmer.crop} · {farmer.journey}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Skeleton preview cards */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: "Giai đoạn", value: "5/6" },
            { label: "Cập nhật", value: "12" },
            { label: "Ảnh", value: "28" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-4 shadow-soft border border-border text-center">
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Timeline */}
      <FadeIn delay={0.15}>
        <h2 className="text-lg font-bold text-foreground mb-6">Hành trình canh tác</h2>
      </FadeIn>

      <div className="relative pl-10">
        <div className="timeline-line" />

        {timelineEntries.map((entry, i) => (
          <FadeIn key={entry.id} delay={0.1 + i * 0.08}>
            <div className="relative mb-6 last:mb-0">
              <div className="timeline-dot" style={{ top: "24px" }} />
              <div className="bg-card rounded-2xl p-5 shadow-card border border-border card-hover">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge-terracotta">{entry.stage}</span>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <img
                  src={imageMap[entry.imageKey]}
                  alt={entry.stage}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <p className="text-sm text-foreground leading-relaxed mb-2">{entry.description}</p>
                <p className="text-xs text-muted-foreground italic">📝 {entry.note}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* FAB */}
      <Link
        to="/update"
        className="fixed bottom-24 right-5 z-40 w-14 h-14 bg-accent rounded-2xl shadow-lift flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Plus className="w-6 h-6 text-accent-foreground" />
      </Link>
    </div>
  );
};

export default FarmerDashboard;
