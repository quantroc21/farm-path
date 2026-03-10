import { Link } from "react-router-dom";
import { Leaf, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-purple-dark text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                Eden Hub Coffee
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Minh bạch từ nông trại đến tay bạn. Truy xuất nguồn gốc nông sản Việt Nam.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5 text-white/70 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Espresso</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Hand Brew</Link></li>
            </ul>
          </div>

          {/* Terms */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Điều khoản</h4>
            <ul className="space-y-2.5 text-white/70 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản & điều kiện</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bảo mật thông tin</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Phương thức thanh toán</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Liên hệ</h4>
            <ul className="space-y-2.5 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>28B Đường 109, Phước Long B, TP. Thủ Đức, HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+84 908 998 998</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@edenhub.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/50 text-xs">
            CÔNG TY CỔ PHẦN NÔNG TRANG EDEN · MST: 0314596915
          </p>
          <p className="text-white/40 text-xs mt-1">
            Copyright © 2026 Eden Hub Coffee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
