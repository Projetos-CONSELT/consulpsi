import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import QuemSomosSection from "@/components/QuemSomosSection";
import MVVSection from "@/components/MVVSection";
import ServicosSection from "@/components/ServicosSection";
import CasesSection from "@/components/CasesSection";
import ContatoSection from "@/components/ContatoSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <QuemSomosSection />
      <div className="h-16 relative" style={{ backgroundColor: '#621618' }}>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)', backgroundColor: '#E6E5E4' }} />
      </div>
      <MVVSection />
      <div className="h-16 relative" style={{ backgroundColor: '#E6E5E4' }}>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%)', backgroundColor: '#621618' }} />
      </div>
      <ServicosSection />
      <CasesSection />
      <ContatoSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
