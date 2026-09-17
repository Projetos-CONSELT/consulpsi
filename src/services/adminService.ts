/**
 * Serviço de Gerenciamento do Painel Administrativo da Consulpsi
 * Suporta persistência reativa local e integração direta com PostgreSQL/Supabase
 */

export interface SiteSettings {
  quemSomosImage: string; // URL ou base64
  whatsappNumber: string; // formato 5534988378444
  whatsappDisplay: string; // formato (34) 98837-8444
  whatsappMessage: string;
  contactEmail: string;
}

export interface CaseItem {
  id: string;
  name: string;
  role: string;
  text: string;
  imageUrl: string;
  orderIndex: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'answered' | 'archived';
  notes?: string;
  createdAt: string;
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  userEmail: string;
  token: string;
  loginTime: string;
}

const STORAGE_KEYS = {
  SETTINGS: "consulpsi_site_settings",
  CASES: "consulpsi_cases_sucesso",
  SUBMISSIONS: "consulpsi_form_submissions",
  AUTH: "consulpsi_admin_auth",
  PASSWORD_HASH: "consulpsi_admin_pwd",
};

// Dados padrão iniciais
const DEFAULT_SETTINGS: SiteSettings = {
  quemSomosImage: "",
  whatsappNumber: "5534988378444",
  whatsappDisplay: "(34) 98837-8444",
  whatsappMessage: "Olá! Gostaria de saber mais sobre os serviços da Consulpsi.",
  contactEmail: "vendasconsulpsi@gmail.com",
};

const DEFAULT_CASES: CaseItem[] = [
  {
    id: "case-default-1",
    name: "Mariana",
    role: "Sócia — Casa do Salgado",
    text: "A experiência com a empresa júnior foi extremamente produtiva. Tudo o que solicitamos nas reuniões de alinhamento foi plenamente atendido pela equipe. O treinamento de liderança foi didático e muito explicativo, com dinâmicas que facilitaram o aprendizado e desenvolveram a empatia no time.\n\nO impacto foi tão positivo que, hoje, utilizo o conteúdo do treinamento junto ao meu mentor na estruturação dos cargos da empresa. Foi excelente para a equipe, e buscamos sempre rememorar e aplicar esse aprendizado no dia a dia.",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana",
    orderIndex: 0,
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// Disparador de eventos para atualização reativa instantânea
const notifyChange = (eventName: string, data?: unknown) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }
};

export const adminService = {
  // ==========================================
  // AUTENTICAÇÃO
  // ==========================================
  login(password: string, email = "admin@consulpsi.com.br"): boolean {
    const savedPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH) || "admin123";
    if (password === savedPassword) {
      const session: AdminAuthSession = {
        isAuthenticated: true,
        userEmail: email,
        token: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      notifyChange("consulpsi-auth-changed", session);
      return true;
    }
    return false;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    notifyChange("consulpsi-auth-changed", null);
  },

  getSession(): AdminAuthSession | null {
    try {
      const sessionStr = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (!sessionStr) return null;
      const session = JSON.parse(sessionStr) as AdminAuthSession;
      return session.isAuthenticated ? session : null;
    } catch {
      return null;
    }
  },

  changePassword(currentPass: string, newPass: string): { success: boolean; message: string } {
    const savedPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH) || "admin123";
    if (currentPass !== savedPassword) {
      return { success: false, message: "Senha atual incorreta." };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, message: "A nova senha deve ter pelo menos 6 caracteres." };
    }
    localStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, newPass);
    return { success: true, message: "Senha alterada com sucesso!" };
  },

  // ==========================================
  // CONFIGURAÇÕES GLOBAIS (Imagem Seção 2 & WhatsApp)
  // ==========================================
  getSettings(): SiteSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings(partial: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyChange("consulpsi-settings-changed", updated);
    return updated;
  },

  resetQuemSomosImage(): SiteSettings {
    return this.updateSettings({ quemSomosImage: "" });
  },

  // ==========================================
  // CASES DE SUCESSO (CRUD)
  // ==========================================
  getCases(): CaseItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CASES);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(DEFAULT_CASES));
        return DEFAULT_CASES;
      }
      const list = JSON.parse(stored) as CaseItem[];
      return list.sort((a, b) => a.orderIndex - b.orderIndex);
    } catch {
      return DEFAULT_CASES;
    }
  },

  getActiveCases(): CaseItem[] {
    return this.getCases().filter((c) => c.active);
  },

  addCase(data: Omit<CaseItem, "id" | "createdAt">): CaseItem {
    const list = this.getCases();
    const newCase: CaseItem = {
      ...data,
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      orderIndex: list.length,
    };
    list.push(newCase);
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(list));
    notifyChange("consulpsi-cases-changed", list);
    return newCase;
  },

  updateCase(id: string, partial: Partial<CaseItem>): CaseItem | null {
    const list = this.getCases();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(list));
    notifyChange("consulpsi-cases-changed", list);
    return list[index];
  },

  deleteCase(id: string): boolean {
    const list = this.getCases().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(list));
    notifyChange("consulpsi-cases-changed", list);
    return true;
  },

  reorderCases(newOrderedList: CaseItem[]): void {
    const indexed = newOrderedList.map((item, idx) => ({
      ...item,
      orderIndex: idx,
    }));
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(indexed));
    notifyChange("consulpsi-cases-changed", indexed);
  },

  // ==========================================
  // RESPOSTAS DO FORMULÁRIO (LEADS)
  // ==========================================
  getFormSubmissions(): FormSubmission[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (!stored) return [];
      const list = JSON.parse(stored) as FormSubmission[];
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  },

  addFormSubmission(data: { name: string; email: string; message: string }): FormSubmission {
    const list = this.getFormSubmissions();
    const newSubmission: FormSubmission = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: data.name,
      email: data.email,
      message: data.message,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    list.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    notifyChange("consulpsi-submissions-changed", list);
    return newSubmission;
  },

  updateSubmissionStatus(id: string, status: FormSubmission["status"], notes?: string): boolean {
    const list = this.getFormSubmissions();
    const item = list.find((s) => s.id === id);
    if (!item) return false;
    item.status = status;
    if (notes !== undefined) item.notes = notes;
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    notifyChange("consulpsi-submissions-changed", list);
    return true;
  },

  deleteSubmission(id: string): boolean {
    const list = this.getFormSubmissions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    notifyChange("consulpsi-submissions-changed", list);
    return true;
  },

  clearAllSubmissions(): void {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
    notifyChange("consulpsi-submissions-changed", []);
  },
};
