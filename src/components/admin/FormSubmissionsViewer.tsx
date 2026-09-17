import { useState } from "react";
import { adminService, FormSubmission } from "@/services/adminService";
import { toast } from "sonner";
import {
  Inbox,
  Search,
  Download,
  Trash2,
  Mail,
  Clock,
  User,
  CheckCircle2,
  X,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

interface FormSubmissionsViewerProps {
  submissions: FormSubmission[];
  onUpdate: () => void;
}

export const FormSubmissionsViewer = ({ submissions, onUpdate }: FormSubmissionsViewerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: FormSubmission["status"]) => {
    adminService.updateSubmissionStatus(id, newStatus);
    toast.success("Status atualizado!");
    onUpdate();
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }
  };

  const handleDelete = (id: string) => {
    adminService.deleteSubmission(id);
    setDeleteConfirmId(null);
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(null);
    }
    toast.success("Mensagem excluída.");
    onUpdate();
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      toast.error("Nenhuma mensagem para exportar.");
      return;
    }

    const headers = ["ID", "Data/Hora", "Nome", "Email", "Status", "Mensagem"];
    const rows = submissions.map((s) => [
      `"${s.id}"`,
      `"${new Date(s.createdAt).toLocaleString("pt-BR")}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${s.status}"`,
      `"${s.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `consulpsi_respostas_formulario_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Arquivo CSV exportado com sucesso!");
  };

  const getStatusBadge = (status: FormSubmission["status"]) => {
    switch (status) {
      case "unread":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Nova</span>;
      case "read":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Lida</span>;
      case "answered":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Respondida</span>;
      case "archived":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Arquivada</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Ações e Filtros */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Inbox className="text-[#621816]" size={22} />
            Respostas do Formulário de Contato
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total de {submissions.length} lead(s) e mensagem(ns) recebidos pelo site da Consulpsi.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={submissions.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Exportar para CSV
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou conteúdo da mensagem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
          />
          <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#621816] focus:outline-none"
        >
          <option value="all">Todos os status</option>
          <option value="unread">Novas (Não lidas)</option>
          <option value="read">Lidas</option>
          <option value="answered">Respondidas</option>
          <option value="archived">Arquivadas</option>
        </select>
      </div>

      {/* Tabela de Mensagens */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Inbox size={24} />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Nenhuma mensagem encontrada</h3>
          <p className="text-sm text-gray-500 mt-1">
            {submissions.length === 0
              ? "Quando clientes enviarem o formulário no site, as mensagens aparecerão aqui automaticamente."
              : "Nenhum resultado corresponde aos filtros de busca aplicados."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-[#FAF8F8] text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Data / Hora</th>
                  <th className="px-6 py-3.5">Cliente</th>
                  <th className="px-6 py-3.5">Mensagem</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setSelectedSubmission(item);
                      if (item.status === "unread") {
                        handleStatusChange(item.id, "read");
                      }
                    }}
                    className="hover:bg-[#FDFBFA] cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-2 text-xs text-gray-600 max-w-md">{item.message}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedSubmission(item);
                            if (item.status === "unread") {
                              handleStatusChange(item.id, "read");
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs text-[#621816] hover:bg-[#621816]/10 rounded-lg font-medium transition-colors"
                        >
                          Ver Detalhes
                        </button>

                        {deleteConfirmId === item.id ? (
                          <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-medium"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-[11px]"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir mensagem"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Mensagem */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-[#621816]" size={20} />
                <h3 className="text-lg font-bold text-gray-900">Detalhes da Mensagem</h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FAF8F8] p-4 rounded-xl space-y-3 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-900">{selectedSubmission.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail size={16} className="text-gray-400" />
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-[#621816] hover:underline font-medium"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={16} className="text-gray-400" />
                  <span>
                    Recebido em: {new Date(selectedSubmission.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mensagem Completa
                </label>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Ações de Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Alterar Status do Atendimento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, "read")}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                      selectedSubmission.status === "read"
                        ? "bg-blue-50 border-blue-300 text-blue-800"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    Lida
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, "answered")}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                      selectedSubmission.status === "answered"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    Respondida
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedSubmission.id, "archived")}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                      selectedSubmission.status === "archived"
                        ? "bg-gray-100 border-gray-300 text-gray-800"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    Arquivada
                  </button>
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Resposta Consulpsi - Contato de ${encodeURIComponent(selectedSubmission.name)}`}
                  className="px-4 py-2 bg-[#621816] hover:bg-[#7C1D1D] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Mail size={14} />
                  Responder por E-mail
                </a>

                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
