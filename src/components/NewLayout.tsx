import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const NewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full overflow-x-clip">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default NewLayout;
