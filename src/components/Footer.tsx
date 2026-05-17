import { Link } from "react-router-dom";
import { Leaf, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#011C14] text-white w-full overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link to="/" className="inline-block mb-8">
              <img src="/logo-transparent.png" alt="Daklink Logo" width="188" height="80" className="h-20 w-auto object-contain brightness-110 saturate-[1.1]" />
            </Link>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xs mb-8">
              Minh bạch từ nông trại đến tay bạn. Truy xuất nguồn gốc nông sản Việt Nam.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all border border-white/10">
                <Facebook className="w-5 h-5 text-white/80" />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all border border-white/10">
                <Instagram className="w-5 h-5 text-white/80" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:pt-4">
            <h4 className="font-mono-accent text-xs mb-6 text-white/40">Shop</h4>
            <ul className="space-y-4 text-white/80 text-[15px] font-medium">
              <li><Link to="/shop" className="hover:text-white hover:pl-2 transition-all">Tất cả sản phẩm</Link></li>
              <li><Link to="/shop" className="hover:text-white hover:pl-2 transition-all">Ớt Tươi Chọn Lọc</Link></li>
              <li><Link to="/shop" className="hover:text-white hover:pl-2 transition-all">Ớt Khô & Chế Biến</Link></li>
            </ul>
          </div>

          {/* Terms */}
          <div className="md:pt-4">
            <h4 className="font-mono-accent text-xs mb-6 text-white/40">Điều khoản</h4>
            <ul className="space-y-4 text-white/80 text-[15px] font-medium">
              <li><a href="#" className="hover:text-white hover:pl-2 transition-all">Điều khoản & điều kiện</a></li>
              <li><a href="#" className="hover:text-white hover:pl-2 transition-all">Bảo mật thông tin</a></li>
              <li><a href="#" className="hover:text-white hover:pl-2 transition-all">Phương thức thanh toán</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:pt-4">
            <h4 className="font-mono-accent text-xs mb-6 text-white/40">Liên hệ</h4>
            <ul className="space-y-4 text-white/80 text-[15px] font-medium">
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="group-hover:text-white transition-colors">support@daklink.vn</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="group-hover:text-white transition-colors">+84 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-mono-accent text-white/40 text-xs mb-1">
              DAKLINK - Nông sản hữu cơ Việt Nam
            </p>
            <p className="text-white/20 text-[10px]">
              Copyright © 2026 Daklink. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6 font-mono-accent text-[10px] text-white/20">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
