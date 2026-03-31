import { motion } from "framer-motion";
import logo from "@/assets/logo-consulpsi.png";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center bg-secondary pt-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-accent text-brand-accent text-xl mb-2">Consultoria em Psicologia</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
              Transformando <span className="text-primary">pessoas</span> e organizações
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Somos uma empresa júnior especializada em Psicologia Organizacional e Recursos Humanos, oferecendo soluções estratégicas para o desenvolvimento do seu negócio.
            </p>
            <a
              href="#servicos"
              className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-brand-medium transition-colors text-sm"
              onClick={(e) => { e.preventDefault(); document.querySelector("#servicos")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              Saiba Mais
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <img src={logo} alt="Consulpsi Logo" className="w-64 md:w-80 lg:w-96 drop-shadow-2xl" width={512} height={512} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
