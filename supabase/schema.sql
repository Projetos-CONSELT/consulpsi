-- ==============================================================================
-- Schema SQL para Consulpsi - Painel Administrativo e Banco de Dados PostgreSQL/Supabase
-- ==============================================================================

-- 1. Tabela de Configurações Globais do Site (Chave-Valor)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Cases de Sucesso (Depoimentos)
CREATE TABLE IF NOT EXISTS cases_sucesso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Respostas do Formulário de Contato (Leads)
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'answered', 'archived')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Administradores
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- ==============================================================================
-- Políticas de Segurança RLS (Row Level Security)
-- ==============================================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases_sucesso ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para site_settings (Público pode ler, apenas admins alteram)
CREATE POLICY "Permitir leitura pública das configurações" 
    ON site_settings FOR SELECT 
    USING (true);

CREATE POLICY "Permitir atualização por admins autenticados" 
    ON site_settings FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Políticas para cases_sucesso (Público pode ler os ativos, admins gerenciam tudo)
CREATE POLICY "Permitir leitura pública dos cases ativos" 
    ON cases_sucesso FOR SELECT 
    USING (active = true);

CREATE POLICY "Permitir gestão de cases por admins autenticados" 
    ON cases_sucesso FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Políticas para form_submissions (Público pode inserir novos leads, apenas admins leem e gerenciam)
CREATE POLICY "Permitir envio anônimo do formulário de contato" 
    ON form_submissions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Permitir visualização e gestão de leads por admins" 
    ON form_submissions FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- ==============================================================================
-- Seeds / Dados Iniciais
-- ==============================================================================

-- Configurações Iniciais
INSERT INTO site_settings (key, value, description)
VALUES 
    ('quem_somos_image', '', 'URL ou base64 da imagem da seção Quem Somos'),
    ('whatsapp_number', '5534988378444', 'Número do WhatsApp no formato internacional'),
    ('whatsapp_display', '(34) 98837-8444', 'Número do WhatsApp formatado para exibição visual'),
    ('whatsapp_message', 'Olá! Gostaria de saber mais sobre os serviços da Consulpsi.', 'Mensagem padrão enviada ao iniciar conversa no WhatsApp'),
    ('contact_email', 'vendasconsulpsi@gmail.com', 'E-mail oficial de contato')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, updated_at = now();

-- Cases de Sucesso Iniciais
INSERT INTO cases_sucesso (name, role, text, image_url, order_index, active)
VALUES 
    (
        'Mariana',
        'Sócia — Casa do Salgado',
        'A experiência com a empresa júnior foi extremamente produtiva. Tudo o que solicitamos nas reuniões de alinhamento foi plenamente atendido pela equipe. O treinamento de liderança foi didático e muito explicativo, com dinâmicas que facilitaram o aprendizado e desenvolveram a empatia no time.\n\nO impacto foi tão positivo que, hoje, utilizo o conteúdo do treinamento junto ao meu mentor na estruturação dos cargos da empresa. Foi excelente para a equipe, e buscamos sempre rememorar e aplicar esse aprendizado no dia a dia.',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana',
        0,
        true
    )
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- Gatilho para Atualização Automática de updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cases_sucesso_updated_at 
    BEFORE UPDATE ON cases_sucesso 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
