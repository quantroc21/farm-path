import { useParams, Link, useNavigate } from "react-router-dom";
import { ProductService, formatPrice } from "@/lib/productData";
import type { Product } from "@/lib/productData";
import FadeIn from "@/components/FadeIn";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart, CreditCard, ChevronLeft, ChevronRight, Sprout, Droplets, Sun, Package, Truck, Coffee, MapPin, Leaf, X, Loader2, Map, Users, Mountain, Home, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const recipes: Record<string, any> = {
  "Sữa chua Chanh dây": {
    ingredients: ["1 hộp sữa chua không đường/có đường", "1-2 quả chanh dây tươi", "1 thìa mật ong (tùy chọn)", "Đá viên (nếu dùng lạnh)"],
    steps: [
      "Cắt đôi quả chanh dây, dùng thìa nạo lấy phần ruột (cả nước và hạt).",
      "Cho sữa chua ra ly hoặc bát nhỏ.",
      "Rưới phần ruột chanh dây lên trên mặt sữa chua.",
      "Thêm mật ong nếu thích ngọt hơn, trộn đều và thưởng thức ngay."
    ]
  },
  "Cheesecake Chanh dây": {
    ingredients: ["200g cream cheese", "100g bánh quy nghiền", "50g bơ lạt đun chảy", "100ml whipping cream", "50g đường", "3-4 quả chanh dây", "Gelatin"],
    steps: [
      "Trộn bánh quy nghiền với bơ lạt, nén chặt vào khuôn làm đế bánh. Để lạnh 30 phút.",
      "Đánh tan cream cheese với đường, sau đó trộn với whipping cream đã đánh bông nhẹ.",
      "Lọc lấy 30ml nước cốt chanh dây, hòa với gelatin đun chảy, rồi trộn đều vào hỗn hợp cream cheese.",
      "Đổ hỗn hợp lên đế bánh, để lạnh 4 tiếng.",
      "Làm thạch chanh dây (nước cốt chanh dây + hạt + đường + gelatin) đổ lên mặt bánh. Để lạnh thêm 1 tiếng."
    ]
  },
  "Mojito Chanh dây": {
    ingredients: ["2 quả chanh dây", "10 lá bạc hà tươi", "1/2 quả chanh xanh", "2 thìa đường cát hoặc syrup đường", "Nước soda (hoặc Sprite)", "Đá viên"],
    steps: [
      "Cho lá bạc hà, đường và chanh xanh (cắt múi) vào ly. Dùng chày dầm nhẹ để tiết tinh dầu.",
      "Nạo phần ruột chanh dây cho vào ly.",
      "Thêm đá viên đến đầy ly.",
      "Đổ nước soda vào, khuấy đều và trang trí thêm lá bạc hà."
    ]
  },
  "Pannacotta Chanh dây": {
    ingredients: ["200ml whipping cream", "200ml sữa tươi không đường", "50g đường", "5g gelatin", "3 quả chanh dây"],
    steps: [
      "Ngâm gelatin vào nước lạnh cho mềm.",
      "Đun nóng nhẹ hỗn hợp sữa tươi, whipping cream và đường (không để sôi).",
      "Cho gelatin đã mềm vào hỗn hợp sữa, khuấy tan. Đổ ra hũ, để lạnh 3-4 tiếng cho đông.",
      "Làm sốt chanh dây: đun phần ruột chanh dây với chút đường cho sệt lại, để nguội.",
      "Rưới sốt chanh dây lên mặt Pannacotta và thưởng thức."
    ]
  },
  "Dâu tây nhúng Socola": {
    ingredients: ["10-15 quả dâu tây tươi", "100g socola đen", "20g socola trắng (để trang trí)"],
    steps: [
      "Rửa sạch dâu tây, giữ nguyên cuống và để thật khô.",
      "Chưng cách thủy socola đen cho tan chảy hoàn toàn.",
      "Cầm cuống dâu tây nhúng ngập 2/3 quả vào socola đen.",
      "Đặt lên giấy nến chờ đông. Đun chảy socola trắng rưới thêm những đường vân mỏng để trang trí."
    ]
  },
  "Bánh Tart Dâu tây": {
    ingredients: ["Đế bánh tart nướng sẵn", "100g dâu tây tươi", "100ml whipping cream", "50g cream cheese", "20g đường bột"],
    steps: [
      "Dâu tây rửa sạch, lau khô, thái lát mỏng vừa ăn.",
      "Đánh bông cream cheese cùng đường bột, sau đó cho whipping cream vào đánh cùng đến khi hỗn hợp đặc mịn.",
      "Phết phần kem vừa đánh vào lòng đế bánh tart.",
      "Xếp các lát dâu tây lên trên bề mặt kem sao cho đẹp mắt. Có thể rắc thêm chút đường bột."
    ]
  },
  "Smoothie Dâu tây": {
    ingredients: ["10 quả dâu tây tươi (hoặc đông lạnh)", "1/2 quả chuối chín", "100ml sữa tươi (hoặc sữa hạt)", "1 hộp sữa chua", "Đá viên"],
    steps: [
      "Rửa sạch dâu tây, cắt bỏ cuống. Chuối lột vỏ, xắt khúc.",
      "Cho tất cả dâu tây, chuối, sữa tươi, sữa chua và đá viên vào máy xay sinh tố.",
      "Xay ở tốc độ cao đến khi hỗn hợp nhuyễn mịn.",
      "Đổ ra ly, trang trí thêm lát dâu tươi và thưởng thức."
    ]
  },
  "Salad Dâu tây": {
    ingredients: ["100g dâu tây tươi", "100g rau xà lách/baby spinach", "50g phô mai feta hoặc mozzarella", "Quả óc chó/Hạnh nhân", "2 thìa giấm balsamic", "1 thìa dầu oliu"],
    steps: [
      "Rửa sạch rau xà lách, để ráo. Dâu tây cắt làm tư.",
      "Pha sốt trộn: giấm balsamic, dầu oliu, một chút muối và tiêu, khuấy đều.",
      "Cho rau xà lách, dâu tây, hạt óc chó và phô mai vào bát lớn.",
      "Rưới nước sốt lên trên, trộn nhẹ tay để rau không bị nát và dùng ngay."
    ]
  },
  "Bánh mì Chuối": {
    ingredients: ["3 quả chuối chín rục", "150g bột mì đa dụng", "100g đường", "75g bơ lạt (đun chảy)", "1 quả trứng", "1 muỗng cafe baking soda", "Hạt óc chó (tùy chọn)"],
    steps: [
      "Làm nóng lò ở 175°C. Chống dính khuôn bánh mì.",
      "Nghiền nhuyễn chuối trong bát lớn. Thêm bơ đun chảy, khuấy đều.",
      "Thêm baking soda và chút muối. Khuấy đều. Cho đường, trứng đập dập và chiết xuất vani vào trộn cùng.",
      "Thêm bột mì, trộn nhẹ nhàng đến khi vừa kết hợp (không trộn quá kỹ). Trộn thêm hạt óc chó nếu dùng.",
      "Đổ bột vào khuôn. Nướng 50-60 phút đến khi dùng tăm xăm thử thấy tăm sạch. Để nguội trước khi cắt."
    ]
  },
  "Sinh tố Chuối Bơ Đậu Phộng": {
    ingredients: ["1-2 quả chuối chín (đông lạnh càng ngon)", "2 muỗng canh bơ đậu phộng", "200ml sữa (sữa bò hoặc sữa hạt)", "1 thìa mật ong (tùy chọn)", "Đá viên"],
    steps: [
      "Cắt chuối thành từng miếng nhỏ.",
      "Cho chuối, bơ đậu phộng, sữa, mật ong và đá viên vào máy xay sinh tố.",
      "Xay nhuyễn đến khi hỗn hợp sánh mịn.",
      "Đổ ra ly, rắc thêm chút cacao vụn hoặc hạt chia lên trên để trang trí."
    ]
  },
  "Cơm chiên trái thơm": {
    ingredients: ["2 bát cơm nguội (cơm hơi khô)", "1/2 trái thơm (dứa) khoét ruột", "100g tôm sú/thịt gà xắt lựu", "50g hạt điều", "Hành tây, ớt chuông xắt lựu", "1 quả trứng", "Nước tương, hạt nêm, bột cà ri"],
    steps: [
      "Trái thơm bổ dọc, khoét lấy phần thịt dứa (xắt lựu) và giữ lại vỏ để đựng cơm.",
      "Xào sơ tôm/thịt gà với chút hạt nêm cho chín tới, trút ra bát.",
      "Phi thơm hành củ, cho trứng vào đánh tơi, sau đó cho cơm nguội vào đảo tơi. Rắc thêm chút bột cà ri cho có màu vàng đẹp mắt.",
      "Cho dứa xắt lựu, ớt chuông, hành tây, tôm/gà và hạt điều vào chảo cơm, đảo đều tay.",
      "Nêm nếm nước tương, gia vị vừa ăn. Múc cơm ra vỏ trái thơm, rắc hành ngò lên trên."
    ]
  },
  "Sushi Gạo lứt": {
    ingredients: ["1 bát cơm gạo lứt (nấu hơi dẻo)", "Lá rong biển (Nori)", "Dưa leo, cà rốt thái sợi dài", "Trứng chiên mỏng thái sợi", "Xúc xích/Thanh cua (tùy chọn)", "Giấm trộn sushi, mè rang"],
    steps: [
      "Trộn cơm gạo lứt còn ấm với 1-2 thìa giấm sushi và mè rang, để nguội bớt.",
      "Trải lá rong biển lên mành tre. Dàn đều một lớp cơm gạo lứt mỏng lên lá rong biển (chừa lại một viền nhỏ ở mép).",
      "Xếp các nguyên liệu nhân (dưa leo, cà rốt, trứng, thanh cua) theo chiều ngang.",
      "Cuộn chặt mành tre lại thành cuộn tròn đều.",
      "Dùng dao sắc nhúng qua nước (để không bị dính) cắt sushi thành từng khoanh vừa ăn."
    ]
  }
};

const getSmartPairings = (product: Product) => {
  const name = product.name.toLowerCase();
  if (name.includes('chanh dây') || name.includes('passion')) {
    return [
      { name: "Sữa chua Chanh dây", image: "/api/uploads/pairing_yogurt.png", tip: "Vị chua thanh của chanh dây rưới trên lớp sữa chua béo ngậy, cực kỳ bắt miệng." },
      { name: "Cheesecake Chanh dây", image: "/api/uploads/pairing_pf_cheesecake.png", tip: "Lớp phô mai mềm mịn kết hợp với thạch chanh dây chua ngọt hoàn hảo." },
      { name: "Mojito Chanh dây", image: "/api/uploads/pairing_pf_mojito.png", tip: "Thức uống giải khát tuyệt đỉnh với bạc hà, chanh và chanh dây tươi mát." },
      { name: "Pannacotta Chanh dây", image: "/api/uploads/pairing_pf_pannacotta.png", tip: "Món tráng miệng thanh lịch, núng nính với lớp mứt chanh dây vàng óng." }
    ];
  }
  if (name.includes('dâu tây') || name.includes('strawberry')) {
    return [
      { name: "Dâu tây nhúng Socola", image: "/api/uploads/pairing_chocolate.png", tip: "Sự kết hợp kinh điển giữa dâu tây mọng nước và socola đắng nhẹ." },
      { name: "Bánh Tart Dâu tây", image: "/api/uploads/pairing_st_tart.png", tip: "Đế bánh giòn rụm, kem trứng béo ngậy và dâu tây tươi cắt lát." },
      { name: "Smoothie Dâu tây", image: "/api/uploads/pairing_st_smoothie.png", tip: "Sinh tố dâu tây mát lạnh, xay cùng sữa chua và chút mật ong." },
      { name: "Salad Dâu tây", image: "/api/uploads/pairing_st_salad.png", tip: "Salad rau bó xôi, dâu tây tươi và giấm Balsamic thanh nhẹ." }
    ];
  }
  if (name.includes('chuối') || name.includes('banana')) {
    return [
      { name: "Bánh mì Chuối", image: "https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=600&auto=format&fit=crop", tip: "Bánh mì chuối nướng thơm lừng, mềm ẩm." },
      { name: "Sinh tố Chuối Bơ Đậu Phộng", image: "https://images.unsplash.com/photo-1526424382096-74a93e105682?q=80&w=600&auto=format&fit=crop", tip: "Thức uống giàu năng lượng cho bữa sáng." }
    ];
  }
  if (name.includes('gạo') || name.includes('rice')) {
    return [
      { name: "Cơm chiên trái thơm", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600&auto=format&fit=crop", tip: "Cơm hạt dài chiên cùng dứa và hải sản tươi ngon." },
      { name: "Sushi Gạo lứt", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop", tip: "Món ăn thanh đạm, giàu dinh dưỡng với gạo lứt dẻo." }
    ];
  }
  return product.pairings || [];
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: ProductService.getAll
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => ProductService.getBySlug(slug!),
    enabled: !!slug
  });

  useEffect(() => {
    if (product) {
      setSelectedSize(product.size);
      setActiveImage(product.image);
      setQuantity(1);
    }
  }, [product?.id]); // Reset only when product ID actually changes

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Sản phẩm không tìm thấy</h1>
          <Link to="/shop" className="btn-primary">Quay lại Shop</Link>
        </div>
      </div>
    );
  }

  const otherProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const currentIndex = allProducts.findIndex((p) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
  const nextProduct = currentIndex !== -1 && currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null;

  const activeOptions = product.options && product.options.length > 0 
    ? [{ size: product.size, price: product.price }, ...product.options].filter((v, i, a) => a.findIndex(t => (t.size === v.size)) === i)
    : [];
  
  const selectedVariant = activeOptions.find(opt => opt.size === selectedSize);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  // Deduplicate and combine all images (Main image + additional images)
  const allImages = Array.from(new Set([product.image, ...(product.images || [])]));

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      size: selectedSize || product.size,
      price: displayPrice
    };
    
    addItem(itemToAdd, quantity);
    
    toast.custom((t) => (
      <div className="bg-white rounded-[1.5rem] shadow-2xl border border-black/5 p-5 w-[90vw] md:w-[380px] flex flex-col gap-5 animate-in slide-in-from-top-10 duration-500">
        <div className="flex items-center justify-between">
          <h4 className="font-mono-accent text-[14px] text-foreground">Đã thêm sản phẩm vào giỏ hàng</h4>
          <button onClick={() => toast.dismiss(t)} className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>
        
        <div className="flex gap-5">
          <div className="size-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-sm">
            <img src={product.image} alt={`${product.name} - nông sản truy xuất nguồn gốc Daklink`} className="size-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h5 className="font-semibold text-[15px] text-foreground leading-tight line-clamp-2 mb-1">{product.name}</h5>
            <p className="text-sm text-muted-foreground mb-2">{itemToAdd.size}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="product-price text-primary text-lg">{formatPrice(itemToAdd.price)}</span>
              <span className="text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">x{quantity}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            toast.dismiss(t);
            navigate("/checkout");
          }}
          className="w-full py-4 rounded-2xl border-2 border-border bg-white hover:bg-muted font-bold text-[15px] transition-all duration-300 text-center active:scale-[0.98]"
        >
          Xem giỏ hàng
        </button>
      </div>
    ), { duration: 4000 });
  };

  const handleBuyNow = () => {
    const itemToAdd = {
      ...product,
      size: selectedSize || product.size,
      price: displayPrice
    };
    
    addItem(itemToAdd, quantity);
    navigate("/checkout");
  };

  const handleNextImage = () => {
    const currentIndex = allImages.indexOf(activeImage || product.image);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setActiveImage(allImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = allImages.indexOf(activeImage || product.image);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setActiveImage(allImages[prevIndex]);
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between overflow-x-hidden">
        <div className="flex items-center gap-2 font-mono-accent text-[11px] text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">SẢN PHẨM</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 font-mono-accent text-[11px]">
          {prevProduct && (
            <Link to={`/product/${prevProduct.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="size-4" /> Trước
            </Link>
          )}
          {prevProduct && nextProduct && <span className="text-border">|</span>}
          {nextProduct && (
            <Link to={`/product/${nextProduct.slug}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-semibold">
              Tiếp <ChevronRight className="size-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Product Detail */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 pb-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 w-full">
          {/* Left - Image Gallery */}
          <FadeIn className="w-full">
            <div className="relative">
              <div className="relative group bg-muted rounded-2xl overflow-hidden aspect-[4/5] mb-4 shadow-sm border border-black/[0.03]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage || product.image}
                    src={activeImage || product.image}
                    alt={`${product.name} - sản phẩm nông sản sạch Daklink`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -50) handleNextImage();
                      else if (info.offset.x > 50) handlePrevImage();
                    }}
                    className="size-full object-cover cursor-grab active:cursor-grabbing"
                  />
                </AnimatePresence>

                {/* Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white opacity-0 md:group-hover:opacity-100 transition-opacity border border-white/30 z-10"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white opacity-0 md:group-hover:opacity-100 transition-opacity border border-white/30 z-10"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  </>
                )}
              </div>
              
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveImage(img)}
                      className={`size-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all duration-300 ${
                        (activeImage || product.image) === img ? 'border-primary shadow-md opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} - hình ảnh chi tiết sản phẩm ${i + 1}`} className="size-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Right - Info */}
          <FadeIn delay={0.1} className="w-full">
            <div>
              <h1 className="font-semibold text-foreground mb-3 leading-tight tracking-tight">{product.name}</h1>
              
              <div className="flex items-end gap-2 mb-1">
                <p className="product-price text-primary text-2xl">{formatPrice(displayPrice)}</p>
                {selectedSize && <span className="text-muted-foreground text-sm mb-1">/ {selectedSize}</span>}
              </div>
              <p className="text-muted-foreground/50 text-[8px] font-medium uppercase tracking-wider mb-6">Đã bao gồm Thuế</p>

              {/* Product Short Description / Quote */}
              <div className="mb-6 pl-4 border-l-[3px] border-border py-1">
                <p className="text-muted-foreground text-[14px] italic leading-relaxed">"{product.description}"</p>
              </div>

              {/* Size */}
              {activeOptions.length > 0 && (
                <div className="mb-4 mt-6">
                  <label className="font-mono-accent text-[11px] text-foreground mb-2 block">Size *</label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {activeOptions.map((opt) => (
                      <button
                        key={opt.size}
                        onClick={() => setSelectedSize(opt.size)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                          selectedSize === opt.size 
                            ? 'border-primary bg-primary/10 text-primary font-semibold' 
                            : 'border-border text-foreground hover:bg-muted'
                        }`}
                      >
                        {opt.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5 mt-5">
                <label className="font-mono-accent text-[11px] text-foreground mb-2 block">Thêm số lượng</label>
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
                    className="size-10 flex items-center justify-center rounded-xl bg-white border border-black/10 hover:bg-muted transition-all active:scale-95 shadow-sm"
                  >
                    <Minus className="size-4 text-muted-foreground" />
                  </button>
                  <div className="h-10 w-20 flex items-center justify-center rounded-xl bg-white border border-black/10 shadow-sm">
                    <span className="text-base font-bold">{quantity}</span>
                  </div>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)} 
                    className="size-10 flex items-center justify-center rounded-xl bg-white border border-black/10 hover:bg-muted transition-all active:scale-95 shadow-sm"
                  >
                    <Plus className="size-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="mb-4 mt-10">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-[#0a2319] text-white py-5 rounded-2xl font-mono-accent text-[15px] transition-all duration-300 hover:bg-[#0a2319]/90 hover:shadow-xl hover:shadow-[#0a2319]/20 flex items-center justify-center gap-3 active:scale-[0.98]" 
                >
                  <ShoppingCart className="size-5" /> THÊM VÀO GIỎ HÀNG
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Description */}
      <section className="w-full max-w-6xl mx-auto px-6 md:px-10 pb-12">
        <FadeIn className="w-full">
          <div className="bg-[#EAE8E1] rounded-2xl p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Đặc điểm nổi bật:</h3>
                
                {product.flavorNotes && (
                  <p className="text-foreground font-semibold mb-6 leading-relaxed">{product.flavorNotes}</p>
                )}

                <div className="space-y-4 text-sm mt-6">
                  {Object.entries({
                    "TÊN QUỐC GIA": product.origin?.country,
                    "VÙNG ĐẤT": product.origin?.region,
                    "NÔNG HỘ": product.origin?.farmer,
                    "ĐỘ CAO": product.origin?.altitude,
                    "NÔNG TRẠI": product.origin?.farm,
                    "GIỐNG": product.origin?.variety,
                    "QUY TRÌNH": product.origin?.process,
                  }).map(([label, value]) => {
                    if (!value || value === "---") return null;
                    return (
                      <div key={label} className="flex gap-4">
                        <span className="text-foreground font-bold min-w-[120px] uppercase text-[13px]">{label}:</span>
                        <span className="text-foreground font-medium">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Câu chuyện</h3>
                {product.story ? (
                  <p className="text-[#333333] text-[15px] leading-[1.8] text-justify whitespace-pre-line">{product.story}</p>
                ) : (
                  <p className="text-[#333333] text-[15px] leading-[1.8] text-justify">{product.description}</p>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* TRUY XUẤT NGUỒN GỐC - Highlight section */}
      {product.traceability && product.traceability.length > 0 && (
        <section className="w-full max-w-6xl mx-auto px-6 md:px-10 pb-16">
          <FadeIn className="w-full">
            <div className="bg-primary/5 border-2 border-primary/20 rounded-3xl p-6 md:p-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                  <MapPin className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-mono-accent text-[11px] text-primary">
                    TRUY XUẤT NGUỒN GỐC
                  </p>
                </div>
              </div>
              <h2 className="font-semibold text-foreground mb-2">
                Hành trình số Daklink
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-xl leading-relaxed">
                Theo dõi hành trình từng hạt cà phê - từ lúc gieo hạt đến khi giao tận tay bạn. 
                Mọi bước đều được ghi nhận và xác thực.
              </p>

              {/* Timeline */}
              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-primary/20" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-3">
                  {product.traceability.map((step: any, i: number) => {
                    const StageIcon = stageIcons[step.stage] || Leaf;
                    return (
                      <FadeIn key={step.id || i} delay={i * 0.08}>
                        <div className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0">
                          {/* Icon circle */}
                          <div className="relative z-10 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg md:mb-3">
                            <StageIcon className="size-5" />
                          </div>
                          
                          {/* Content */}
                          <div className="md:text-center flex-1">
                            <p className="font-mono text-[10px] text-primary mb-1">{step.date}</p>
                            <h4 className="font-semibold text-foreground mb-1">{step.stage}</h4>
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
      )}

      {/* Serving Suggestions / Pairings */}
      {product && getSmartPairings(product).length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-16">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="font-mono-accent text-[11px] text-primary mb-3">THƯỞNG THỨC TRỌN VẸN</p>
              <h2 className="font-semibold text-foreground tracking-tight">Gợi ý kết hợp</h2>
            </div>
            
            <div className="flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory scrollbar-hide -mx-5 px-5">
              {getSmartPairings(product).map((pairing, index) => (
                <div key={index} className="shrink-0 w-[260px] md:w-[300px] snap-center group cursor-pointer" onClick={() => setSelectedRecipe(pairing)}>
                  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-black/[0.03]">
                      {/* Image prioritized at Top (approx 75% of card) */}
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img 
                          src={pairing.image} 
                          alt={`${pairing.name} - gợi ý kết hợp với ${product.name}`}
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Subtle Hover Button */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="bg-white/90 backdrop-blur-xl px-7 py-3 rounded-full font-bold text-sm text-foreground shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            Xem công thức
                          </div>
                        </div>
                      </div>
                      
                      {/* Text Section Bellow */}
                      <div className="p-6 flex flex-col flex-grow">
                      <div className="text-[16px] font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors leading-tight">
                          {pairing.name}
                      </div>
                        <div className="flex justify-between items-end gap-4">
                          <p className="text-muted-foreground text-[13px] leading-relaxed line-clamp-2 flex-1">
                            {pairing.tip}
                          </p>
                          <div className="size-10 rounded-xl bg-[#F9F9F9] flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                             <ChevronRight className="size-5" />
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      {/* Related products */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <FadeIn>
          <h2 className="font-semibold text-foreground mb-8 tracking-tight">Sản phẩm khác</h2>
          <div className="flex overflow-x-auto gap-6 md:gap-8 pb-8 snap-x snap-mandatory scrollbar-hide -mx-5 px-5">
            {otherProducts.map((p, i) => (
              <div key={p.id} className="shrink-0 w-[240px] md:w-[280px] snap-center">
                <FadeIn delay={i * 0.05}>
                  <ProductCard product={p} />
                </FadeIn>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedRecipe(null)} />
          
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
            
            {/* Header Image Section */}
            <div className="relative w-full h-[240px] md:h-[380px] shrink-0">
              <img src={selectedRecipe.image} alt={`Công thức ${selectedRecipe.name} - gợi ý từ Daklink`} className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-6 size-10 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/40 transition-all z-20"
              >
                <X className="size-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pb-4 md:pb-6">
                <h3 className="font-semibold text-foreground tracking-tight">{selectedRecipe.name}</h3>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-4 md:pt-6">
              <div className="grid md:grid-cols-[1fr_1.8fr] gap-10 md:gap-16 items-start">
                
                {/* Left Column: Ingredients Card */}
                <div className="bg-[#F6F5F2] rounded-[2rem] p-8 border border-black/5">
                  <div className="flex items-center gap-2 mb-8">
                    <span className="text-xl">🍴</span>
                    <h4 className="font-semibold text-[13px] uppercase tracking-[0.15em] text-foreground/80">Nguyên liệu</h4>
                  </div>
                  
                  {recipes[selectedRecipe.name] ? (
                    <ul className="space-y-4 mb-10">
                      {recipes[selectedRecipe.name].ingredients.map((ing: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-muted-foreground leading-relaxed">
                          <span className="size-1.5 rounded-full bg-black/20 mt-2 shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="py-10 text-center opacity-30 italic text-sm">Đang cập nhật...</div>
                  )}

                  <div className="pt-6 border-t border-black/[0.06] text-[13px] text-muted-foreground">
                    Thời gian: <span className="font-bold text-foreground ml-1">15 phút</span>
                  </div>
                </div>

                {/* Right Column: Instructions */}
                <div>
                  <h4 className="font-semibold text-lg text-foreground mb-10">Cách thực hiện:</h4>
                  
                  {recipes[selectedRecipe.name] ? (
                    <div className="space-y-10">
                      {recipes[selectedRecipe.name].steps.map((step: string, i: number) => (
                        <div key={i} className="flex gap-8 group">
                          <span className="text-4xl font-bold text-black/[0.08] shrink-0 leading-none group-hover:text-primary/20 transition-colors">
                            {i + 1}
                          </span>
                          <p className="text-[15px] text-muted-foreground leading-relaxed group-hover:text-foreground transition-all duration-300">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-black/[0.02] rounded-3xl border border-dashed border-black/10">
                      <Loader2 className="size-8 animate-spin text-primary/20 mb-4" />
                      <p className="text-muted-foreground text-sm">Đang tải công thức chi tiết...</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
