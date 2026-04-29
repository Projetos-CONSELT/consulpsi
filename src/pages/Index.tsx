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
import SectionDivider from "@/components/SectionDivider";

const Index = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <SectionDivider fromColor="#66141B" toColor="#E6E5E4" className="h-24 md:h-28" />
      <QuemSomosSection />
      <SectionDivider fromColor="#E6E5E4" toColor="#66141B" className="h-16 md:h-20" />
      <MVVSection />
      <SectionDivider fromColor="#66141B" toColor="#E6E5E4" className="h-16 md:h-20" />
      <ServicosSection />
      <SectionDivider fromColor="#E6E5E4" toColor="#66141B" className="h-16 md:h-20" />
      <CasesSection />
      <SectionDivider fromColor="#66141B" toColor="#E6E5E4" className="h-16 md:h-20" />
      <ContatoSection />
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Index;
