import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Leaf } from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "TRANG CHỦ" },
  { path: "/shop", label: "SẢN PHẨM" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 text-center hidden md:block">
        <span>Chào mừng đến với Eden Hub Coffee — Minh bạch từ nông trại đến tay bạn</span>
        <span className="mx-4">|</span>
        <span>Email: contact@edenhub.vn</span>
        <span className="mx-4">|</span>
        <span>Hotline: +84 908 998 998</span>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-lg text-foreground tracking-tight block" style={{ fontFamily: "'Playfair Display', serif" }}>
              EDEN HUB
            </span>
            <span className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase">Coffee</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            <Search className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-5 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-semibold py-2 ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
