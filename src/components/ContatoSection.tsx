import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const ContatoSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/arthurmcuoco@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "Website Consulpsi",
          _template: "table",
          _captcha: "false",
          nome: form.name.trim(),
          email: form.email.trim(),
          mensagem: form.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha no envio do formulário");
      }

      toast.success("Mensagem enviada com sucesso! Verifique a caixa de entrada.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  };

  return (
    <section id="contato" className="pt-20 pb-[84px]" style={{ backgroundColor: "#E6E5E4" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-accent text-[#ffb964] text-lg mb-2">Entre em contato</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Contato</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-foreground mb-6">Fale com a gente</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Tem alguma dúvida ou quer saber mais sobre nossos serviços? Entre em contato pelos canais abaixo ou preencha o formulário.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:consulpsi@ufu.br"
                className="group flex items-center gap-4"
                aria-label="Enviar e-mail para consulpsi@ufu.br"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="text-primary" size={18} />
                </div>
                <span className="text-foreground font-body text-sm transition-all duration-200 group-hover:text-[#FFB964] group-hover:scale-105 origin-left">consulpsi@ufu.br</span>
              </a>
              <div className="group flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="text-primary" size={18} />
                </div>
                <span className="text-foreground font-body text-sm transition-all duration-200 group-hover:text-[#FFB964] group-hover:scale-105 origin-left">(34) 99999-0000</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Bloco+2E+-+Agronomia+UFU"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 transition-colors"
                aria-label="Abrir Bloco 2E - Agronomia UFU no Google Maps"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={18} />
                </div>
                <span className="text-foreground font-body text-sm leading-relaxed transition-all duration-200 group-hover:text-[#FFB964] group-hover:scale-105 origin-left">
                  <span className="block">Bloco 2E121 — Campus Umuarama</span>
                  <span className="block">Universidade Federal de Uberlândia</span>
                </span>
              </a>
            </div>

            <div className="flex gap-4 mt-8">
              <a href="https://instagram.com/consulpsi_ufu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-brand-medium transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/consulpsiconsultoria/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-brand-medium transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="relative bg-white border border-[#621816]/25 rounded-2xl p-8 space-y-5 shadow-[0_14px_30px_rgba(98,24,22,0.15)]"
          >
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-2">Nome</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#FCFCFC] border border-[#D4C7C7] rounded-lg px-4 py-3 text-foreground text-sm font-body focus:ring-2 focus:ring-[#621816] focus:outline-none"
                placeholder="Seu nome completo"
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-2">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#FCFCFC] border border-[#D4C7C7] rounded-lg px-4 py-3 text-foreground text-sm font-body focus:ring-2 focus:ring-[#621816] focus:outline-none"
                placeholder="seu@email.com"
                maxLength={255}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground font-body block mb-2">Mensagem</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full bg-[#FCFCFC] border border-[#D4C7C7] rounded-lg px-4 py-3 text-foreground text-sm font-body focus:ring-2 focus:ring-[#621816] focus:outline-none resize-none"
                placeholder="Como podemos ajudar?"
                maxLength={1000}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-brand-medium transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Send size={16} />
              Enviar Mensagem
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContatoSection;
