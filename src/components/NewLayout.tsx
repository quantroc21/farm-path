import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default NewLayout;
