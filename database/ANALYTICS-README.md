# 🚀 ANALYTICS - GUIA DE EXECUÇÃO

## ⚠️ PROBLEMAS COMUNS

### Erro: "column device_type does not exist"
### Erro: "column utm_source does not exist"

**Causa:** A tabela `analytics_visits` foi criada por um script anterior simples, sem as colunas avançadas (utm_source, utm_medium, utm_campaign, device_type, etc).

**Solução:** Execute o script de **MIGRAÇÃO** (não o de setup inicial).

---

## 📋 QUAL ARQUIVO EXECUTAR?

### ✅ **SE A TABELA JÁ EXISTE** (erro "column does not exist")
**Execute:** `database/ANALYTICS-MIGRATION-REPAIR.sql`

Este script:
- ✅ Adiciona colunas faltantes com `ALTER TABLE`
- ✅ Preserva dados existentes
- ✅ Recria views e índices
- ✅ Configura RLS

---

### ⚙️ **SE QUISER RECRIAR DO ZERO** (apagar tudo)
**Execute antes:**
```sql
DROP TABLE IF EXISTS public.analytics_visits CASCADE;
```

**Depois execute:** `database/ANALYTICS-COMPLETE-SETUP.sql`

---

## 🎯 EXECUÇÃO RECOMENDADA

1. **Acesse Supabase SQL Editor**
   - https://supabase.com/dashboard/project/_/sql

2. **Cole e execute:**
   ```sql
   -- Conteúdo do arquivo: database/ANALYTICS-MIGRATION-REPAIR.sql
   ```

3. **Verifique se funcionou:**
   ```sql
   -- Deve mostrar TODAS as colunas
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'analytics_visits' 
   ORDER BY ordinal_position;
   ```

4. **Teste as views:**
   ```sql
   SELECT * FROM analytics_daily_summary LIMIT 5;
   SELECT * FROM analytics_visitors_online;
   ```

---

## ✅ RESULTADO ESPERADO

Após execução bem-sucedida:
- ✅ Tabela com 20+ colunas (device_type, os, browser, etc)
- ✅ 11 índices criados
- ✅ 2 views funcionando
- ✅ 3 funções auxiliares
- ✅ RLS configurado

---

## 🆘 SE DER ERRO

### Erro: "relation analytics_visits already exists"
**Solução:** Você está executando o arquivo errado. Use `ANALYTICS-MIGRATION-REPAIR.sql`

### Erro: "column already exists"
**Solução:** Ignore, o `IF NOT EXISTS` já protege contra isso.

### Erro: "permission denied"
**Solução:** Execute como usuário `postgres` ou verifique suas permissões.

---

## 📊 ESTRUTURA COMPLETA

Após migração, a tabela terá:

**Navegação:**
- page_path, referrer, referrer_domain

**Sessão:**
- session_id, user_id

**UTMs:**
- utm_source, utm_medium, utm_campaign, utm_content, utm_term

**Dispositivo:**
- device_type, os, browser, browser_version, user_agent

**Geolocalização:**
- ip_address, city, region, country

**Ads Tracking:**
- gclid, fbclid, fbc, fbp

**Status:**
- is_online, last_seen, created_at

---

## 🔗 ARQUIVOS DISPONÍVEIS

1. **ANALYTICS-MIGRATION-REPAIR.sql** ← USE ESTE
   - Para consertar tabela existente
   - Usa ALTER TABLE (não perde dados)

2. **ANALYTICS-COMPLETE-SETUP.sql**
   - Para setup inicial do zero
   - Usa CREATE TABLE IF NOT EXISTS
