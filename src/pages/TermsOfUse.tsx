import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const TermsOfUse = () => {
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
      id: "uso",
      title: "1. Condições de Uso",
      content:
        "Ao acessar e usar este website, você aceita estar vinculado por estas Condições de Uso. Se você não concorda com qualquer parte destas condições, não deve usar o site.",
    },
    {
      id: "direitos",
      title: "2. Direitos Autorais e Propriedade Intelectual",
      content: `Todo o conteúdo deste website, incluindo texto, gráficos, logos, imagens, e software, é propriedade da Consulpsi ou de seus fornecedores e está protegido por leis internacionais de direitos autorais.

Você não pode:
• Reproduzir, distribuir ou transmitir qualquer conteúdo sem permissão
• Modificar, criar trabalhos derivados ou descompilar o código
• Remover avisos de direitos autorais ou propriedade
• Usar conteúdo para fins comerciais sem autorização`,
    },
    {
      id: "uso-autorizado",
      title: "3. Uso Autorizado",
      content: `Este website é fornecido apenas para uso pessoal e não comercial. Você concorda em usar o site apenas para:

• Obter informações sobre nossos serviços
• Fazer inquéritos sobre consultoria
• Baixar e imprimir materiais para uso pessoal
• Navegar e pesquisar conteúdo

Você não pode usar o site para:
• Atividades ilegais ou não autorizadas
• Verificação de preços ou pesquisa competitiva
• Mineração de dados (web scraping)
• Criar cópias em massa de conteúdo
• Enviar spam ou conteúdo malicioso`,
    },
    {
      id: "isenção",
      title: "4. Isenção de Responsabilidade",
      content: `O WEBSITE É FORNECIDO "COMO ESTÁ" SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS.

A CONSULPSI NÃO GARANTE QUE:
• O WEBSITE FUNCIONARÁ SEM INTERRUPÇÕES
• O CONTEÚDO ESTÁ LIVRE DE ERROS OU VÍRUS
• OS RESULTADOS ATENDERÃO ÀS SUAS EXPECTATIVAS
• O SITE ESTÁ SEMPRE DISPONÍVEL

A CONSULPSI NÃO SE RESPONSABILIZA POR:
• PERDA DE DADOS
• LUCROS CESSANTES
• DANOS INDIRETOS, INCIDENTAIS OU PUNITIVOS
• QUALQUER CONTEÚDO DE TERCEIROS`,
    },
    {
      id: "limitacao",
      title: "5. Limitação de Responsabilidade",
      content: `EM NENHUMA CIRCUNSTÂNCIA A CONSULPSI SERÁ RESPONSÁVEL POR DANOS QUE EXCEDAM O VALOR PAGO (SE HOUVER) PELO USO DO SITE.

Algumas jurisdições não permitem limitações de garantias implícitas, portanto, essas limitações podem não se aplicar a você.`,
    },
    {
      id: "links",
      title: "6. Links para Terceiros",
      content: `Este website pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo, exatidão ou práticas de privacidade desses sites.

Sua acesso a links de terceiros é por seu próprio risco, e recomendamos revisar os termos e políticas desses sites.`,
    },
    {
      id: "conteudo-usuario",
      title: "7. Conteúdo do Usuário",
      content: `Se você submete conteúdo através do formulário de contato (texto, fotos, etc.), você:

• Concede à Consulpsi direito perpétuo de usar esse conteúdo
• Garante que possui os direitos sobre o conteúdo
• Concorda que o conteúdo pode ser processado e armazenado
• Libera a Consulpsi de qualquer responsabilidade relacionada`,
    },
    {
      id: "proibicoes",
      title: "8. Proibições Gerais",
      content: `Você concorda em não:

• Violar qualquer lei ou regulação aplicável
• Infringir direitos de propriedade intelectual
• Enviar conteúdo prejudicial, ofensivo ou difamatório
• Tentar ganhar acesso não autorizado ao site
• Interferir com o funcionamento do website
• Usar robôs ou scrapers
• Enviar spam, malware ou código malicioso
• Coletar ou rastrear informações de outros usuários
• Impersonificar qualquer pessoa ou entidade`,
    },
    {
      id: "indenizacao",
      title: "9. Indenização",
      content: `Você concorda em indenizar e isentar a Consulpsi, seus funcionários, diretores e agentes de qualquer reclamação, dano, perda ou custo (incluindo honorários de advogados) decorrentes de:

• Sua violação destas Condições de Uso
• Seu uso do website
• Violação de direitos de terceiros
• Qualquer conteúdo que você submeta`,
    },
    {
      id: "rescisao",
      title: "10. Rescisão",
      content: `A Consulpsi pode rescindir seu acesso ao website a qualquer momento, com ou sem aviso prévio, se você violar estas Condições de Uso ou por qualquer outro motivo legítimo.

Após rescisão, você deve cessar o uso do website imediatamente.`,
    },
    {
      id: "modificacoes",
      title: "11. Modificações dos Termos",
      content: `A Consulpsi se reserva o direito de modificar estas Condições de Uso a qualquer momento. Mudanças entrarão em vigor quando publicadas no website.

Seu uso continuado do site após mudanças implica aceitação das novas condições.`,
    },
    {
      id: "toda-acordo",
      title: "12. Acordo Completo",
      content: `Estas Condições de Uso constituem o acordo completo entre você e a Consulpsi e substituem todos os acordos anteriores, orais ou escritos, relacionados ao website.`,
    },
    {
      id: "severidade",
      title: "13. Severidade",
      content: `Se qualquer disposição destas Condições de Uso for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor.`,
    },
    {
      id: "lei",
      title: "14. Lei Aplicável",
      content: `Estas Condições de Uso são regidas pelas leis da República Federativa do Brasil, especificamente do Estado de Minas Gerais.

Qualquer disputa será submetida aos tribunais competentes de Uberlândia, Minas Gerais.`,
    },
    {
      id: "contato",
      title: "15. Contato",
      content: `Para perguntas sobre estas Condições de Uso, entre em contato:

📧 Email: vendasconsulpsi@gmail.com
📞 Telefone: (34) 98837-8444
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
              Condições de Uso
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
              className="mt-12 p-6 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-gray-700">
                <strong>Aviso Importante:</strong> Estas Condições de Uso foram
                preparadas de acordo com a legislação brasileira. Se você tiver
                dúvidas sobre seus direitos e responsabilidades, recomendamos
                consultar um advogado.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default TermsOfUse;
