/* Assinatura Digital Conselt - Empresa Junior de Consultoria em Engenharia Elétrica */
import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider";

const QuemSomosSection = lazy(() => import("@/components/QuemSomosSection"));
const MVVSection = lazy(() => import("@/components/MVVSection"));
const ServicosSection = lazy(() => import("@/components/ServicosSection"));
const CasesSection = lazy(() => import("@/components/CasesSection"));
const ContatoSection = lazy(() => import("@/components/ContatoSection"));
const Footer = lazy(() => import("@/components/Footer"));
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));

const LoadingFallback = () => <div className="h-96 bg-background" />;

const Index = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <SectionDivider fromColor="#66141B" toColor="#E6E5E4" className="h-24 md:h-28" />
      
      <Suspense fallback={<LoadingFallback />}>
        <QuemSomosSection />
      </Suspense>
      
      <SectionDivider fromColor="#E6E5E4" toColor="#66141B" className="h-16 md:h-20" />
      
      <Suspense fallback={<LoadingFallback />}>
        <MVVSection />
      </Suspense>
      
      <SectionDivider fromColor="#66141B" toColor="#E6E5E4" className="h-16 md:h-20" />
      
      <Suspense fallback={<LoadingFallback />}>
        <ServicosSection />
      </Suspense>
      
      <SectionDivider fromColor="#E6E5E4" toColor="#66141B" className="h-16 md:h-20" />
      
      <Suspense fallback={<LoadingFallback />}>
        <CasesSection />
      </Suspense>
      
      <SectionDivider fromColor="#66141B" toColor="#E6E5E4" className="h-16 md:h-20" />
      
      <Suspense fallback={<LoadingFallback />}>
        <ContatoSection />
      </Suspense>
      
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
      
      <Suspense fallback={<div />}>
        <WhatsAppButton />
      </Suspense>
    </>
  );
};

export default Index;
