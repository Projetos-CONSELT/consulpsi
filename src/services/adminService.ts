/**
 * Serviço de Gerenciamento e Segurança do Painel Administrativo da Consulpsi
 * Inclui:
 * - Sincronização direta com PostgreSQL/Supabase (quando configurado)
 * - Persistência reativa local inteligente como fallback
 * - Hashing criptográfico SHA-256 com Salt
 * - Proteção contra ataques de força bruta com bloqueio temporal (Lockout)
 * - Sessões com expiração automática (2 horas)
 * - Sanitização de entradas contra XSS e injeção
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

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

const SALT = "consulpsi_security_salt_2026_@!";
const DEFAULT_PASS_PLAIN = "admin123";
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000;

export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sanitize(str: string): string {
  if (!str) return "";
  return str
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

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
  // AUTENTICAÇÃO
  // ==========================================
  async getStoredPasswordHash(): Promise<string> {
    const saved = localStorage.getItem(STORAGE_KEYS.PASSWORD_HASH);
    if (saved) return saved;
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
    localStorage.removeItem(STORAGE_KEYS.LOCKOUT_UNTIL);
    localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
    return { isLocked: false, remainingSeconds: 0 };
  },

  async login(password: string, email = "admin@consulpsi.com.br"): Promise<{ success: boolean; message: string }> {
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

  async syncSettingsFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (data && data.length > 0) {
        const mapped: Partial<SiteSettings> = {};
        for (const row of data) {
          if (row.key === "quem_somos_image") mapped.quemSomosImage = row.value;
          if (row.key === "whatsapp_number") mapped.whatsappNumber = row.value;
          if (row.key === "whatsapp_display") mapped.whatsappDisplay = row.value;
          if (row.key === "whatsapp_message") mapped.whatsappMessage = row.value;
          if (row.key === "contact_email") mapped.contactEmail = row.value;
        }
        this.updateSettings(mapped);
      }
    } catch (err) {
      console.warn("Falha ao sincronizar settings com Supabase:", err);
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

    // Sincronizar em segundo plano com Supabase se online
    if (isSupabaseConfigured && supabase) {
      const entries: Array<{ key: string; value: string }> = [];
      if (cleanPartial.quemSomosImage !== undefined) entries.push({ key: "quem_somos_image", value: cleanPartial.quemSomosImage });
      if (cleanPartial.whatsappNumber !== undefined) entries.push({ key: "whatsapp_number", value: cleanPartial.whatsappNumber });
      if (cleanPartial.whatsappDisplay !== undefined) entries.push({ key: "whatsapp_display", value: cleanPartial.whatsappDisplay });
      if (cleanPartial.whatsappMessage !== undefined) entries.push({ key: "whatsapp_message", value: cleanPartial.whatsappMessage });
      if (cleanPartial.contactEmail !== undefined) entries.push({ key: "contact_email", value: cleanPartial.contactEmail });

      Promise.all(
        entries.map((item) =>
          supabase!.from("site_settings").upsert({ key: item.key, value: item.value, updated_at: new Date().toISOString() }, { onConflict: "key" })
        )
      ).catch((err) => console.warn("Erro ao salvar settings no Supabase:", err));
    }

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

  async syncCasesFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase.from("cases_sucesso").select("*").order("order_index", { ascending: true });
      if (data && data.length > 0) {
        const mapped: CaseItem[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          role: row.role,
          text: row.text,
          imageUrl: row.image_url,
          orderIndex: row.order_index,
          active: row.active,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(mapped));
        notifyChange("consulpsi-cases-changed", mapped);
      }
    } catch (err) {
      console.warn("Falha ao sincronizar cases com Supabase:", err);
    }
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

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("cases_sucesso")
        .insert({
          name: newCase.name,
          role: newCase.role,
          text: newCase.text,
          image_url: newCase.imageUrl,
          order_index: newCase.orderIndex,
          active: newCase.active,
        })
        .catch((err) => console.warn("Erro ao inserir case no Supabase:", err));
    }

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

    if (isSupabaseConfigured && supabase) {
      const dbUpdate: Record<string, unknown> = {};
      if (partial.name !== undefined) dbUpdate.name = partial.name;
      if (partial.role !== undefined) dbUpdate.role = partial.role;
      if (partial.text !== undefined) dbUpdate.text = partial.text;
      if (partial.imageUrl !== undefined) dbUpdate.image_url = partial.imageUrl;
      if (partial.active !== undefined) dbUpdate.active = partial.active;
      if (partial.orderIndex !== undefined) dbUpdate.order_index = partial.orderIndex;

      supabase
        .from("cases_sucesso")
        .update(dbUpdate)
        .eq("id", id)
        .catch((err) => console.warn("Erro ao atualizar case no Supabase:", err));
    }

    return list[index];
  },

  deleteCase(id: string): boolean {
    const list = this.getCases().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(list));
    notifyChange("consulpsi-cases-changed", list);

    if (isSupabaseConfigured && supabase) {
      supabase.from("cases_sucesso").delete().eq("id", id).catch((err) => console.warn("Erro ao deletar no Supabase:", err));
    }

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

  async syncSubmissionsFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase.from("form_submissions").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const mapped: FormSubmission[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          message: row.message,
          status: row.status,
          notes: row.notes,
          createdAt: row.created_at,
        }));
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(mapped));
        notifyChange("consulpsi-submissions-changed", mapped);
      }
    } catch (err) {
      console.warn("Falha ao sincronizar form_submissions com Supabase:", err);
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

    if (isSupabaseConfigured && supabase) {
      supabase
        .from("form_submissions")
        .insert({
          name: newSubmission.name,
          email: newSubmission.email,
          message: newSubmission.message,
          status: "unread",
        })
        .catch((err) => console.warn("Erro ao salvar mensagem no Supabase:", err));
    }

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

    if (isSupabaseConfigured && supabase) {
      supabase.from("form_submissions").update({ status, notes }).eq("id", id).catch((err) => console.warn("Erro ao atualizar status no Supabase:", err));
    }

    return true;
  },

  deleteSubmission(id: string): boolean {
    const list = this.getFormSubmissions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
    notifyChange("consulpsi-submissions-changed", list);

    if (isSupabaseConfigured && supabase) {
      supabase.from("form_submissions").delete().eq("id", id).catch((err) => console.warn("Erro ao deletar lead no Supabase:", err));
    }

    return true;
  },
};

// Executar sincronização inicial com Supabase se estiver configurado
if (typeof window !== "undefined") {
  adminService.syncSettingsFromSupabase();
  adminService.syncCasesFromSupabase();
  adminService.syncSubmissionsFromSupabase();
}
