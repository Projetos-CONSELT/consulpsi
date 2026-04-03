import { motion } from "framer-motion";
import logoConsulpsi from "@/assets/logo-consulpsi.png";

const HeroSection = () => {
  const handleScrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-primary relative overflow-hidden pt-20"
    >
      {/* Subtle decorative elements */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 rounded-full bg-brand-medium/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-0 w-72 h-72 rounded-full bg-brand-dark/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Título principal — fonte simples, cor clara para contraste */}
            <motion.p
              className="font-body text-primary-foreground/80 text-xl mb-2 tracking-wide uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Consultoria em Psicologia
            </motion.p>

            {/* Subtítulo — fonte cursiva (Satisfy/Genty), cor amarela */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-accent leading-tight text-accent mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Desenvolvendo pessoas, impulsionando organizações
            </motion.h1>

            {/* Parágrafo descritivo — fonte body (Montserrat/Gatwick) */}
            <motion.p
              className="font-body text-primary-foreground/70 text-lg mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Somos uma empresa júnior com foco em Psicologia Organizacional e
              Recursos Humanos, dedicada a oferecer soluções estratégicas que
              potencializam o crescimento e o desempenho do seu negócio.
            </motion.p>

            {/* Botão com hover e zoom */}
            <motion.button
              onClick={() => handleScrollTo("#quem-somos")}
              className="inline-block bg-accent text-accent-foreground font-semibold font-body px-8 py-3 rounded-lg text-sm transition-all duration-300 ease-out hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 active:scale-95"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Saiba Mais
            </motion.button>
          </motion.div>

          {/* Logo circular do IDV */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center"
          >
            <motion.img
              src={logoConsulpsi}
              alt="Consulpsi Logo"
              className="w-72 md:w-80 lg:w-[26rem] drop-shadow-2xl"
              width={512}
              height={512}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
