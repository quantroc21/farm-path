import { useState } from "react";
import { Camera, MapPin, Check } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { stages } from "@/lib/mockData";
import seedlingImg from "@/assets/seedling.jpg";
import harvestImg from "@/assets/coffee-harvest.jpg";
import dryingImg from "@/assets/coffee-drying.jpg";

const placeholderPhotos = [seedlingImg, harvestImg, dryingImg];

const UpdateForm = () => {
  const [activeStage, setActiveStage] = useState("Chăm sóc");
  const [gpsOn, setGpsOn] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-5">
        <FadeIn>
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Đã gửi thành công!</h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Cập nhật của bạn đã được ghi nhận vào hành trình.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-forest">
            Tạo cập nhật mới
          </button>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="section-padding max-w-2xl mx-auto pb-32">
      <FadeIn>
        <h1 className="text-2xl font-bold text-foreground mb-1">Cập nhật mới</h1>
        <p className="text-sm text-muted-foreground mb-8">Ghi nhận tiến trình canh tác hôm nay</p>
      </FadeIn>

      {/* Stage selector */}
      <FadeIn delay={0.1}>
        <label className="text-sm font-semibold text-foreground mb-3 block">Giai đoạn</label>
        <div className="flex flex-wrap gap-2 mb-8">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStage(s)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                activeStage === s
                  ? "bg-accent text-accent-foreground shadow-soft scale-105"
                  : "bg-card text-muted-foreground border border-border hover:border-accent/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Photo grid */}
      <FadeIn delay={0.15}>
        <label className="text-sm font-semibold text-foreground mb-3 block">Hình ảnh</label>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {placeholderPhotos.map((src, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-soft card-hover">
              <img src={src} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <button className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent/50 hover:text-accent transition-colors">
            <Camera className="w-6 h-6" />
            <span className="text-[10px] font-medium">Thêm ảnh</span>
          </button>
        </div>
      </FadeIn>

      {/* Note */}
      <FadeIn delay={0.2}>
        <label className="text-sm font-semibold text-foreground mb-3 block">Ghi chú</label>
        <textarea
          className="w-full bg-card border border-border rounded-2xl p-4 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow min-h-[120px]"
          placeholder="Mô tả hoạt động hôm nay, ví dụ: Tưới nước buổi sáng, kiểm tra sâu bệnh..."
        />
      </FadeIn>

      {/* GPS */}
      <FadeIn delay={0.25}>
        <div className="flex items-center justify-between mt-6 bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Đính kèm vị trí GPS</p>
              <p className="text-xs text-muted-foreground">Tự động ghi nhận tọa độ nông trại</p>
            </div>
          </div>
          <button
            onClick={() => setGpsOn(!gpsOn)}
            className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
              gpsOn ? "bg-accent" : "bg-border"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-card shadow-sm transition-all duration-300 ${
                gpsOn ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </FadeIn>

      {/* Submit */}
      <div className="fixed bottom-24 left-0 right-0 px-5 z-40">
        <button
          onClick={() => setSubmitted(true)}
          className="btn-terracotta w-full text-center py-4 text-lg"
        >
          Gửi cập nhật
        </button>
      </div>
    </div>
  );
};

export default UpdateForm;
