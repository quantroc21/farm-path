import { products } from "@/lib/productData";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { Trophy } from "lucide-react";

const ShopPage = () => {
  const espressoProducts = products.filter((p) => p.category === "espresso" || p.category === "all");
  const handbrewProducts = products.filter((p) => p.category === "handbrew" || p.category === "all");

  return (
    <div>
      {/* Global Coffee Awards */}
      <section className="bg-foreground text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <Trophy className="w-8 h-8 text-gold" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Global Coffee Awards
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                  OVERALL NATION<br />WINNER
                </h1>
                <p className="text-white/70 text-sm leading-relaxed max-w-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Trong kết quả công bố năm nay, Eden Hub Coffee được trao danh hiệu 
                  Overall National Winner Vietnam dành cho nhà rang đại diện cho chất lượng 
                  cà phê Việt Nam tại cuộc thi.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto md:mx-0">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-gold font-bold text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>Silver</p>
                    <p className="text-white/60 text-[10px] mt-1 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Giải Bạc</p>
                    <p className="text-white/80 text-xs mt-1 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>LIBERICA M'DRAK</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-gold font-bold text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>Gold</p>
                    <p className="text-white/60 text-[10px] mt-1 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Giải Vàng</p>
                    <p className="text-white/80 text-xs mt-1 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>FINE ROBUSTA CƯ M'GAR</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-gold font-bold text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>Bronze</p>
                    <p className="text-white/60 text-[10px] mt-1 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Giải Đồng</p>
                    <p className="text-white/80 text-xs mt-1 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>PROUD OF VIETNAM BLEND</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">RECENTLY VIEWED</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            {products.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Best for Espresso */}
      <section className="section-padding bg-cream">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">BEST FOR ESPRESSO</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {espressoProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Best for Hand Brew */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">BEST FOR HAND BREW</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {handbrewProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
