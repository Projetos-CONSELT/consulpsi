import logo from "@/assets/logo-consulpsi.png";

const servicosItems = [
  "Recrutamento e Seleção",
  "Saúde Mental no Trabalho",
  "Avaliação de Desempenho",
  "Pesquisa de Clima",
  "Treinamento e Desenvolvimento",
  "Consultoria em RH",
];

const Footer = () => {
  const scrollToServicos = () => {
    document.querySelector("#servicos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-brand-dark text-primary-foreground overflow-hidden">
      {/* Decorative top line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Bloco 1 — Logo */}
          <div className="flex items-center justify-center h-full">
            <img
              src={logo}
              alt="Consulpsi"
              className="h-28 w-28 object-contain"
            />
          </div>

          {/* Bloco 2 — Serviços */}
          <div>
            <h4 className="font-accent text-accent text-xl mb-5 tracking-wide">Serviços</h4>
            <ul className="space-y-2.5">
              {servicosItems.map((item) => (
                <li key={item}>
                  <button
                    onClick={scrollToServicos}
                    className="text-sm font-body text-primary-foreground/70 hover:text-accent hover:translate-x-1 transition-all duration-300 ease-out relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-accent/50 after:transition-all after:duration-300 text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloco 3 — Contato */}
          <div>
            <h4 className="font-accent text-accent text-xl mb-5 tracking-wide">Contato</h4>
            <ul className="space-y-2.5 text-sm font-body text-primary-foreground/70 mb-5">
              <li>
                <a
                  href="mailto:contato@consulpsiconsultoria.com.br"
                  className="hover:text-accent transition-colors duration-300"
                >
                  <span className="block">contato@consulpsi</span>
                  <span className="block">consultoria.com.br</span>
                </a>
              </li>
              <li className="leading-relaxed">
                Bloco 2E121 — Campus Umuarama
                <br />
                Universidade Federal de Uberlândia
              </li>
            </ul>

            {/* Redes sociais */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/consulpsi_ufu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-primary-foreground/60 hover:text-accent hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/consulpsi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-primary-foreground/60 hover:text-accent hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://wa.me/5534999999999"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-primary-foreground/60 hover:text-accent hover:scale-110 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bloco 4 — Localização */}
          <div>
            <h4 className="font-accent text-accent text-xl mb-5 tracking-wide">Localização</h4>
            <div className="rounded-lg overflow-hidden border border-accent/20 shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.51!2d-48.2578!3d-18.9186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a44508b1b!2sCampus+Umuarama+-+UFU!5e0!3m2!1spt-BR!2sbr!4v1"
                width="100%"
                height="170"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Consulpsi — Campus Umuarama, UFU"
              />
            </div>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-accent/15 mt-12 pt-6 text-center">
          <p className="text-primary-foreground/40 text-xs font-body tracking-wider">
            © {new Date().getFullYear()} Consulpsi — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
