# Configuração de Segurança para Produção — Consulpsi
## Nginx / Apache Configuration Files

---

## 🔒 NGINX Configuration (nginx.conf)

```nginx
# ============================================================================
# CONFIGURAÇÃO DE SEGURANÇA CONSULPSI - NGINX
# ============================================================================

# Upstream backend (se usar proxy)
upstream backend {
    server localhost:3000;
}

# Redirecionar HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name www.consulpsi.com.br consulpsi.com.br;
    
    # Permitir ACME challenge para Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirecionar todo o resto para HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Servidor HTTPS principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.consulpsi.com.br;
    
    # ========== SSL/TLS ==========
    ssl_certificate /etc/letsencrypt/live/www.consulpsi.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.consulpsi.com.br/privkey.pem;
    
    # SSL Protocol
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/www.consulpsi.com.br/chain.pem;
    
    # ========== HEADERS DE SEGURANÇA ==========
    
    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # CSP (Content Security Policy)
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://formsubmit.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://formsubmit.co; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://formsubmit.co;" always;
    
    # X-Content-Type-Options
    add_header X-Content-Type-Options "nosniff" always;
    
    # X-Frame-Options
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # X-XSS-Protection
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Referrer-Policy
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Permissions-Policy
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Remove server header
    server_tokens off;
    
    # ========== COMPRESSÃO ==========
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/atom+xml image/svg+xml;
    
    # ========== CACHE ==========
    location ~* \\.(?:jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # ========== ROOT & ÍNDICE ==========
    root /var/www/html/consulpsi/dist;
    index index.html;
    
    # ========== SPA ROUTING ==========
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # ========== RATE LIMITING ==========
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=form:10m rate=3r/m;
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend;
    }
    
    location /contact {
        limit_req zone=form burst=3 nodelay;
    }
    
    # ========== LOGS ==========
    access_log /var/log/nginx/consulpsi_access.log combined;
    error_log /var/log/nginx/consulpsi_error.log warn;
    
    # ========== FIREWALL REGRAS ==========
    
    # Bloquear requisições suspeitas
    if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$) {
        return 405;
    }
    
    # Bloquear User-Agents suspeitos
    if ($http_user_agent ~* (bot|crawler|spider|scraper|curl|wget)) {
        return 403;
    }
    
    # Bloquear requisições com payloads SQL injection
    if ($query_string ~* "(union|select|insert|update|delete|drop|create|alter|exec|execute)") {
        return 403;
    }
    
    # Bloquear requisições XSS
    if ($query_string ~* "(<|%3C|%3E|>|\\*|javascript:|onerror=|onclick=)") {
        return 403;
    }
    
    # ========== CERTIFICADO AUTO-RENEWAL ==========
    # Configurar cron job:
    # 0 0 * * * /usr/bin/certbot renew --quiet
}

# Redirecionar consulpsi.com.br para www.consulpsi.com.br
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name consulpsi.com.br;
    
    ssl_certificate /etc/letsencrypt/live/www.consulpsi.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.consulpsi.com.br/privkey.pem;
    
    return 301 https://www.consulpsi.com.br$request_uri;
}
```

---

## 🔒 APACHE Configuration (.htaccess / apache2.conf)

```apache
# ============================================================================
# CONFIGURAÇÃO DE SEGURANÇA CONSULPSI - APACHE
# ============================================================================

# Ativar mods necessários
<IfModule mod_ssl.c>
    SSLEngine on
    SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLHonorCipherOrder on
</IfModule>

# Ativar mod_rewrite
<IfModule mod_rewrite.c>
    RewriteEngine On
</IfModule>

# ============================================================================
# HEADERS DE SEGURANÇA
# ============================================================================

# HSTS (HTTP Strict Transport Security)
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# CSP (Content Security Policy)
Header always set Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://formsubmit.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://formsubmit.co; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://formsubmit.co;"

# X-Content-Type-Options
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Permissions-Policy
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# Remove server header
Header always unset Server
Header unset X-Powered-By

# ============================================================================
# REDIRECIONAR HTTP → HTTPS
# ============================================================================

<IfModule mod_rewrite.c>
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Redirecionar para www
    RewriteCond %{HTTP_HOST} !^www\. [NC]
    RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# ============================================================================
# COMPRESSÃO
# ============================================================================

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# ============================================================================
# CACHE
# ============================================================================

<IfModule mod_expires.c>
    ExpiresActive On
    
    # Cache de longa duração para assets
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-font-ttf "access plus 1 year"
    ExpiresByType font/opentype "access plus 1 year"
    ExpiresByType application/x-font-woff "access plus 1 year"
    
    # Cache curto para HTML
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType application/json "access plus 0 seconds"
</IfModule>

# ============================================================================
# PROTEÇÃO CONTRA ATAQUES
# ============================================================================

# Bloquear acesso a arquivos sensíveis
<FilesMatch "^\\.(htaccess|htpasswd|env|git|svn)$">
    Deny from all
</FilesMatch>

# Bloquear requisições suspeitas
<IfModule mod_rewrite.c>
    # SQL Injection
    RewriteCond %{QUERY_STRING} (union|select|insert|update|delete|drop|create|alter|exec|execute) [NC]
    RewriteRule ^ - [F,L]
    
    # XSS
    RewriteCond %{QUERY_STRING} (<|%3C|%3E|>|\\*|javascript:|onerror=|onclick=) [NC]
    RewriteRule ^ - [F,L]
    
    # Path Traversal
    RewriteCond %{REQUEST_URI} (\\.\\./|\\.\\.\\\\) [NC]
    RewriteRule ^ - [F,L]
</IfModule>

# ============================================================================
# SPA ROUTING (React Router)
# ============================================================================

<IfModule mod_rewrite.c>
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [QSA,L]
</IfModule>

# ============================================================================
# DESABILITAR DIRETÓRIO LISTING
# ============================================================================

Options -Indexes

# ============================================================================
# DESABILITAR SCRIPTS EM DIRETÓRIOS ESPECÍFICOS
# ============================================================================

<Directory /var/www/html/consulpsi/uploads>
    php_flag engine off
    AddType text/plain .php .phtml .php3 .php4 .php5 .phps
    <FilesMatch "\\.php$">
        Deny from all
    </FilesMatch>
</Directory>

# ============================================================================
# LIMIT REQUEST (Rate Limiting)
# ============================================================================

<IfModule mod_ratelimit.c>
    # Limitar requisições gerais
    <Location />
        SetOutputFilter RATE_LIMIT
        ModRateLimit rate=100 window=10
    </Location>
    
    # Limitar formulário
    <Location /contact>
        SetOutputFilter RATE_LIMIT
        ModRateLimit rate=3 window=60
    </Location>
</IfModule>

# ============================================================================
# LOGS
# ============================================================================

LogLevel warn
ErrorLog /var/log/apache2/consulpsi_error.log
CustomLog /var/log/apache2/consulpsi_access.log combined

# ============================================================================
# TIMEOUT
# ============================================================================

Timeout 300
KeepAlive On
KeepAliveTimeout 5
```

---

## 📋 Instalação (Let's Encrypt)

### Passo 1: Instalar Certbot

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
# ou para Apache:
sudo apt-get install certbot python3-certbot-apache
```

**CentOS/RHEL:**
```bash
sudo yum install certbot python3-certbot-nginx
# ou para Apache:
sudo yum install certbot python3-certbot-apache
```

### Passo 2: Gerar Certificado

**Nginx:**
```bash
sudo certbot certonly --nginx -d www.consulpsi.com.br -d consulpsi.com.br
```

**Apache:**
```bash
sudo certbot certonly --apache -d www.consulpsi.com.br -d consulpsi.com.br
```

### Passo 3: Auto-Renovação

```bash
# Testar renovação
sudo certbot renew --dry-run

# Habilitar renovação automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar status
sudo systemctl status certbot.timer
```

### Passo 4: Teste de SSL

```bash
# Testar configuração Nginx
sudo nginx -t

# Testar configuração Apache
sudo apache2ctl configtest

# Recarregar servidor
sudo systemctl reload nginx
# ou
sudo systemctl reload apache2
```

---

## 🧪 Validação

### Teste 1: SSL Labs

```
Acesse: https://www.ssllabs.com/ssltest/
Teste: www.consulpsi.com.br
Resultado esperado: Grade A ou A+
```

### Teste 2: Mozilla Observatory

```
Acesse: https://observatory.mozilla.org/
Teste: www.consulpsi.com.br
Resultado esperado: Grade A- ou A
```

### Teste 3: SecurityHeaders

```
Acesse: https://securityheaders.com/
Teste: www.consulpsi.com.br
Resultado esperado: Grade A
```

---

## 🔔 Alertas Importantes

⚠️ **NGINX:**
- Substituir `/var/www/html/consulpsi/dist` pelo caminho real
- Configurar certificado SSL real
- Testar com `nginx -t` antes de reload

⚠️ **APACHE:**
- Ativar mods: `a2enmod rewrite`, `a2enmod headers`, `a2enmod ssl`
- Substituir caminhos reais
- Reinicar: `systemctl restart apache2`

⚠️ **LETÃ€™S ENCRYPT:**
- Email válido obrigatório para renovação
- Renovação automática (30 dias antes de expirar)
- Testar renovação com `--dry-run`

---

*Configuração preparada em 23 de abril de 2026*
