import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "@/lib/productData";
import FadeIn from "@/components/FadeIn";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, CreditCard, ChevronLeft, ChevronRight, Sprout, Droplets, Sun, Package, Truck, Coffee, MapPin, Leaf } from "lucide-react";

const stageIcons: Record<string, React.ElementType> = {
  "Gieo hạt": Sprout,
  "Chăm sóc": Droplets,
  "Ra hoa": Sun,
  "Thu hoạch": Sun,
  "Sơ chế": Coffee,
  "Đóng gói": Package,
  "Giao hàng": Truck,
  "Tuyển chọn": Leaf,
  "Rang & Đóng gói": Package,
  "Phối trộn & Đóng gói": Package,
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sản phẩm không tìm thấy</h1>
          <Link to="/shop" className="btn-primary">Quay lại Shop</Link>
        </div>
      </div>
    );
  }

  const otherProducts = products.filter((p) => p.id !== product.id).slice(0, 4);
  const currentIndex = products.findIndex((p) => p.id === product.id);
  const prevProduct = products[currentIndex - 1];
  const nextProduct = products[currentIndex + 1];

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
          <Link to="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">COFFEE</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          {prevProduct && (
            <Link to={`/product/${prevProduct.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Trước
            </Link>
          )}
          {prevProduct && nextProduct && <span className="text-border">|</span>}
          {nextProduct && (
            <Link to={`/product/${nextProduct.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-semibold">
              Tiếp <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Product Detail */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left - Image */}
          <FadeIn>
            <div>
              <div className="bg-muted rounded-2xl overflow-hidden aspect-square mb-4">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary cursor-pointer">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right - Info */}
          <FadeIn delay={0.1}>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{product.name}</h1>
              <p className="text-primary text-2xl font-bold mb-1">{formatPrice(product.price)}</p>
              <p className="text-muted-foreground text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Đã bao gồm Thuế</p>

              {/* Size */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-foreground mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Size *</label>
                <div className="border border-border rounded-lg px-4 py-2.5 text-sm inline-block">
                  {product.size}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-2 block" style={{ fontFamily: "'Inter', sans-serif" }}>Số lượng *</label>
                <div className="flex items-center border border-border rounded-lg inline-flex">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-muted transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 py-2 text-sm font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-muted transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 mb-8">
                <button className="w-full btn-primary flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> ADD TO CART
                </button>
                <button className="w-full bg-foreground text-background px-8 py-3.5 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-foreground/90 flex items-center justify-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <CreditCard className="w-5 h-5" /> BUY NOW
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-12">
        <FadeIn>
          <div className="bg-cream rounded-2xl p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg text-foreground mb-4 uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Nốt hương:</h3>
                <p className="text-foreground font-semibold mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>{product.flavorNotes}</p>

                <div className="space-y-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {Object.entries({
                    "TÊ QUỐC GIA": product.origin.country,
                    "VÙNG ĐẤT": product.origin.region,
                    "NÔNG HỘ": product.origin.farmer,
                    "ĐỘ CAO": product.origin.altitude,
                    "NÔNG TRẠI": product.origin.farm,
                    "GIỐNG": product.origin.variety,
                    "QUY TRÌNH": product.origin.process,
                  }).map(([label, value]) => (
                    <div key={label} className="flex gap-4">
                      <span className="text-muted-foreground font-semibold min-w-[100px] uppercase text-xs">{label}:</span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Câu chuyện</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{product.description}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{product.story}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* TRUY XUẤT NGUỒN GỐC - Highlight section */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pb-16">
        <FadeIn>
          <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-6 md:p-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-[0.15em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  ĐIỂM KHÁC BIỆT CỦA EDEN HUB
                </p>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Truy Xuất Nguồn Gốc
            </h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              Theo dõi hành trình từng hạt cà phê — từ lúc gieo hạt đến khi giao tận tay bạn. 
              Mọi bước đều được ghi nhận và xác thực.
            </p>

            {/* Timeline */}
            <div className="relative">
              {/* Horizontal line for desktop */}
              <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-primary/20" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-3">
                {product.traceability.map((step, i) => {
                  const StageIcon = stageIcons[step.stage] || Leaf;
                  return (
                    <FadeIn key={step.id} delay={i * 0.08}>
                      <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0">
                        {/* Icon circle */}
                        <div className="relative z-10 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg md:mb-4">
                          <StageIcon className="w-7 h-7" />
                        </div>
                        
                        {/* Content */}
                        <div className="md:text-center flex-1">
                          <p className="text-xs font-semibold text-primary mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{step.date}</p>
                          <h4 className="font-bold text-sm text-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{step.stage}</h4>
                          <p className="text-muted-foreground text-xs leading-relaxed mb-1">{step.description}</p>
                          <p className="text-xs text-primary/70 italic">📝 {step.note}</p>
                        </div>

                        {/* Vertical line for mobile */}
                        {i < product.traceability.length - 1 && (
                          <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-primary/20 md:hidden" style={{ height: "calc(100% - 3.5rem)" }} />
                        )}
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Related products */}
      <section className="section-padding bg-cream">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Sản phẩm khác</h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {otherProducts.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.05}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
