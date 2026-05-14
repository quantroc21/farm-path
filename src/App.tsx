import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NewLayout from "@/components/NewLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";
import AIChatWidget from "./components/AIChatWidget";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminLoginPage />} />
    <Route path="/dashboard" element={<AdminDashboardPage />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <AIChatWidget />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes - without NewLayout */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Main App Routes - with NewLayout */}
          <Route path="/*" element={
            <NewLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NewLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
