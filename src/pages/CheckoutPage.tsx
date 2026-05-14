import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/productData";
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { toast } from "sonner";
import { LandingService } from "@/services/landing.service";

const CheckoutPage = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod"
  });

  const subtotal = totalPrice();
  const shipping = items.length > 0 ? 30000 : 0; // Default flat rate for demo
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customerName: `${formData.lastName} ${formData.firstName}`.trim(),
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerNote: formData.note,
        paymentMethod: formData.paymentMethod,
        subtotal,
        shippingFee: shipping,
        totalAmount: total,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };

      const result = await LandingService.createOrder(orderData);
      
      if (result.success) {
        setIsSuccess(true);
        clearCart();
        toast.success("Đặt hàng thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Không thể kết nối với máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-5">
        <FadeIn className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Cảm ơn bạn đã đặt hàng!</h1>
          <p className="text-muted-foreground mb-8">
            Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận giao hàng.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/shop" className="btn-primary w-full py-4 text-base font-bold">
              Tiếp tục mua sắm
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Quay về trang chủ
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Link to="/shop" className="btn-primary px-8">
          Đi đến cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-16 overflow-hidden">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-8 group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Tiếp tục mua sắm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full">
        {/* Right: Summary (Top on Mobile) */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <FadeIn delay={0.1} className="w-full">
            <div className="bg-card rounded-3xl border border-border/60 p-6 md:p-8 shadow-sm h-fit lg:sticky lg:top-32">
              <h2 className="text-xl font-bold text-foreground mb-6">Sản phẩm ({items.length})</h2>
              
              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground truncate">{item.name}</h4>
                      {item.size && <p className="text-[10px] text-primary font-semibold">{item.size}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">{formatPrice(item.price)} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-lg scale-90">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id, item.size)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Vận chuyển
                  </span>
                  <span className="font-bold text-foreground">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg md:text-xl font-black text-primary pt-3 border-t border-dashed border-border mt-3">
                  <span>TỔNG TIỀN</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <p className="text-[10px] text-center text-muted-foreground">
                  * Nhấn đặt hàng đồng nghĩa với việc bạn đồng ý với Điều khoản mua hàng của Daklink.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Left: Detailed Form Sections (Bottom on Mobile) */}
        <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
          <FadeIn className="w-full">
            {/* Delivery Section */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 md:p-8 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Hình thức nhận hàng</h2>
              </div>
              <div className="p-4 rounded-2xl border-2 border-primary bg-primary/5 flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border-4 border-primary bg-white flex-shrink-0" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-bold text-foreground">Giao hàng tận nơi</span>
                </div>
              </div>
            </div>

            {/* Receiver Info Section */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 md:p-8 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Thông tin người nhận</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Họ</label>
                    <input
                      required
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ"
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Tên</label>
                    <input
                      required
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Tên"
                      className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Số điện thoại</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Địa chỉ chi tiết</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường, phường/xã..."
                    className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 md:p-8 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Ghi chú</h2>
              </div>
              <textarea
                rows={3}
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Ví dụ: Giao trong giờ hành chính"
                className="w-full px-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              />
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 md:p-8 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Hình thức thanh toán</h2>
              </div>
              
              <div className="space-y-3">
                <div 
                  onClick={() => setFormData(p => ({ ...p, paymentMethod: 'bank' }))}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${formData.paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'bank' ? 'border-primary' : 'border-muted-foreground'}`}>
                      {formData.paymentMethod === 'bank' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                         <CheckCircle2 className="w-5 h-5 text-foreground" />
                       </div>
                       <span className={`font-bold text-sm ${formData.paymentMethod === 'bank' ? 'text-foreground' : 'text-muted-foreground'}`}>Chuyển khoản ngân hàng</span>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => setFormData(p => ({ ...p, paymentMethod: 'cod' }))}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'}`}>
                      {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                         <Truck className="w-5 h-5 text-foreground" />
                       </div>
                       <span className={`font-bold text-sm ${formData.paymentMethod === 'cod' ? 'text-foreground' : 'text-muted-foreground'}`}>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-5 rounded-[1.25rem] font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">Đang xử lý...</span>
              ) : (
                <span>THANH TOÁN ({items.length})</span>
              )}
            </button>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
