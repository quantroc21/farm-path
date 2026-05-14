import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const NewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-background flex flex-col w-full overflow-x-clip">
=======
    <div className="min-h-screen bg-background flex flex-col w-full" style={{ overflowX: 'clip' }}>
>>>>>>> Stashed changes
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default NewLayout;
