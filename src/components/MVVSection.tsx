import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";

const cards = [
  {
    title: "Missão",
    icon: Target,
    description: "Oferecer soluções em Psicologia Organizacional e Recursos Humanos, promovendo o desenvolvimento humano e organizacional com excelência e ética.",
  },
  {
    title: "Visão",
    icon: Eye,
    description: "Ser referência em consultoria júnior de Psicologia Organizacional, reconhecida pela qualidade, inovação e impacto positivo nas organizações.",
  },
  {
    title: "Valores",
    icon: Heart,
    description: "Ética, comprometimento, respeito à diversidade, inovação, trabalho em equipe e responsabilidade social orientam todas as nossas ações.",
  },
];

const FlipCard = ({ title, icon: Icon, description }: typeof cards[0]) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="cursor-pointer perspective-1000 h-64"
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => e.key === "Enter" && setFlipped(!flipped)}
      tabIndex={0}
      role="button"
      aria-label={`${title} - clique para ver mais`}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-lg" style={{ backfaceVisibility: "hidden", backgroundColor: "#8E2424" }}>
          <Icon className="text-primary-foreground" size={48} />
          <h3 className="text-2xl font-bold text-primary-foreground">{title}</h3>
          <p className="text-primary-foreground/60 text-xs font-body">Clique para saber mais</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-brand-accent rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h3 className="text-xl font-bold text-accent-foreground mb-4">{title}</h3>
          <p className="text-accent-foreground/80 text-center text-sm leading-relaxed font-body">{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

const MVVSection = () => {
  return (
    <section className="py-20 relative" style={{ backgroundColor: "#621618" }}>
        <div className="absolute top-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to bottom, #7C1D1D, #621618)" }} />
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-accent text-brand-accent text-lg mb-2">Nossos Pilares</p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#E6E5E4" }}>Missão, Visão e Valores</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <FlipCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MVVSection;
