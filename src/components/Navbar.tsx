import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const navItems = [
  { path: "/", label: "TRANG CHỦ" },
  { path: "/shop", label: "SẢN PHẨM" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300">
      {/* Main nav */}
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 md:h-24 px-6 md:px-10">
        
        {/* LEFT SECTION: Mobile Menu Button (MD-) / Desktop Logo (MD+) */}
        <div className="flex items-center w-1/4 md:w-auto">
          <button
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
          
          {/* Desktop Logo - Hidden on mobile, shown on MD+ */}
          <Link to="/" className="hidden md:flex items-center group">
            <img 
              src="/logo-transparent.png" 
              alt="Daklink Logo" 
              className="h-[68px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
        </div>

        {/* CENTER SECTION: Mobile Logo (MD-) / Desktop Nav Links (MD+) */}
        <div className="flex justify-center items-center">
          {/* Mobile Logo - Shown on mobile, hidden on MD+ */}
          <Link to="/" className="md:hidden flex items-center">
            <img src="/logo-transparent.png" alt="Daklink Logo" className="h-[68px] w-auto object-contain" />
          </Link>
          
          {/* Desktop Nav Links - Hidden on mobile, shown on MD+ */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-bold tracking-widest transition-colors hover:text-primary ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                } group`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                  location.pathname === item.path ? "w-full" : ""
                }`}></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT SECTION: Actions (Always shown) */}
        <div className="flex items-center justify-end w-1/4 md:w-auto gap-2 md:gap-5">
          <button className="p-2 text-muted-foreground hover:text-primary transition-all hover:scale-110 hidden md:block">
            <Search className="w-5 h-5" />
          </button>
          
          <Link 
            to="/checkout" 
            className="relative p-2 text-muted-foreground hover:text-primary transition-all hover:scale-110 group"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#FF4D1C] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-md transform translate-x-1 -translate-y-1">
                {totalItems}
              </span>
            )}
          </Link>
          
          <a 
            href="https://app.daklink.vn/login" 
            className="hidden lg:flex items-center px-6 py-2.5 bg-[#004225] text-white rounded-full text-xs font-black tracking-wider uppercase hover:bg-[#005a32] hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            ĐỐI TÁC
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-5 py-6 space-y-5 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block text-lg font-bold py-1 ${
                location.pathname === item.path ? "text-primary border-l-4 border-primary pl-3" : "text-muted-foreground pl-4"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 px-4">
            <a 
              href="https://app.daklink.vn/login" 
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-2xl text-lg font-black shadow-lg"
            >
              TRỞ THÀNH ĐỐI TÁC
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
