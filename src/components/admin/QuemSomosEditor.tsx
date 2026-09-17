import { useState, useRef } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, RotateCcw, Check, Sparkles } from "lucide-react";
import defaultTeamImage from "../../../imagens/secao-2-equipe/equipe-consulpsi-secao-2.png";

interface QuemSomosEditorProps {
  currentImage: string;
  onUpdate: () => void;
}

export const QuemSomosEditor = ({ currentImage, onUpdate }: QuemSomosEditorProps) => {
  const [preview, setPreview] = useState<string>(currentImage || defaultTeamImage);
  const [isCustom, setIsCustom] = useState<boolean>(Boolean(currentImage));
  const [imageUrlInput, setImageUrlInput] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        adminService.updateSettings({ quemSomosImage: base64 });
        setPreview(base64);
        setIsCustom(true);
        toast.success("Imagem da Seção 2 atualizada com sucesso!");
        onUpdate();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSave = () => {
    if (!imageUrlInput.trim()) {
      toast.error("Informe a URL da imagem.");
      return;
    }
    adminService.updateSettings({ quemSomosImage: imageUrlInput.trim() });
    setPreview(imageUrlInput.trim());
    setIsCustom(true);
    setImageUrlInput("");
    toast.success("Imagem da Seção 2 atualizada com sucesso!");
    onUpdate();
  };

  const handleReset = () => {
    adminService.resetQuemSomosImage();
    setPreview(defaultTeamImage);
    setIsCustom(false);
    toast.success("Imagem restaurada para o padrão original!");
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="text-[#621816]" size={22} />
              Imagem da 2ª Seção (Quem Somos)
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Altere a foto da equipe que é exibida na seção principal "Quem Somos".
            </p>
          </div>
          {isCustom && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <RotateCcw size={16} />
              Restaurar Imagem Padrão
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Lado Esquerdo: Ações de Upload */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fazer upload de arquivo
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#621816]/30 hover:border-[#621816] rounded-xl p-6 text-center cursor-pointer transition-all bg-[#FAF8F8] hover:bg-[#F5EEEE] group"
              >
                <div className="w-12 h-12 rounded-full bg-[#621816]/10 text-[#621816] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-medium text-gray-800">
                  Clique aqui para selecionar uma foto
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formatos suportados: PNG, JPG, JPEG, WebP (máx. 5MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                ou via URL
              </span>
              <div className="border-t border-gray-200 w-full" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Inserir link direto da imagem
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto-equipe.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#621816] focus:outline-none"
                />
                <button
                  onClick={handleUrlSave}
                  className="px-5 py-2.5 bg-[#621816] hover:bg-[#7C1D1D] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <Check size={16} />
                  Salvar
                </button>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
              <Sparkles className="text-amber-600 shrink-0 mt-0.5" size={16} />
              <div>
                <strong className="font-semibold block mb-0.5">Dica de Enquadramento</strong>
                Para um visual perfeito na página inicial, recomendamos imagens com proporção horizontal (como 16:9 ou 4:3) e boa iluminação da equipe.
              </div>
            </div>
          </div>

          {/* Lado Direito: Pré-visualização ao vivo */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Pré-visualização no Site</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${isCustom ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {isCustom ? "Imagem Personalizada Ativa" : "Imagem Padrão do Sistema"}
              </span>
            </div>
            
            <div className="bg-[#E6E5E4] p-6 rounded-2xl border border-gray-200 shadow-inner">
              <div
                className="rounded-xl overflow-hidden bg-white shadow-2xl transition-all"
                style={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.35)" }}
              >
                <img
                  src={preview}
                  alt="Pré-visualização Quem Somos"
                  className="w-full object-cover max-h-[260px]"
                />
              </div>
              <p className="text-[11px] text-gray-500 text-center mt-3">
                Simulação da moldura e sombra exatamente como exibido na Seção 2
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
