import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const PrivacyPolicy = () => {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      id: "intro",
      title: "1. Introdução",
      content:
        "A Consulpsi (doravante 'Nós' ou 'Nossa') está comprometida com a proteção de sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e salvaguardamos suas informações ao visitar nosso website.",
    },
    {
      id: "informacoes",
      title: "2. Informações que Coletamos",
      content: `Coletamos informações de várias formas:

• Informações fornecidas voluntariamente: Nome, email, telefone, empresa, mensagem e outras informações que você nos fornece através do formulário de contato.

• Informações automaticamente coletadas: Endereço IP, tipo de navegador, páginas visitadas, tempo de permanência no site, referrer, através de cookies e ferramentas de análise.

• Cookies e tecnologias similares: Utilizamos cookies para melhorar a experiência do usuário e coletar dados analíticos.`,
    },
    {
      id: "uso",
      title: "3. Como Usamos suas Informações",
      content: `Utilizamos as informações coletadas para:

• Responder a inquéritos e fornecer informações sobre nossos serviços
• Enviar propostas comerciais e comunicações relacionadas
• Melhorar nosso website e serviços
• Analisar tendências e comportamento de usuários
• Detectar e prevenir fraudes
• Cumprir obrigações legais
• Enviar newsletters (com sua permissão)
• Realizar pesquisas de satisfação`,
    },
    {
      id: "cookies",
      title: "4. Cookies e Tecnologias de Rastreamento",
      content: `Utilizamos as seguintes tecnologias:

• Google Analytics: Coleta dados sobre visitantes para análise de tráfego
• Cookies de sessão: Para manter sua sessão ativa
• Cookies de preferência: Para lembrar suas preferências

Você pode desabilitar cookies através das configurações do seu navegador. No entanto, isso pode afetar a funcionalidade do site.`,
    },
    {
      id: "divulgacao",
      title: "5. Divulgação de Informações",
      content: `Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:

• Com provedores de serviços que nos auxiliam nas operações do website
• Quando exigido por lei ou ordem judicial
• Para proteger direitos, privacidade, segurança ou propriedade
• Com seu consentimento explícito`,
    },
    {
      id: "seguranca",
      title: "6. Segurança de Dados",
      content: `Implementamos medidas de segurança técnicas e administrativas para proteger suas informações:

• Criptografia SSL/HTTPS em todas as transmissões
• Acesso restrito a dados pessoais
• Monitoramento de segurança
• Conformidade com padrões de segurança da indústria

No entanto, nenhum método de transmissão pela internet é 100% seguro.`,
    },
    {
      id: "lgpd",
      title: "7. Direitos do Usuário (LGPD)",
      content: `Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:

• Acessar seus dados pessoais
• Corrigir dados inexatos
• Solicitar a exclusão de dados (direito ao esquecimento)
• Solicitar cópia dos seus dados
• Revogar consentimento
• Apresentar reclamações a órgãos reguladores

Para exercer esses direitos, entre em contato através do email fornecido abaixo.`,
    },
    {
      id: "retencao",
      title: "8. Retenção de Dados",
      content: `Mantemos seus dados pessoais apenas pelo tempo necessário para:

• Cumprir os fins para os quais foram coletados
• Cumprir obrigações legais (geralmente 5 anos)
• Resolver disputas

Após esse período, os dados são eliminados de forma segura.`,
    },
    {
      id: "links",
      title: "9. Links para Terceiros",
      content: `Nosso website pode conter links para sites de terceiros. Não somos responsáveis pelas políticas de privacidade desses sites. Recomendamos revisar as políticas de privacidade de terceiros antes de fornecer informações pessoais.`,
    },
    {
      id: "menores",
      title: "10. Proteção de Menores",
      content: `Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se descobrirmos que coletamos dados de um menor, tomaremos medidas para deletar tais informações imediatamente.`,
    },
    {
      id: "atualizacoes",
      title: "11. Atualizações desta Política",
      content: `Podemos atualizar esta Política de Privacidade periodicamente. Mudanças significativas serão comunicadas através do website ou por email. Seu uso continuado do site após mudanças implica aceitação da política revisada.`,
    },
    {
      id: "contato",
      title: "12. Contato",
      content: `Se você tiver dúvidas, preocupações ou desejar exercer seus direitos, entre em contato conosco:

📧 Email: privacidade@consulpsi.com.br
📞 Telefone: (34) 99999-0000
📍 Endereço: Bloco 2E121 — Campus Umuarama, Universidade Federal de Uberlândia`,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-brand-dark text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Política de Privacidade
            </h1>
            <p className="text-lg text-gray-200">
              Última atualização: 23 de abril de 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none space-y-4">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
                  >
                    <h3 className="text-lg font-bold text-left text-brand-dark">
                      {section.title}
                    </h3>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${
                        expandedSections[section.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSections[section.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 py-4 bg-white border-t border-gray-200"
                    >
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {section.content}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-sm text-gray-700">
                <strong>Aviso Importante:</strong> Esta Política de Privacidade
                foi preparada em conformidade com a Lei Geral de Proteção de
                Dados (LGPD - Lei nº 13.709/2018). Para qualquer dúvida sobre
                como seus dados são tratados, entre em contato através dos
                canais fornecidos acima.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
