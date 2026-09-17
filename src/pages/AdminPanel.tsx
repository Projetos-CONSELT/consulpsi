import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService, SiteSettings, CaseItem, FormSubmission, AdminAuthSession } from "@/services/adminService";
import { QuemSomosEditor } from "@/components/admin/QuemSomosEditor";
import { CasesEditor } from "@/components/admin/CasesEditor";
import { WhatsAppEditor } from "@/components/admin/WhatsAppEditor";
import { FormSubmissionsViewer } from "@/components/admin/FormSubmissionsViewer";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  Image as ImageIcon,
  Quote,
  MessageSquare,
  Inbox,
  Database,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Sparkles,
} from "lucide-react";
import logoHeader from "@/assets/logo-consulpsi-header.png";

const AdminPanel = () => {
  const [session, setSession] = useState<AdminAuthSession | null>(() => adminService.getSession());
  const [activeTab, setActiveTab] = useState<"quem-somos" | "cases" | "whatsapp" | "leads" | "sql">("quem-somos");

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("admin@consulpsi.com.br");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Change Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Data State
  const [settings, setSettings] = useState<SiteSettings>(() => adminService.getSettings());
  const [cases, setCases] = useState<CaseItem[]>(() => adminService.getCases());
  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => adminService.getFormSubmissions());

  const refreshData = () => {
    setSettings(adminService.getSettings());
    setCases(adminService.getCases());
    setSubmissions(adminService.getFormSubmissions());
  };

  useEffect(() => {
    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<AdminAuthSession | null>;
      setSession(customEvent.detail || adminService.getSession());
    };
    window.addEventListener("consulpsi-auth-changed", handleAuth);
    return () => window.removeEventListener("consulpsi-auth-changed", handleAuth);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      const success = adminService.login(loginPassword, loginEmail);
      setIsLoggingIn(false);
      if (success) {
        toast.success("Login realizado com sucesso!");
        refreshData();
      } else {
        toast.error("Senha incorreta. A senha padrão inicial é admin123");
      }
    }, 400);
  };

  const handleLogout = () => {
    adminService.logout();
    toast.info("Você saiu do painel administrativo.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As novas senhas digitadas não coincidem.");
      return;
    }
    const res = adminService.changePassword(currentPassword, newPassword);
    if (res.success) {
      toast.success(res.message);
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(res.message);
    }
  };

  const copySqlSchema = () => {
    const sqlText = `-- Schema SQL Consulpsi
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS cases_sucesso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'answered', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;
    navigator.clipboard.writeText(sqlText);
    toast.success("Script SQL copiado para a área de transferência!");
  };

  const unreadLeadsCount = submissions.filter((s) => s.status === "unread").length;

  // -------------------------------------------------------------
  // SEÇÃO DE LOGIN SE NÃO ESTIVER AUTENTICADO
  // -------------------------------------------------------------
  if (!session?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#621816] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Fundo decorativo sutil */}
        <div className="absolute inset-0 bg-radial from-[#7C1D1D]/50 to-transparent pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img src={logoHeader} alt="Consulpsi" className="h-16 mx-auto mb-3" />
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-wide">Painel Administrativo</h1>
            <p className="text-[#FFB964] text-xs font-accent tracking-wider uppercase mt-1">
              Acesso Restrito da Equipe
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#621816]/10 text-[#621816] flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Entrar no Sistema</h2>
                <p className="text-xs text-gray-500">Digite suas credenciais de administrador</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
                  placeholder="admin@consulpsi.com.br"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2">
                <Sparkles size={14} className="text-amber-600 mt-0.5 shrink-0" />
                <span>
                  Senha padrão inicial: <strong className="font-mono font-bold">admin123</strong> (você pode alterá-la após entrar).
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#621816] hover:bg-[#7C1D1D] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoggingIn ? "Autenticando..." : "Entrar no Painel"}
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <Link to="/" className="text-xs text-gray-500 hover:text-[#621816] inline-flex items-center gap-1">
                ← Voltar para a Página Inicial
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DASHBOARD PRINCIPAL ADMINISTRATIVO
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F6F6] text-gray-900">
      {/* Barra de Topo do Painel */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <img src={logoHeader} alt="Consulpsi" className="h-9 w-auto" />
              </Link>
              <div className="h-6 w-px bg-gray-200 hidden sm:block" />
              <span className="text-xs font-semibold px-2.5 py-1 bg-[#621816]/10 text-[#621816] rounded-full hidden sm:inline-block">
                Painel Administrativo
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#621816] px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={14} />
                <span className="hidden md:inline">Ver Site ao Vivo</span>
              </Link>

              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Alterar Senha de Acesso"
              >
                <KeyRound size={18} />
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Resumo de Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ImageIcon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Foto Seção 2</p>
              <p className="text-sm font-bold text-gray-900">
                {settings.quemSomosImage ? "Personalizada" : "Padrão"}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Quote size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Cases de Sucesso</p>
              <p className="text-lg font-bold text-gray-900">
                {cases.filter((c) => c.active).length} <span className="text-xs text-gray-400 font-normal">/ {cases.length}</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">WhatsApp</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                {settings.whatsappDisplay}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 relative">
              <Inbox size={24} />
              {unreadLeadsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadLeadsCount}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Respostas do Form</p>
              <p className="text-lg font-bold text-gray-900">
                {submissions.length} <span className="text-xs text-amber-600 font-normal">({unreadLeadsCount} novas)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab("quem-somos")}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "quem-somos"
                  ? "border-[#621816] text-[#621816] font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ImageIcon size={18} />
              Foto Quem Somos (2ª Seção)
            </button>

            <button
              onClick={() => setActiveTab("cases")}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "cases"
                  ? "border-[#621816] text-[#621816] font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Quote size={18} />
              Cases de Sucesso ({cases.length})
            </button>

            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "whatsapp"
                  ? "border-[#621816] text-[#621816] font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <MessageSquare size={18} />
              WhatsApp & Contatos
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 relative ${
                activeTab === "leads"
                  ? "border-[#621816] text-[#621816] font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Inbox size={18} />
              Respostas do Formulário
              {unreadLeadsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unreadLeadsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("sql")}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === "sql"
                  ? "border-[#621816] text-[#621816] font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Database size={18} />
              Banco de Dados SQL
            </button>
          </nav>
        </div>

        {/* Conteúdo da Aba Selecionada */}
        <div>
          {activeTab === "quem-somos" && (
            <QuemSomosEditor currentImage={settings.quemSomosImage} onUpdate={refreshData} />
          )}

          {activeTab === "cases" && (
            <CasesEditor cases={cases} onUpdate={refreshData} />
          )}

          {activeTab === "whatsapp" && (
            <WhatsAppEditor settings={settings} onUpdate={refreshData} />
          )}

          {activeTab === "leads" && (
            <FormSubmissionsViewer submissions={submissions} onUpdate={refreshData} />
          )}

          {activeTab === "sql" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Database className="text-[#621816]" size={22} />
                      Script SQL e Estrutura do Banco de Dados
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Script para PostgreSQL e Supabase com tabelas, RLS e dados iniciais integrados.
                    </p>
                  </div>
                  <button
                    onClick={copySqlSchema}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#621816] text-white rounded-lg text-sm font-semibold hover:bg-[#7C1D1D] transition-colors"
                  >
                    <Copy size={16} />
                    Copiar Script SQL
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase">Tabela 1</span>
                    <h3 className="font-bold text-gray-900 mt-1">site_settings</h3>
                    <p className="text-xs text-gray-600 mt-1">Armazena imagem da Seção 2, WhatsApp e configurações gerais.</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase">Tabela 2</span>
                    <h3 className="font-bold text-gray-900 mt-1">cases_sucesso</h3>
                    <p className="text-xs text-gray-600 mt-1">Armazena depoimentos, clientes, fotos e ordem de exibição.</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-xs font-bold text-gray-500 uppercase">Tabela 3</span>
                    <h3 className="font-bold text-gray-900 mt-1">form_submissions</h3>
                    <p className="text-xs text-gray-600 mt-1">Armazena todas as mensagens e leads enviados pelo formulário.</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-[#1E293B] text-gray-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96">
                    <pre>{`-- Arquivo gerado em /supabase/schema.sql
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS cases_sucesso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'answered', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Alteração de Senha */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <KeyRound size={20} className="text-[#621816]" />
              Alterar Senha do Administrador
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Senha Atual *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Nova Senha * (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#621816] hover:bg-[#7C1D1D] text-white rounded-lg text-xs font-semibold"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
