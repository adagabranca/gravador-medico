-- Adicionar coluna avatar_url na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Adicionar coluna name se não existir
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS name text;
