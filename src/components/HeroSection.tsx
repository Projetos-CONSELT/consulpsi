/* Assinatura Digital Conselt - Empresa Junior de Consultoria em Engenharia Elétrica */
import { motion } from "framer-motion";
import logoConsulpsi from "@/assets/logo-consulpsi-hero.png";

const HeroSection = () => {
  const handleScrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-[100svh] md:min-h-screen flex items-start md:items-center relative overflow-hidden pt-24 md:pt-20 pb-10 md:pb-0"
      style={{
        backgroundColor: "#66141B",
      }}
    >
      {/* Subtle radial overlay for depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, hsl(355 60% 30%) 0%, transparent 60%)",
        }}
      />

      {/* Decorative blurred orbs */}
      <motion.div
        className="absolute top-14 md:top-20 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl"
        style={{ background: "hsl(355 60% 35% / 0.12)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 md:bottom-10 left-0 w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full blur-3xl"
        style={{ background: "hsl(355 70% 24% / 0.2)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-9 sm:gap-10 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center md:text-left"
          >
            {/* Subtítulo superior */}
            <motion.p
              className="font-body text-primary-foreground/85 text-base sm:text-lg md:text-xl mb-2 sm:mb-3 tracking-[0.08em] uppercase font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Consultoria em Psicologia
            </motion.p>

            {/* Título script com destaque */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-accent leading-[1.15] text-[#FFB964] mb-6 md:mb-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Desenvolvendo pessoas, impulsionando organizações
            </motion.h1>

            {/* Parágrafo descritivo */}
            <motion.p
              className="font-body text-primary-foreground/75 text-base sm:text-lg mb-7 md:mb-9 max-w-xl md:max-w-lg mx-auto md:mx-0 leading-[1.75] tracking-[0.01em]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Somos uma empresa júnior com foco em Psicologia Organizacional e
              Recursos Humanos, dedicada a oferecer soluções estratégicas que
              potencializam o crescimento e o desempenho do seu negócio.
            </motion.p>

            {/* Botão CTA refinado */}
            <motion.button
              onClick={() => handleScrollTo("#quem-somos")}
              className="inline-flex items-center justify-center w-full sm:w-auto bg-[#FFB964] text-accent-foreground font-semibold font-body px-9 py-3.5 rounded-xl text-sm tracking-wide transition-all duration-300 ease-out shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(255,185,100,0.35)] hover:bg-[#FFB964]/90 active:scale-95"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Saiba Mais
            </motion.button>
          </motion.div>

          {/* Logo com glow sutil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center mt-2 md:mt-0"
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Glow behind logo */}
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-20 scale-110"
                style={{ background: "rgba(255, 185, 100, 0.3)" }}
              />
              <img
                src={logoConsulpsi}
                alt="Consulpsi Logo"
                className="w-56 sm:w-64 md:w-80 lg:w-[26rem] drop-shadow-[0_8px_30px_rgba(0,0,0,0.25)] relative z-10"
                width={512}
                height={512}
                fetchPriority="high"
                decoding="async"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
