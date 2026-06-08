import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Mariana",
    role: "Sócia — Casa do Salgado",
    text: "A experiência com a empresa júnior foi extremamente produtiva. Tudo o que solicitamos nas reuniões de alinhamento foi plenamente atendido pela equipe. O treinamento de liderança foi didático e muito explicativo, com dinâmicas que facilitaram o aprendizado e desenvolveram a empatia no time.\n\nO impacto foi tão positivo que, hoje, utilizo o conteúdo do treinamento junto ao meu mentor na estruturação dos cargos da empresa. Foi excelente para a equipe, e buscamos sempre rememorar e aplicar esse aprendizado no dia a dia.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana",
  },
];

const CasesSection = () => {
  const [current, setCurrent] = useState(0);
  const resetKey = useRef(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % testimonials.length), []);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  const resetTimer = useCallback(() => { resetKey.current += 1; }, []);

  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };
  const handleDot = (i: number) => { setCurrent(i); resetTimer(); };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, resetKey.current]);

  return (
    <section id="cases" className="py-20 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-accent text-[#FFB964] text-lg mb-2">Depoimentos</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Cases de Sucesso</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-xl text-center"
            >
              <div className="mb-6 flex justify-center">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].name}
                  className="w-20 h-20 rounded-full border-4 border-[#FFB964] shadow-md"
                />
              </div>
              <p className="text-foreground text-lg md:text-xl italic leading-relaxed mb-8 font-body whitespace-pre-line">
                "{testimonials[current].text}"
              </p>
              <p className="font-bold text-foreground text-lg">{testimonials[current].name}</p>
              <p className="text-muted-foreground text-sm">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={handlePrev} className="bg-card/20 hover:bg-card/40 rounded-full p-2 text-primary-foreground transition-colors" aria-label="Anterior">
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDot(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${i === current ? "bg-[#FFB964]" : "bg-card/30"}`}
                  aria-label={`Depoimento ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={handleNext} className="bg-card/20 hover:bg-card/40 rounded-full p-2 text-primary-foreground transition-colors" aria-label="Próximo">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
