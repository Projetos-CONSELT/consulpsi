import { motion } from "framer-motion";
import teamImage from "../../imagens/secao-2-equipe/equipe-consulpsi-secao-2.png";

const QuemSomosSection = () => {
  return (
    <section id="quem-somos" className="py-14 pb-25 relative" style={{ backgroundColor: "#E6E5E4" }}>
        
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-lg mb-2" style={{ color: "#D84444" }}>Conheça a Consulpsi</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading" style={{ color: "#621816" }}>Quem Somos</h2>
            <p className="mb-4 leading-relaxed text-justify" style={{ color: "#7C1D1D", fontFamily: "Araboto, sans-serif" }}>
              A Consulpsi é uma empresa júnior vinculada ao curso de Psicologia, especializada em consultoria e assessoria em Psicologia Organizacional e Recursos Humanos.
            </p>
            <p className="mb-8 leading-relaxed text-justify" style={{ color: "#7C1D1D", fontFamily: "Araboto, sans-serif" }}>
              Nossa missão é entregar soluções estratégicas e personalizadas que promovam o desenvolvimento humano e organizacional, aliando teoria e prática com excelência e comprometimento.
            </p>
            <a
              href="#contato"
              className="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:bg-brand-medium transition-colors text-sm"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              Fale Conosco
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              style={{ boxShadow: "0 0 30px 8px rgba(0, 0, 0, 0.5)" }}
              src={teamImage}
              alt="Equipe Consulpsi"
              className="rounded-2xl shadow-xl w-full object-cover max-h-[400px]"
              loading="lazy"
              width={1280}
              height={854}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuemSomosSection;
