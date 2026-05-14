import { useQuery } from "@tanstack/react-query";
import { ProductService, formatPrice } from "@/lib/productData";
import type { Product } from "@/lib/productData";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { Trophy, Loader2 } from "lucide-react";

const ShopPage = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: () => ProductService.getAll(),
  });

  const tuoiProducts = products.filter((p) => p.category === "tuoi" || p.category === "all");
  const khoProducts = products.filter((p) => p.category === "kho" || p.category === "all");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Nông Sản Tiêu Biểu */}
      <section className="bg-foreground text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <Trophy className="w-6 h-6 text-gold" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    Nông Sản Tiêu Biểu
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-5">
                  NÔNG SẢN SẠCH<br />ĐẠT CHUẨN XUẤT KHẨU
                </h1>
                <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                  Nông nghiệp số Daklink cam kết mang đến những sản phẩm nông sản sạch, 
                  đạt chuẩn xuất khẩu với quy trình kiểm soát chất lượng nghiêm ngặt và minh bạch.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto md:mx-0">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-gold font-bold text-lg italic">VietGAP</p>
                    <p className="text-white/60 text-[10px] mt-1 uppercase">Chứng nhận</p>
                    <p className="text-white/80 text-xs mt-1 font-semibold">AN TOÀN SINH HỌC</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-gold font-bold text-lg italic">Top 10</p>
                    <p className="text-white/60 text-[10px] mt-1 uppercase">Nông sản</p>
                    <p className="text-white/80 text-xs mt-1 font-semibold">TIÊU BIỂU TOÀN QUỐC</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <p className="text-gold font-bold text-lg italic">Export</p>
                    <p className="text-white/60 text-[10px] mt-1 uppercase">Mức độ</p>
                    <p className="text-white/80 text-xs mt-1 font-semibold">ĐẠT CHUẨN XUẤT KHẨU</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* All products */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">SẢN PHẨM MỚI TÌM HIỂU</h2>
          </FadeIn>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground italic">Chưa có sản phẩm nào được đăng. Vui lòng quay lại sau.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
              {products.map((product, i) => (
                <FadeIn key={product.id} delay={i * 0.05}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Ớt Khô */}
      {khoProducts.length > 0 && (
        <section className="section-padding bg-background">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">SẢN PHẨM CHẾ BIẾN</h2>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {khoProducts.map((product, i) => (
                <FadeIn key={product.id} delay={i * 0.05}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ShopPage;
