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
      <div className="h-16" style={{ background: 'linear-gradient(to bottom, #E6E5E4, #621618)' }} />
      <MVVSection />
      <ServicosSection />
      <CasesSection />
      <ContatoSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
