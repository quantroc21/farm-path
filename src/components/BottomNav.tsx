import { Home, User, PenSquare, Search, QrCode } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { path: "/", icon: Home, label: "Trang chủ" },
    { url: "https://app.daklink.vn/login", icon: User, label: "Nông dân" },
    { path: "/update", icon: PenSquare, label: "Cập nhật" },
    { url: "https://app.daklink.vn/trace", icon: Search, label: "Truy xuất" },
    { path: "/qr", icon: QrCode, label: "QR" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        {tabs.map(({ path, url, icon: Icon, label }) => {
          const isActive = path ? location.pathname === path : false;
          const content = (
            <>
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-accent/10" : ""}`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </>
          );

          if (url) {
            return (
              <a
                key={url}
                href={url}
                className="flex flex-col items-center gap-1 min-w-[56px] py-2 px-3 rounded-2xl transition-all duration-200 text-muted-foreground hover:text-foreground"
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              key={path}
              to={path!}
              className={`flex flex-col items-center gap-1 min-w-[56px] py-2 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
