import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-consulpsi-header.png";
import heroLogo from "@/assets/logo-consulpsi-hero.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#66141B] px-6 py-12 text-[#FBF9F7]">
      <img
        src={heroLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 w-[min(62vw,560px)] -translate-y-1/2 opacity-[0.12] mix-blend-screen"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <Link to="/" aria-label="Voltar para a página inicial" className="inline-block transition-opacity hover:opacity-80">
          <img src={logo} alt="Consulpsi" className="h-14 w-auto" />
        </Link>

        <div className="py-24">
          <section className="max-w-xl">
            <p className="mb-5 font-accent text-xl text-[#FFB964]">Consulpsi</p>
            <p className="mb-3 text-7xl font-bold leading-none text-[#FFB964] md:text-9xl">404</p>
            <h1 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">Esta página saiu do caminho.</h1>
            <p className="max-w-md text-base leading-7 text-[#FBF9F7]/75 md:text-lg">
              O endereço que você acessou não existe ou foi movido. Volte para a página inicial e continue conhecendo a Consulpsi.
            </p>
            <Link
              to="/"
              className="mt-9 inline-flex items-center gap-3 rounded-md bg-[#FFB964] px-6 py-3 font-semibold text-[#621618] transition-colors hover:bg-[#ffd08d]"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Voltar para o início
            </Link>
          </section>

        </div>

        <p className="text-sm text-[#FBF9F7]/50">Psicologia Organizacional · Recursos Humanos · Desenvolvimento Humano</p>
      </div>
    </main>
  );
};

export default NotFound;
