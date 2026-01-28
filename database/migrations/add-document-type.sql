-- ============================================
-- MIGRATION: Adicionar suporte a CNPJ e Razão Social
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Adicionar coluna document_type na tabela sales
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CPF' 
CHECK (document_type IN ('CPF', 'CNPJ'));

-- 1.1 Adicionar coluna company_name (Razão Social) na tabela sales
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- 2. Adicionar colunas na tabela customers (se existir)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'customers'
  ) THEN
    ALTER TABLE public.customers 
    ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CPF' 
    CHECK (document_type IN ('CPF', 'CNPJ'));
    
    ALTER TABLE public.customers 
    ADD COLUMN IF NOT EXISTS company_name TEXT;
  END IF;
END $$;

-- 3. Adicionar colunas na tabela abandoned_carts (se existir)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'abandoned_carts'
  ) THEN
    ALTER TABLE public.abandoned_carts 
    ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CPF' 
    CHECK (document_type IN ('CPF', 'CNPJ'));
    
    ALTER TABLE public.abandoned_carts 
    ADD COLUMN IF NOT EXISTS company_name TEXT;
  END IF;
END $$;

-- 4. Adicionar colunas na tabela checkout_attempts (se existir)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'checkout_attempts'
  ) THEN
    ALTER TABLE public.checkout_attempts 
    ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CPF' 
    CHECK (document_type IN ('CPF', 'CNPJ'));
    
    ALTER TABLE public.checkout_attempts 
    ADD COLUMN IF NOT EXISTS company_name TEXT;
  END IF;
END $$;

-- 5. Criar índices para filtros
CREATE INDEX IF NOT EXISTS idx_sales_document_type ON public.sales(document_type);
CREATE INDEX IF NOT EXISTS idx_sales_company_name ON public.sales(company_name) WHERE company_name IS NOT NULL;

-- 6. Comentários explicativos
COMMENT ON COLUMN public.sales.document_type IS 'Tipo de documento do cliente: CPF (Pessoa Física) ou CNPJ (Pessoa Jurídica)';
COMMENT ON COLUMN public.sales.company_name IS 'Razão Social da empresa (preenchido apenas quando document_type = CNPJ)';

-- ✅ FIM DA MIGRATION
-- Após executar, verifique com:
-- SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'sales' AND column_name IN ('document_type', 'company_name');
