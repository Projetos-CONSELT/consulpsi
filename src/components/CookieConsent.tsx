import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Delay para não aparecer logo de cara
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#66141B]/5 to-transparent pointer-events-none" />

      {/* Main banner container */}
      <div 
        className="relative border-t-2 shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: '#FBF9F7',
          borderTopColor: '#FFB964'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            {/* Left: Icon + Text */}
            <div className="flex items-start md:items-center gap-4 flex-1">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Cookie 
                  size={28} 
                  strokeWidth={1.5}
                  style={{ color: '#FFB964' }}
                  className="flex-shrink-0 mt-0.5 md:mt-0"
                />
              </motion.div>

              <div className="flex-1">
                <p 
                  className="text-sm leading-relaxed font-medium"
                  style={{ color: '#621818' }}
                >
                  Usamos cookies para melhorar sua experiência e análise de tráfego. Ao continuar navegando, você concorda com nossa{' '}
                  <a 
                    href="/privacy-policy" 
                    className="font-semibold underline transition-colors duration-300 hover:opacity-70"
                    style={{ color: '#D84444' }}
                  >
                    Política de Privacidade
                  </a>
                  {' '}e{' '}
                  <a 
                    href="/terms" 
                    className="font-semibold underline transition-colors duration-300 hover:opacity-70"
                    style={{ color: '#D84444' }}
                  >
                    Termos de Uso
                  </a>.
                </p>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
              <button 
                onClick={handleReject}
                className="flex-1 md:flex-initial px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ease-out border-2"
                style={{
                  color: '#621818',
                  borderColor: '#621818',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F0EBE5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Rejeitar
              </button>

              <motion.button 
                onClick={handleAccept}
                className="flex-1 md:flex-initial px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
                style={{
                  backgroundColor: '#FFB964',
                  color: '#fff'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Aceitar Cookies
              </motion.button>
            </div>

            {/* Close button */}
            <button
              onClick={handleReject}
              className="absolute top-4 right-4 md:hidden p-1 hover:opacity-70 transition-opacity"
              aria-label="Fechar"
            >
              <X size={20} style={{ color: '#621818' }} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CookieConsent;
