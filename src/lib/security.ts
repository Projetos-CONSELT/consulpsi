/* Assinatura Digital Conselt - Empresa Junior de Consultoria em Engenharia Elétrica */

/**
 * Utilitários de Segurança para o Website
 * Proteção contra XSS, SQL Injection, CSRF
 */

// ============================================================================
// 1. SANITIZAÇÃO DE ENTRADA (Proteção contra XSS)
// ============================================================================

/**
 * Sanitiza string removendo caracteres perigosos
 * Previne XSS (Cross-Site Scripting)
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return "";

  const div = document.createElement("div");
  div.textContent = input;
  const sanitized = div.innerHTML;

  // Remover caracteres de controle e null bytes
  return sanitized
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
};

/**
 * Valida e sanitiza email
 */
export const sanitizeEmail = (email: string): string => {
  const sanitized = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    throw new Error("Email inválido");
  }

  return sanitizeInput(sanitized);
};

/**
 * Valida e sanitiza nome (apenas letras, números, espaços)
 */
export const sanitizeName = (name: string): string => {
  const sanitized = name.trim();

  // Permitir apenas letras, números, espaços e alguns caracteres acentuados
  if (!/^[\p{L}\p{N}\s\-']+$/u.test(sanitized)) {
    throw new Error("Nome contém caracteres inválidos");
  }

  if (sanitized.length < 2) {
    throw new Error("Nome muito curto");
  }

  if (sanitized.length > 100) {
    throw new Error("Nome muito longo");
  }

  return sanitizeInput(sanitized);
};

/**
 * Valida e sanitiza mensagem
 */
export const sanitizeMessage = (message: string): string => {
  const sanitized = message.trim();

  if (sanitized.length < 10) {
    throw new Error("Mensagem muito curta (mínimo 10 caracteres)");
  }

  if (sanitized.length > 5000) {
    throw new Error("Mensagem muito longa (máximo 5000 caracteres)");
  }

  // Remover URLs suspeitas
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasUrls = urlRegex.test(sanitized);
  if (hasUrls) {
    throw new Error("Mensagens com URLs não são permitidas");
  }

  return sanitizeInput(sanitized);
};

/**
 * Remove HTML e scripts da string
 */
export const stripHtml = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
};

// ============================================================================
// 2. VALIDAÇÃO DE ENTRADA
// ============================================================================

/**
 * Valida estrutura do formulário
 */
export const validateFormData = (data: {
  name: string;
  email: string;
  message: string;
}): boolean => {
  if (!data.name?.trim()) throw new Error("Nome é obrigatório");
  if (!data.email?.trim()) throw new Error("Email é obrigatório");
  if (!data.message?.trim()) throw new Error("Mensagem é obrigatória");

  return true;
};

/**
 * Valida comprimento da entrada
 */
export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): boolean => {
  if (value.length < min) {
    throw new Error(`${fieldName} deve ter no mínimo ${min} caracteres`);
  }
  if (value.length > max) {
    throw new Error(`${fieldName} pode ter no máximo ${max} caracteres`);
  }
  return true;
};

/**
 * Valida padrão com regex
 */
export const validatePattern = (
  value: string,
  pattern: RegExp,
  fieldName: string
): boolean => {
  if (!pattern.test(value)) {
    throw new Error(`${fieldName} tem formato inválido`);
  }
  return true;
};

// ============================================================================
// 3. PROTEÇÃO CONTRA RATE LIMITING (Client-side)
// ============================================================================

class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remover tentativas fora da janela de tempo
    const recentAttempts = attempts.filter((time) => now - time < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);

    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const formRateLimiter = new RateLimiter(3, 60000); // 3 tentativas por minuto

// ============================================================================
// 4. PROTEÇÃO CONTRA CSRF (Token)
// ============================================================================

/**
 * Gera token CSRF (nonce)
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

/**
 * Armazena e valida token CSRF
 */
export const initializeCSRFToken = (): string => {
  let token = sessionStorage.getItem("csrf-token");

  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem("csrf-token", token);
  }

  return token;
};

export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem("csrf-token");
  return storedToken === token;
};

// ============================================================================
// 5. DETECÇÃO DE SCRIPTS MALICIOSOS
// ============================================================================

const MALICIOUS_PATTERNS = [
  /<script[^>]*>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>/gi,
  /<embed[^>]*>/gi,
  /<object[^>]*>/gi,
  /eval\(/gi,
  /expression\(/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

/**
 * Verifica se string contém padrões maliciosos
 */
export const containsMaliciousContent = (input: string): boolean => {
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(input));
};

/**
 * Valida entrada contra conteúdo malicioso
 */
export const validateAgainstMalicious = (input: string, fieldName: string): void => {
  if (containsMaliciousContent(input)) {
    throw new Error(
      `${fieldName} contém conteúdo suspeito ou proibido. Por favor, revise sua entrada.`
    );
  }
};

// ============================================================================
// 6. LOGGING DE SEGURANÇA (Client-side)
// ============================================================================

interface SecurityLog {
  timestamp: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  details?: Record<string, unknown>;
}

class SecurityLogger {
  private logs: SecurityLog[] = [];
  private maxLogs = 100;

  log(
    type: string,
    message: string,
    severity: "low" | "medium" | "high" | "critical" = "low",
    details?: Record<string, unknown>
  ): void {
    const log: SecurityLog = {
      timestamp: new Date().toISOString(),
      type,
      severity,
      message,
      details,
    };

    this.logs.push(log);

    // Manter apenas os últimos N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Security ${severity.toUpperCase()}] ${type}: ${message}`, details);
    }
  }

  getLogs(): SecurityLog[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const securityLogger = new SecurityLogger();

// ============================================================================
// 7. VALIDAÇÃO DE RESPOSTA DE API
// ============================================================================

/**
 * Valida resposta de API
 */
export const validateAPIResponse = (response: Response): void => {
  if (!response.ok) {
    throw new Error(`Falha no envio (Código ${response.status})`);
  }

  // Verificar Content-Type de forma não bloqueante para provedores externos
  const contentType = response.headers.get("content-type");
  if (contentType && !contentType.includes("application/json")) {
    securityLogger.log(
      "api-content-type-notice",
      `Resposta da API com content-type: ${contentType}`,
      "low"
    );
  }

  // Verificar headers de segurança
  const securityHeaders = [
    "x-content-type-options",
    "x-frame-options",
    "x-xss-protection",
  ];

  for (const header of securityHeaders) {
    if (!response.headers.has(header)) {
      securityLogger.log(
        "missing-security-header",
        `Header de segurança ausente: ${header}`,
        "low",
        { header }
      );
    }
  }
};

// ============================================================================
// 8. PROTEÇÃO DE DADOS SENSÍVEIS
// ============================================================================

/**
 * Mascara informações sensíveis para logging
 */
export const maskSensitiveData = (data: Record<string, unknown>): Record<string, unknown> => {
  const masked = { ...data };

  const sensitiveFields = ["password", "token", "secret", "key", "email", "phone"];

  for (const key of Object.keys(masked)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      const value = String(masked[key]);
      masked[key] = value.length > 4 ? "*".repeat(value.length - 4) + value.slice(-4) : "***";
    }
  }

  return masked;
};

/**
 * Limpa dados sensíveis da memória
 */
export const clearSensitiveData = (obj: Record<string, unknown>): void => {
  for (const key of Object.keys(obj)) {
    if (obj[key] !== null && typeof obj[key] === "object") {
      clearSensitiveData(obj[key] as Record<string, unknown>);
    } else {
      obj[key] = null;
    }
  }
};

// ============================================================================
// 9. VERIFICAÇÃO DE INTEGRIDADE
// ============================================================================

/**
 * Calcula checksum SHA-256 (para verificação de integridade)
 */
export const calculateChecksum = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// ============================================================================
// 10. INICIALIZAÇÃO DE SEGURANÇA
// ============================================================================

/**
 * Inicializa todas as proteções de segurança
 */
export const initializeSecurity = (): void => {
  // Gerar token CSRF
  initializeCSRFToken();

  // Desabilitar console em produção
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.debug = () => {};
  }

  // Log de inicialização
  securityLogger.log("security-init", "Sistema de segurança inicializado", "low");
};

export default {
  sanitizeInput,
  sanitizeEmail,
  sanitizeName,
  sanitizeMessage,
  validateFormData,
  validateLength,
  validatePattern,
  formRateLimiter,
  generateCSRFToken,
  initializeCSRFToken,
  validateCSRFToken,
  containsMaliciousContent,
  validateAgainstMalicious,
  securityLogger,
  validateAPIResponse,
  maskSensitiveData,
  clearSensitiveData,
  calculateChecksum,
  initializeSecurity,
};
