import { useState, useRef } from "react";
import { adminService, CaseItem } from "@/services/adminService";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  User,
  Quote,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

interface CasesEditorProps {
  cases: CaseItem[];
  onUpdate: () => void;
}

export const CasesEditor = ({ cases, onUpdate }: CasesEditorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [active, setActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setText("");
    setImageUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: CaseItem) => {
    setEditingId(item.id);
    setName(item.name);
    setRole(item.role);
    setText(item.text);
    setImageUrl(item.imageUrl);
    setActive(item.active);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("A foto deve ter no máximo 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setImageUrl(base64);
        toast.success("Foto carregada!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("O nome do cliente é obrigatório.");
      return;
    }
    if (!text.trim()) {
      toast.error("O depoimento do cliente é obrigatório.");
      return;
    }

    const finalImage = imageUrl.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    if (editingId) {
      adminService.updateCase(editingId, {
        name: name.trim(),
        role: role.trim() || "Cliente",
        text: text.trim(),
        imageUrl: finalImage,
        active,
      });
      toast.success("Depoimento atualizado com sucesso!");
    } else {
      adminService.addCase({
        name: name.trim(),
        role: role.trim() || "Cliente",
        text: text.trim(),
        imageUrl: finalImage,
        orderIndex: cases.length,
        active,
      });
      toast.success("Novo Case de Sucesso adicionado com sucesso!");
    }

    setIsModalOpen(false);
    onUpdate();
  };

  const handleDelete = (id: string) => {
    adminService.deleteCase(id);
    setDeleteConfirmId(null);
    toast.success("Depoimento removido.");
    onUpdate();
  };

  const handleToggleActive = (item: CaseItem) => {
    adminService.updateCase(item.id, { active: !item.active });
    toast.success(item.active ? "Case ocultado do site." : "Case ativado no site!");
    onUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Ação de Adicionar */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Quote className="text-[#621816]" size={22} />
            Gerenciar Cases de Sucesso
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Adicione, edite, oculte ou remova depoimentos de clientes que aparecem no carrossel.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#621816] hover:bg-[#7C1D1D] text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
        >
          <Plus size={18} />
          Adicionar Novo Case
        </button>
      </div>

      {/* Lista de Depoimentos */}
      {cases.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Quote size={24} />
          </div>
          <h3 className="text-base font-semibold text-gray-800">Nenhum case cadastrado</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Comece cadastrando seu primeiro depoimento de cliente para a seção Cases de Sucesso.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#621816] text-white rounded-lg text-sm font-medium hover:bg-[#7C1D1D]"
          >
            <Plus size={16} />
            Adicionar Depoimento
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {cases.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-6 shadow-sm transition-all relative flex flex-col justify-between ${
                item.active ? "border-gray-200 hover:border-gray-300" : "border-gray-200/60 bg-gray-50/70 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#FFB964] shadow-sm bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.name)}`;
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">{item.role}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                      item.active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.active ? "Visível" : "Oculto"}
                  </span>
                </div>

                <div className="bg-[#FAF8F8] rounded-lg p-3.5 text-xs text-gray-700 italic border border-gray-100 mb-4 whitespace-pre-line line-clamp-4">
                  "{item.text}"
                </div>
              </div>

              {/* Ações do Card */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
                >
                  {item.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  {item.active ? "Ocultar" : "Tornar Visível"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-gray-500 hover:text-[#621816] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar Case"
                  >
                    <Edit2 size={16} />
                  </button>

                  {deleteConfirmId === item.id ? (
                    <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg">
                      <span className="text-[11px] text-red-700 font-medium px-1">Excluir?</span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:bg-red-200 rounded"
                        title="Confirmar exclusão"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        title="Cancelar"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir Case"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Editar Case de Sucesso" : "Novo Case de Sucesso"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Foto do Cliente */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Foto do Cliente
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder`}
                    alt="Preview avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#FFB964] shadow bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 text-xs font-medium text-[#621816] bg-[#621816]/10 hover:bg-[#621816]/20 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Upload size={14} />
                        Fazer Upload de Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substr(2, 6)}`)}
                        className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Sparkles size={14} />
                        Gerar Avatar
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <input
                      type="text"
                      placeholder="Ou cole a URL da imagem aqui..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Nome e Cargo */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Nome do Cliente *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mariana Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
                    />
                    <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Cargo / Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Sócia — Casa do Salgado"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none"
                  />
                </div>
              </div>

              {/* Depoimento / Comentário */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Depoimento / Relato de Sucesso *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Escreva aqui o depoimento ou feedback completo do cliente sobre a experiência com a Consulpsi..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#621816] focus:outline-none resize-none"
                />
              </div>

              {/* Ativar/Desativar */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="caseActiveCheckbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-[#621816] rounded border-gray-300 focus:ring-[#621816]"
                />
                <label htmlFor="caseActiveCheckbox" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Publicar imediatamente no site
                </label>
              </div>

              {/* Botões do Rodapé */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#621816] hover:bg-[#7C1D1D] text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Check size={16} />
                  {editingId ? "Salvar Alterações" : "Adicionar Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
