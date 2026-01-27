# 🔐 VARIÁVEIS DE AMBIENTE PARA O VERCEL

## ✅ COPIE E COLE NO VERCEL (Environment Variables)

```bash
# =====================================================
# 🗄️ SUPABASE
# =====================================================
NEXT_PUBLIC_SUPABASE_URL=https://egsmraszqnmosmtjuzhx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc21yYXN6cW5tb3NtdGp1emh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0ODc3MTAsImV4cCI6MjA4NDA2MzcxMH0.YM1hLi1QDQZCIXD1YomvJOmRhGKnAYgmcOOQyTPVk6U
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc21yYXN6cW5tb3NtdGp1emh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ4NzcxMCwiZXhwIjoyMDg0MDYzNzEwfQ.wuM5GbYqaDTyf4T3fR62U1sWqZ06RJ3nXHk56I2VcAQ
JWT_SECRET=gravador-medico-jwt-secret-2026-secure-key-production

# =====================================================
# 💳 MERCADO PAGO
# =====================================================
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-ce68e22a-f349-4b30-b597-c06c7311d9f4
MERCADOPAGO_ACCESS_TOKEN=APP_USR-8963380272153266-012620-b44f7e59d0d47b079c523ee25d19a968-1537908999
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret_here

# =====================================================
# 💰 APPMAX
# =====================================================
APPMAX_TOKEN=D2555D74-9B58764C-3F04CB59-14BF2F64
APPMAX_PRODUCT_ID=32880073
APPMAX_API_KEY=D2555D74-9B58764C-3F04CB59-14BF2F64

# =====================================================
# 🛡️ CLOUDFLARE TURNSTILE
# =====================================================
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAzN8YWLb-MvBG95
TURNSTILE_SECRET_KEY=0x4AAAAAAAzN8WRhx8VQkQkLMx9e83rk0gB

# =====================================================
# 📧 RESEND (Opcional - Emails)
# =====================================================
RESEND_API_KEY=re_123456789_SUBSTITUA_PELA_SUA_CHAVE
EMAIL_FROM=noreply@seudominio.com

# =====================================================
# 🔐 WEBHOOK SECRETS
# =====================================================
WEBHOOK_APPMAX_SECRET=webhook-appmax-2026-secure-key
WEBHOOK_MERCADOPAGO_SECRET=webhook-mp-2026-secure-key

# =====================================================
# 🌐 LOVABLE EDGE FUNCTION
# =====================================================
LOVABLE_API_SECRET=webhook-appmax-2026-secure-key
LOVABLE_API_URL=https://acouwzdniytqhaesgtpr.supabase.co/functions/v1/admin-user-manager
NEXT_PUBLIC_LOVABLE_EDGE_FUNCTION_URL=https://acouwzdniytqhaesgtpr.supabase.co/functions/v1/admin-user-manager
NEXT_PUBLIC_LOVABLE_APP_URL=https://gravador-medico.lovable.app

# =====================================================
# ⚙️ APP CONFIG
# =====================================================
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
CRON_SECRET=cron-secret-2026-gravador-medico-secure
```

---

## 📝 INSTRUÇÕES:

### 1️⃣ NO VERCEL DASHBOARD:
- Vá em: **Settings** → **Environment Variables**
- Cole cada variável (Nome e Valor)
- Aplique para: **Production, Preview, Development**

### 2️⃣ VARIÁVEIS QUE VOCÊ PRECISA ATUALIZAR DEPOIS DO DEPLOY:

✅ **NEXT_PUBLIC_APP_URL**:
- Depois do deploy, atualize com sua URL do Vercel
- Exemplo: `https://gravador-medico-xyz.vercel.app`

⚠️ **MERCADOPAGO_WEBHOOK_SECRET**:
- Depois do deploy, configure o webhook no Mercado Pago
- Use a URL: `https://seu-dominio.vercel.app/api/webhooks/mercadopago-v3`
- Copie o secret gerado e atualize no Vercel

✅ **RESEND_API_KEY** (Opcional):
- Se quiser emails, crie conta em https://resend.com
- Obtenha a API key e adicione
- Atualize também o **EMAIL_FROM** com seu domínio

### 3️⃣ ✅ VARIÁVEIS JÁ CONFIGURADAS CORRETAMENTE:

✅ **SUPABASE**: Todas as 3 variáveis configuradas  
✅ **MERCADO PAGO**: Public Key e Access Token  
✅ **APPMAX**: Token atualizado! ➡️ `D2555D74-9B58764C-3F04CB59-14BF2F64`  
✅ **CLOUDFLARE TURNSTILE**: Site Key e Secret Key  
✅ **LOVABLE**: API URL e Secret  
✅ **WEBHOOK SECRETS**: AppMax e Mercado Pago  
✅ **JWT_SECRET**: Configurado  
✅ **CRON_SECRET**: Configurado  

### 4️⃣ DEPOIS DE ADICIONAR TODAS:
- Clique em **"Deploy"**
- Aguarde o build (2-3 minutos)
- Teste o checkout na URL gerada!
- **IMPORTANTE**: Volte e atualize `NEXT_PUBLIC_APP_URL` com a URL final do Vercel

---

## 🎯 CHECKLIST DE DEPLOY:

### ANTES DO DEPLOY:
- [x] Token AppMax atualizado no projeto
- [x] Token AppMax atualizado no VERCEL-ENV-VARS.md
- [x] Todas as variáveis documentadas
- [ ] Push do código para GitHub ← **FAZER AGORA**

### DURANTE O DEPLOY:
- [ ] Importar repositório no Vercel
- [ ] Adicionar TODAS as variáveis de ambiente
- [ ] Aplicar para Production + Preview + Development
- [ ] Clicar em Deploy

### DEPOIS DO DEPLOY:
- [ ] Anotar URL do Vercel gerada
- [ ] Atualizar NEXT_PUBLIC_APP_URL no Vercel
- [ ] Configurar webhook no Mercado Pago com URL do Vercel
- [ ] Atualizar MERCADOPAGO_WEBHOOK_SECRET
- [ ] Testar checkout em produção!

---

## 📋 RESUMO DAS MUDANÇAS:

### ✅ O QUE FOI ATUALIZADO:

1. **AppMax Token**: `D2555D74-9B58764C-3F04CB59-14BF2F64` (NOVO!)
2. **Supabase**: URLs atualizadas para `egsmraszqnmosmtjuzhx`
3. **Todas as variáveis**: Valores reais do .env.local
4. **Documentação**: Checklist completo de deploy

### 📊 TOTAL DE VARIÁVEIS: 20

- ✅ 18 já configuradas e prontas
- ⚠️ 2 para atualizar após deploy (APP_URL e webhook secret)

---

## 🚀 PRÓXIMO PASSO:

**FAZER COMMIT E PUSH DO CÓDIGO ATUALIZADO:**

```bash
cd "/Users/helciomattos/Desktop/GRAVADOR MEDICO"
git add .
git commit -m "feat: Atualizar token AppMax e variáveis Vercel"
git push origin main
```

Depois vá para o Vercel! → https://vercel.com/new
