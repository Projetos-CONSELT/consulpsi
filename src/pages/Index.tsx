/* Assinatura Digital Conselt - Empresa Junior de Consultoria em Engenharia Elétrica */
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
      <div className="h-24 relative" style={{ backgroundColor: '#66141B' }}>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)', backgroundColor: '#E6E5E4' }} />
      </div>
      <QuemSomosSection />
      <div className="h-16 relative" style={{ backgroundColor: '#E6E5E4' }}>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)', backgroundColor: '#66141B' }} />
      </div>
      <MVVSection />
      <div className="h-16 relative" style={{ backgroundColor: '#66141B' }}>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)', backgroundColor: '#E6E5E4' }} />
      </div>
      <ServicosSection />
      <div className="h-16 relative" style={{ backgroundColor: '#E6E5E4' }}>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)', backgroundColor: '#66141B' }} />
      </div>
      <CasesSection />
      <div className="h-16 relative" style={{ backgroundColor: '#66141B' }}>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)', backgroundColor: '#E6E5E4' }} />
      </div>
      <ContatoSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
