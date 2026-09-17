/**
 * Serviço de Gerenciamento e Segurança do Painel Administrativo da Consulpsi
 * Inclui:
 * - Hashing criptográfico SHA-256 com Salt
 * - Proteção contra ataques de força bruta com bloqueio temporal (Lockout)
 * - Sessões com expiração automática (2 horas)
 * - Sanitização de entradas contra XSS e injeção
 */

export interface SiteSettings {
  quemSomosImage: string;
  whatsappNumber: string;
  whatsappDisplay: string;
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
  status: "unread" | "read" | "answered" | "archived";
  notes?: string;
  createdAt: string;
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  userEmail: string;
  token: string;
  loginTime: string;
  expiresAt: number; // Timestamp em ms (2 horas de validade)
}

const STORAGE_KEYS = {
  SETTINGS: "consulpsi_site_settings",
  CASES: "consulpsi_cases_sucesso",
  SUBMISSIONS: "consulpsi_form_submissions",
  AUTH: "consulpsi_admin_auth",
  PASSWORD_HASH: "consulpsi_admin_pwd_hash",
  FAILED_ATTEMPTS: "consulpsi_failed_attempts",
  LOCKOUT_UNTIL: "consulpsi_lockout_until",
};

// Salt fixo da aplicação para hashing de senha
const SALT = "consulpsi_security_salt_2026_@!";
const DEFAULT_PASS_PLAIN = "admin123";
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutos de bloqueio

// Função utilitária de hash SHA-256
export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Sanitização básica de strings
function sanitize(str: string): string {
  if (!str) return "";
  return str
    .replace(/[<>]/g, "") // remove < e >
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

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

const notifyChange = (eventName: string, data?: unknown) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }
};

export const adminService = {
  // ==========================================
  // AUTENTICAÇÃO COM HASH & PROTEÇÃO DE BRUTE FORCE
  // ==========================================
  async getStoredPasswordHash(): Promise<string> {
    const saved = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH);
    if (saved) return saved;
    // Se ainda não houver hash salvo, inicializa com o hash de admin123
    const initialHash = await hashPassword(DEFAULT_PASS_PLAIN);
    localStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, initialHash);
    return initialHash;
  },

  getLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
    const lockoutUntilStr = localStorage.getItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    if (!lockoutUntilStr) return { isLocked: false, remainingSeconds: 0 };

    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    const now = Date.now();
    if (now < lockoutUntil) {
      return {
        isLocked: true,
        remainingSeconds: Math.ceil((lockoutUntil - now) / 1000),
      };
    }
    // Lockout expirou
    localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
    return { isLocked: false, remainingSeconds: 0 };
  },

  async login(password: string, email = "admin@consulpsi.com.br"): Promise<{ success: boolean; message: string }> {
    // 1. Verificar se está bloqueado por força bruta
    const lockout = this.getLockoutStatus();
    if (lockout.isLocked) {
      return {
        success: false,
        message: `Muitas tentativas incorretas. Sistema bloqueado por segurança. Tente novamente em ${lockout.remainingSeconds} segundo(s).`,
      };
    }

    const currentHash = await this.getStoredPasswordHash();
    const inputHash = await hashPassword(password);

    if (inputHash === currentHash) {
      // Sucesso: limpar tentativas falhas
      localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);

      const now = Date.now();
      const session: AdminAuthSession = {
        isAuthenticated: true,
        userEmail: sanitize(email),
        token: `token_${now}_${Math.random().toString(36).substring(2, 12)}`,
        loginTime: new Date(now).toISOString(),
        expiresAt: now + SESSION_DURATION_MS,
      };
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      notifyChange("consulpsi-auth-changed", session);
      return { success: true, message: "Login realizado com sucesso!" };
    }

    // Falha: registrar tentativa
    const attempts = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || "0", 10) + 1;
    localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, attempts.toString());

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(STORAGE_KEYS.LOCKOUT_UNTIL, lockoutUntil.toString());
      return {
        success: false,
        message: `Limite de 5 tentativas excedido. O painel foi bloqueado temporariamente por 5 minutos por segurança.`,
      };
    }

    const remaining = MAX_FAILED_ATTEMPTS - attempts;
    return {
      success: false,
      message: `Senha incorreta. Você tem mais ${remaining} tentativa(s) antes do bloqueio temporário.`,
    };
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

      // Verificar expiração da sessão
      if (!session.expiresAt || Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session.isAuthenticated ? session : null;
    } catch {
      return null;
    }
  },

  async changePassword(currentPass: string, newPass: string): Promise<{ success: boolean; message: string }> {
    const currentHash = await this.getStoredPasswordHash();
    const inputCurrentHash = await hashPassword(currentPass);

    if (inputCurrentHash !== currentHash) {
      return { success: false, message: "Senha atual incorreta." };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, message: "A nova senha deve ter pelo menos 6 caracteres." };
    }

    const newHash = await hashPassword(newPass);
    localStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, newHash);
    return { success: true, message: "Senha alterada com sucesso e protegida com criptografia!" };
  },

  // ==========================================
  // CONFIGURAÇÕES GLOBAIS
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
    const cleanPartial: Partial<SiteSettings> = {};

    if (partial.quemSomosImage !== undefined) cleanPartial.quemSomosImage = partial.quemSomosImage;
    if (partial.whatsappNumber !== undefined) cleanPartial.whatsappNumber = partial.whatsappNumber.replace(/\D/g, "");
    if (partial.whatsappDisplay !== undefined) cleanPartial.whatsappDisplay = sanitize(partial.whatsappDisplay);
    if (partial.whatsappMessage !== undefined) cleanPartial.whatsappMessage = sanitize(partial.whatsappMessage);
    if (partial.contactEmail !== undefined) cleanPartial.contactEmail = sanitize(partial.contactEmail);

    const updated = { ...current, ...cleanPartial };
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
      name: sanitize(data.name),
      role: sanitize(data.role),
      text: sanitize(data.text),
      imageUrl: data.imageUrl,
      orderIndex: list.length,
      active: data.active,
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
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

    const current = list[index];
    list[index] = {
      ...current,
      name: partial.name !== undefined ? sanitize(partial.name) : current.name,
      role: partial.role !== undefined ? sanitize(partial.role) : current.role,
      text: partial.text !== undefined ? sanitize(partial.text) : current.text,
      imageUrl: partial.imageUrl !== undefined ? partial.imageUrl : current.imageUrl,
      active: partial.active !== undefined ? partial.active : current.active,
      orderIndex: partial.orderIndex !== undefined ? partial.orderIndex : current.orderIndex,
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
      name: sanitize(data.name),
      email: sanitize(data.email),
      message: sanitize(data.message),
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
    if (notes !== undefined) item.notes = sanitize(notes);
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
};
