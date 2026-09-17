import { useState, useEffect } from "react";
import { adminService, SiteSettings, CaseItem } from "@/services/adminService";

export const useSiteContent = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => adminService.getSettings());
  const [cases, setCases] = useState<CaseItem[]>(() => adminService.getActiveCases());

  useEffect(() => {
    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        setSettings(adminService.getSettings());
      }
    };

    const handleCasesChange = (e: Event) => {
      const customEvent = e as CustomEvent<CaseItem[]>;
      if (customEvent.detail) {
        setCases(customEvent.detail.filter((c) => c.active));
      } else {
        setCases(adminService.getActiveCases());
      }
    };

    window.addEventListener("consulpsi-settings-changed", handleSettingsChange);
    window.addEventListener("consulpsi-cases-changed", handleCasesChange);

    return () => {
      window.removeEventListener("consulpsi-settings-changed", handleSettingsChange);
      window.removeEventListener("consulpsi-cases-changed", handleCasesChange);
    };
  }, []);

  return {
    settings,
    cases,
    whatsappNumber: settings.whatsappNumber,
    whatsappDisplay: settings.whatsappDisplay,
    whatsappMessage: settings.whatsappMessage,
    quemSomosImage: settings.quemSomosImage,
    contactEmail: settings.contactEmail,
  };
};
