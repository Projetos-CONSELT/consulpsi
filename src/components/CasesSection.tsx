import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const CasesSection = () => {
  const { cases } = useSiteContent();
  const [current, setCurrent] = useState(0);
  const resetKey = useRef(0);

  const testimonialsCount = cases.length;

  // Garantir que o índice atual seja válido mesmo se items forem removidos
  const safeCurrent = testimonialsCount > 0 ? current % testimonialsCount : 0;
  const currentItem = testimonialsCount > 0 ? cases[safeCurrent] : null;

  const next = useCallback(() => {
    if (testimonialsCount > 0) {
      setCurrent((p) => (p + 1) % testimonialsCount);
    }
  }, [testimonialsCount]);

  const prev = () => {
    if (testimonialsCount > 0) {
      setCurrent((p) => (p - 1 + testimonialsCount) % testimonialsCount);
    }
  };

  const resetTimer = useCallback(() => {
    resetKey.current += 1;
  }, []);

  const handlePrev = () => {
    prev();
    resetTimer();
  };

  const handleNext = () => {
    next();
    resetTimer();
  };

  const handleDot = (i: number) => {
    setCurrent(i);
    resetTimer();
  };

  useEffect(() => {
    if (testimonialsCount <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, resetKey.current, testimonialsCount]);

  if (!currentItem) {
    return null;
  }

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
              key={currentItem.id || safeCurrent}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-xl text-center"
            >
              <div className="mb-6 flex justify-center">
                <img
                  src={currentItem.imageUrl}
                  alt={currentItem.name}
                  className="w-20 h-20 rounded-full border-4 border-[#FFB964] shadow-md object-cover bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentItem.name)}`;
                  }}
                />
              </div>
              <p className="text-foreground text-lg md:text-xl italic leading-relaxed mb-8 font-body whitespace-pre-line">
                "{currentItem.text}"
              </p>
              <p className="font-bold text-foreground text-lg">{currentItem.name}</p>
              <p className="text-muted-foreground text-sm">{currentItem.role}</p>
            </motion.div>
          </AnimatePresence>

          {testimonialsCount > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="bg-card/20 hover:bg-card/40 rounded-full p-2 text-primary-foreground transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-2">
                {cases.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDot(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === safeCurrent ? "bg-[#FFB964]" : "bg-card/30"
                    }`}
                    aria-label={`Depoimento ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="bg-card/20 hover:bg-card/40 rounded-full p-2 text-primary-foreground transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
