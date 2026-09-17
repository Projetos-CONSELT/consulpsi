import { useState } from "react";
import { adminService, SiteSettings } from "@/services/adminService";
import { toast } from "sonner";
import { MessageSquare, Phone, Mail, Check, ExternalLink, Sparkles } from "lucide-react";

interface WhatsAppEditorProps {
  settings: SiteSettings;
  onUpdate: () => void;
}

export const WhatsAppEditor = ({ settings, onUpdate }: WhatsAppEditorProps) => {
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || "5534988378444");
  const [whatsappDisplay, setWhatsappDisplay] = useState(settings.whatsappDisplay || "(34) 98837-8444");
  const [whatsappMessage, setWhatsappMessage] = useState(
    settings.whatsappMessage || "Olá! Gostaria de saber mais sobre os serviços da Consulpsi."
  );
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || "vendasconsulpsi@gmail.com");

  // Formatar número de exibição dinamicamente a partir do número digitado
  const handleNumberChange = (raw: string) => {
    // Remove não dígitos
    const clean = raw.replace(/\D/g, "");
    setWhatsappNumber(clean);

    // Autoformatar visual se for formato BR (ex: 5534988378444 ou 34988378444)
    if (clean.length === 13 && clean.startsWith("55")) {
      const ddd = clean.slice(2, 4);
      const part1 = clean.slice(4, 9);
      const part2 = clean.slice(9, 13);
      setWhatsappDisplay(`(${ddd}) ${part1}-${part2}`);
    } else if (clean.length === 11) {
      const ddd = clean.slice(0, 2);
      const part1 = clean.slice(2, 7);
      const part2 = clean.slice(7, 11);
      setWhatsappDisplay(`(${ddd}) ${part1}-${part2}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber.trim()) {
      toast.error("O número do WhatsApp é obrigatório.");
      return;
    }

    adminService.updateSettings({
      whatsappNumber: whatsappNumber.replace(/\D/g, ""),
      whatsappDisplay: whatsappDisplay.trim() || whatsappNumber,
      whatsappMessage: whatsappMessage.trim(),
      contactEmail: contactEmail.trim(),
    });

    toast.success("Informações de contato e WhatsApp salvas com sucesso!");
    onUpdate();
  };

  const testLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="pb-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-[#25D366]" size={22} />
            Configuração do WhatsApp & Contatos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Atualize o número de telefone e mensagens automáticas usadas no botão flutuante, cabeçalho, rodapé e seção de contato.
          </p>
        </div>

        <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Coluna 1: Campos de Configuração */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Número do WhatsApp (com DDI e DDD) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ex: 5534988378444"
                  value={whatsappNumber}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#621816] focus:outline-none"
                />
                <Phone className="absolute left-3.5 top-3 text-gray-400" size={16} />
              </div>
              <span className="text-[11px] text-gray-500 block mt-1">
                Formato internacional sem espaços ou símbolos (Ex: 55 para Brasil + DDD + 9 dígitos)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Exibição Visual do Telefone *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: (34) 98837-8444"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#621816] focus:outline-none"
              />
              <span className="text-[11px] text-gray-500 block mt-1">
                Como o telefone será exibido textualmente na página de Contato e no Rodapé
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Mensagem Padrão de Saudação
              </label>
              <textarea
                rows={3}
                placeholder="Mensagem pré-preenchida para o cliente quando ele abrir a conversa..."
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#621816] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                E-mail Institucional de Contato
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="vendasconsulpsi@gmail.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#621816] focus:outline-none"
                />
                <Mail className="absolute left-3.5 top-3 text-gray-400" size={16} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-[#621816] hover:bg-[#7C1D1D] text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Check size={18} />
              Salvar Alterações
            </button>
          </div>

          {/* Coluna 2: Card de Teste e Pré-visualização */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Pré-visualização do Botão Flutuante</h3>
            
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Botão Ativo no Site
                </span>
                <a
                  href={testLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium shadow-sm"
                >
                  Testar Link no WhatsApp
                  <ExternalLink size={13} />
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 space-y-2 border border-white/10">
                <p className="text-xs text-gray-300">Mensagem que será enviada:</p>
                <p className="text-sm italic font-sans text-emerald-100 bg-black/20 p-3 rounded-lg border border-white/5">
                  "{whatsappMessage}"
                </p>
                <div className="flex items-center justify-between pt-2 text-xs text-gray-300">
                  <span>Destino: <strong>+{whatsappNumber}</strong></span>
                  <span>Visual: <strong>{whatsappDisplay}</strong></span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Botão WhatsApp Oficial</p>
                  <p className="text-[11px] text-gray-400">Fixado no canto inferior direito do site</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200/60 rounded-xl text-xs text-blue-800 flex items-start gap-2.5">
              <Sparkles className="text-blue-600 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="font-semibold block mb-0.5">Sincronização em Tempo Real</strong>
                Ao clicar em "Salvar Alterações", o novo telefone e a mensagem já passam a funcionar instantaneamente em todo o site.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
