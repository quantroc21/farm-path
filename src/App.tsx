import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NewLayout from "@/components/NewLayout";
import HomePage from "./pages/HomePage";
import AIChatWidget from "./components/AIChatWidget";
import ScrollToTop from "./components/ScrollToTop";

// Lazy Loaded Routes
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div></div>}>
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
