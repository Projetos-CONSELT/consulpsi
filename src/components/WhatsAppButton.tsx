import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5534999990000?text=Olá! Gostaria de saber mais sobre os serviços da Consulpsi."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="text-primary-foreground" size={28} />
    </a>
  );
};

export default WhatsAppButton;
