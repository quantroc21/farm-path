import { Download, QrCode } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const QRDemo = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-5">
      <FadeIn>
        <div className="text-center max-w-sm mx-auto">
          {/* QR frame */}
          <div className="relative inline-block mb-8">
            <div className="w-64 h-64 bg-card border-4 border-primary rounded-3xl flex items-center justify-center shadow-lift">
              {/* Mock QR pattern */}
              <div className="w-48 h-48 grid grid-cols-8 grid-rows-8 gap-0.5">
                {Array.from({ length: 64 }).map((_, i) => {
                  const isCorner =
                    (i < 3 || (i >= 5 && i < 8)) && (Math.floor(i / 8) < 3) ||
                    (i % 8 < 3 && Math.floor(i / 8) < 3) ||
                    (i % 8 >= 5 && Math.floor(i / 8) < 3) ||
                    (i % 8 < 3 && Math.floor(i / 8) >= 5);
                  const isRandom = Math.random() > 0.5;
                  return (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        isCorner || isRandom ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                  );
                })}
              </div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-soft">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-accent rounded-tl-xl" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-accent rounded-tr-xl" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-accent rounded-bl-xl" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-accent rounded-br-xl" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            Quét để xem hành trình thật
          </h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Mỗi sản phẩm có một mã QR riêng. Người tiêu dùng quét và xem toàn bộ hành trình canh tác.
          </p>

          <button className="btn-terracotta inline-flex items-center gap-2">
            <Download className="w-5 h-5" />
            Tải mã QR
          </button>
        </div>
      </FadeIn>
    </div>
  );
};

export default QRDemo;
