import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Brain, ClipboardList, BarChart3, Lightbulb, GraduationCap, X } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Recrutamento e Seleção",
    brief: "Processos seletivos estratégicos e assertivos.",
    detail: "Conduzimos processos seletivos completos, desde a definição do perfil até a seleção final, utilizando ferramentas psicológicas validadas para encontrar os melhores talentos para sua organização.",
  },
  {
    icon: Brain,
    title: "Saúde Mental no Trabalho",
    brief: "Programas de bem-estar e prevenção.",
    detail: "Desenvolvemos programas de promoção de saúde mental no ambiente de trabalho, incluindo palestras, workshops e avaliações de clima organizacional focadas no bem-estar dos colaboradores.",
  },
  {
    icon: ClipboardList,
    title: "Avaliação de Desempenho",
    brief: "Métricas e feedbacks estruturados.",
    detail: "Implementamos sistemas de avaliação de desempenho personalizados, com métricas claras e processos de feedback que promovem o desenvolvimento contínuo dos colaboradores.",
  },
  {
    icon: BarChart3,
    title: "Pesquisa de Clima",
    brief: "Diagnóstico organizacional profundo.",
    detail: "Realizamos pesquisas de clima organizacional utilizando metodologias científicas para mapear a satisfação, engajamento e identificar oportunidades de melhoria na sua empresa.",
  },
  {
    icon: Lightbulb,
    title: "Treinamento e Desenvolvimento",
    brief: "Capacitação e crescimento profissional.",
    detail: "Planejamos e executamos programas de treinamento sob medida, focados no desenvolvimento de competências técnicas e comportamentais alinhadas aos objetivos da organização.",
  },
  {
    icon: GraduationCap,
    title: "Consultoria em RH",
    brief: "Estratégias completas de gestão de pessoas.",
    detail: "Oferecemos consultoria estratégica em Recursos Humanos, auxiliando na estruturação de políticas, processos e práticas de gestão de pessoas para organizações de todos os portes.",
  },
];

const ServicosSection = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="servicos" className="py-20" style={{ backgroundColor: '#E6E5E4' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-accent text-brand-accent text-lg mb-2">O que fazemos</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#621618' }}>Nossos Serviços</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, i) => (
            <motion.button
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(i)}
              className="bg-secondary rounded-xl p-6 text-left hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <service.icon className="text-primary mb-4 group-hover:text-brand-light transition-colors" size={36} />
              <h3 className="font-bold text-foreground text-lg mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.brief}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-8 max-w-lg w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
              {(() => {
                const s = services[selected];
                return (
                  <>
                    <s.icon className="text-primary mb-4" size={48} />
                    <h3 className="text-2xl font-bold text-foreground mb-4">{s.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-body">{s.detail}</p>
                    <a
                      href="#contato"
                      className="inline-block mt-6 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-brand-medium transition-colors text-sm"
                      onClick={(e) => { e.preventDefault(); setSelected(null); document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" }); }}
                    >
                      Solicitar Orçamento
                    </a>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicosSection;
