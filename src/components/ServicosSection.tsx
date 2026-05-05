/* Assinatura Digital Conselt - Empresa Junior de Consultoria em Engenharia Elétrica */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Brain, ClipboardList, BarChart3, Lightbulb, GraduationCap, X } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Processo Seletivo",
    brief: "Recrutamento estratégico e assertivo.",
    detail: "Conduzimos processos seletivos completos e estruturados, utilizando instrumentos psicológicos validados para identificar os candidatos mais alinhados aos valores e competências da sua organização. Desde a definição do perfil até a seleção final, garantimos contratações de alta qualidade que impactam positivamente os resultados.",
  },
  {
    icon: Brain,
    title: "Pesquisa de Satisfação",
    brief: "Diagnóstico do clima organizacional.",
    detail: "Realizamos pesquisas aprofundadas de satisfação e clima organizacional utilizando metodologias científicas rigorosas. Coletamos dados sobre engajamento, motivação e satisfação dos colaboradores, gerando insights valiosos que identificam pontos fortes e oportunidades de melhoria na gestão de pessoas.",
  },
  {
    icon: GraduationCap,
    title: "Treinamento, Desenvolvimento e Capacitação (TD&E)",
    brief: "Programas de capacitação contínua.",
    detail: "Desenvolvemos e implementamos programas de treinamento personalizados e alinhados aos objetivos estratégicos da organização. Nossos programas focam no desenvolvimento de competências técnicas e comportamentais, promovendo o crescimento profissional e aumentando a produtividade e satisfação dos colaboradores.",
  },
  {
    icon: ClipboardList,
    title: "Monitoria de Currículo",
    brief: "Otimização de perfis profissionais.",
    detail: "Oferecemos serviço especializado de análise, revisão e otimização de currículos e perfis profissionais. Nossos consultores avaliam experiências, competências e potencial de desenvolvimento, fornecendo feedback estruturado e orientações práticas para melhorar a apresentação profissional e aumentar as oportunidades de carreira.",
  },
  {
    icon: BarChart3,
    title: "Gestão de Desempenho",
    brief: "Métricas e feedback estruturado.",
    detail: "Implementamos sistemas abrangentes de gestão de desempenho que incluem definição de metas claras, avaliações periódicas e processos de feedback contínuo. Utilizamos metodologias consolidadas para avaliar competências, resultados e comportamentos, fomentando o desenvolvimento profissional e alinhando expectativas entre colaboradores e organização.",
  },
  {
    icon: Lightbulb,
    title: "Consultoria em RH",
    brief: "Estratégias completas de gestão de pessoas.",
    detail: "Oferecemos consultoria estratégica em Recursos Humanos para estruturação de políticas, processos e práticas de gestão de pessoas. Apoiamos desde a definição da estratégia de RH até a implementação de soluções customizadas, sempre focando no desenvolvimento organizacional e no alinhamento da gestão de pessoas com os objetivos de negócio.",
  },
];

const ServicosSection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedService = useMemo(
    () => (selected === null ? null : services[selected]),
    [selected],
  );

  return (
    <section id="servicos" className="py-20" style={{ backgroundColor: '#E6E5E4' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-accent text-lg mb-2" style={{ color: '#D84444' }}>O que fazemos</p>
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
              className="bg-secondary rounded-xl p-6 text-left hover:shadow-lg transition-all hover:-translate-y-1 group border border-[#621618]"
            >
              <service.icon className="text-primary mb-4 group-hover:text-[#d84444] transition-colors" size={36} />
              <h3 className="font-bold text-foreground text-lg mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.brief}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card rounded-3xl max-w-2xl w-full relative shadow-2xl border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-8 right-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-all z-10"
                aria-label="Fechar"
              >
                <X size={28} />
              </button>

              <div className="p-12 pt-16">
                <div className="flex items-start gap-6 mb-12">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                    <selectedService.icon className="text-primary" size={56} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-foreground leading-tight">{selectedService.title}</h3>
                  </div>
                </div>

                <div className="mb-12">
                  <p className="text-muted-foreground leading-8 font-body text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>{selectedService.detail}</p>
                </div>

                <div className="flex justify-start">
                  <a
                    href="#contato"
                    className="inline-block bg-primary text-primary-foreground font-semibold px-10 py-4 rounded-xl hover:bg-brand-medium transition-all duration-200 hover:shadow-lg active:scale-95 text-base"
                    onClick={(e) => { e.preventDefault(); setSelected(null); document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" }); }}
                  >
                    Solicitar Orçamento
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServicosSection;
