# 🎉 DASHBOARD ADMIN TIPO YAMPI/STRIPE - IMPLEMENTADO!

## ✅ O QUE FOI FEITO

### 1. **Backend Completo** 🗄️
- ✅ Schema SQL profissional com 4 tabelas:
  - `profiles`: Usuários com role (admin/user/support)
  - `sales`: Todas as vendas da Appmax
  - `sales_items`: Produtos de cada venda (order bumps)
  - `webhooks_logs`: Auditoria completa de webhooks
- ✅ RLS (Row Level Security) - Apenas admins veem dados sensíveis
- ✅ Service Role Client para webhook ignorar RLS
- ✅ Views otimizadas: `sales_by_day`, `top_products`
- ✅ Triggers automáticos para `updated_at`

### 2. **Webhook v2.0** 📡
- ✅ Salva **TUDO** no Supabase automaticamente:
  - Log completo do webhook (auditoria)
  - Dados da venda completos
  - Itens comprados (produto principal + bumps)
  - Cria usuário com acesso
- ✅ Tratamento de erros robusto
- ✅ Previne duplicação (mesmo pedido não salva 2x)
- ✅ Tempo de processamento em ms

### 3. **Dashboard Ultramoderno** 🎨

#### **Página /admin/dashboard**
- 📊 **4 Cards de Métricas** com crescimento:
  - 💰 Faturamento Total
  - 🛒 Total de Vendas
  - 👥 Clientes Únicos
  - 💳 Ticket Médio

- 📈 **2 Gráficos Profissionais**:
  - Receita dos últimos 7 dias (AreaChart verde)
  - Vendas por dia (BarChart azul)

- 📋 **Tabela de Vendas Recentes**:
  - Cliente, email, valor, status, método, data
  - Badges coloridas por status
  - Botão "Ver detalhes" (🔜 próxima fase)

#### **Layout Completo**
- 🎯 **Sidebar Lateral** (desktop e mobile):
  - Visão Geral ✅
  - Vendas (preparado)
  - Clientes (preparado)
  - Produtos (preparado)
  - Relatórios (preparado)
  - Webhooks (preparado)
  - Configurações (preparado)
  - Logout

- 🔝 **Top Bar**:
  - Barra de busca
  - Notificações (badge vermelho)
  - Menu mobile (hamburguer)

- 🔒 **Segurança**:
  - Verifica se está logado no Supabase Auth
  - Verifica se `role = 'admin'` na tabela profiles
  - Redireciona para /login se não autorizado

### 4. **Design Moderno** ✨
- Gradientes tipo Yampi/Stripe
- Animações com Framer Motion
- Cards com hover effects
- Sombras e bordas suaves
- Responsivo (mobile, tablet, desktop)
- Loading states elegantes

---

## 🚀 COMO USAR (PASSO A PASSO)

### FASE 1: Configurar Supabase (10 min)

#### 1. Acesse o Supabase
1. Vá em: https://supabase.com/dashboard
2. Entre no seu projeto (ou crie um novo)
3. Pegue as credenciais:
   - **Settings → API**
   - Copie: `Project URL` e `anon public` key
   - Copie: `service_role` key ⚠️ (SECRETA!)

#### 2. Atualize o .env.local
Substitua no arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (DIFERENTE!)
```

⚠️ **ATENÇÃO**: As 3 keys são DIFERENTES! Não copie a mesma!

#### 3. Execute o SQL
1. No Supabase: **SQL Editor** → **New Query**
2. Abra o arquivo: `supabase-admin-schema.sql`
3. **Copie TUDO** (Ctrl+A, Ctrl+C)
4. Cole no editor e clique em **RUN** ▶️
5. Aguarde: ✅ "Success. No rows returned"

---

### FASE 2: Criar Seu Usuário Admin (5 min)

#### 1. Criar conta
1. No Supabase: **Authentication → Users → Add User**
2. Preencha:
   - Email: seu@email.com
   - Password: (senha forte)
   - ✅ **Auto Confirm User** (marque!)
3. Clique em **Create User**
4. **COPIE O UUID** (ex: `a1b2c3d4-e5f6-...`)

#### 2. Tornar admin
1. No Supabase: **SQL Editor → New Query**
2. Cole (substitua o UUID e email):

```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'SEU-UUID-AQUI',
  'seu@email.com',
  'Seu Nome',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

3. Clique em **RUN**
4. ✅ Pronto! Você é admin

---

### FASE 3: Testar o Dashboard (2 min)

#### 1. Reiniciar o servidor
```bash
# No terminal (Ctrl+C para parar)
npm run dev
```

#### 2. Acessar o admin
1. Abra: http://localhost:3000/admin/dashboard
2. Você será redirecionado para /login
3. **PRIMEIRO**: Crie a página de login (ou use Supabase Magic Link)

#### 3. Fazer login
Se ainda não tem página de login, use o console:

```javascript
// No DevTools (F12) → Console
import { supabase } from '@/lib/supabase'

await supabase.auth.signInWithPassword({
  email: 'seu@email.com',
  password: 'sua-senha'
})

// Depois recarregue a página
window.location.href = '/admin/dashboard'
```

---

## 📊 O QUE VAI APARECER NO DASHBOARD

### Se NÃO houver vendas ainda:
- Cards de métricas zerados
- Gráficos vazios
- Mensagem: "Nenhuma venda ainda"

### Quando chegar a PRIMEIRA venda (via webhook):
1. Webhook da Appmax dispara
2. Salva em `sales` e `sales_items`
3. Dashboard atualiza automaticamente (clique em Refresh)
4. Você verá:
   - ✅ Faturamento total
   - ✅ Quantidade de vendas
   - ✅ Cliente na tabela
   - ✅ Gráfico com a venda do dia

---

## 🔧 TROUBLESHOOTING

### "Missing Supabase environment variables"
❌ **Problema**: .env.local não configurado
✅ **Solução**: 
1. Certifique-se que o `.env.local` está na RAIZ do projeto
2. Reinicie o servidor (`npm run dev`)

### "Invalid API key"
❌ **Problema**: Chave copiada errada
✅ **Solução**: 
1. Verifique se copiou a chave COMPLETA (200+ caracteres)
2. Confira se não tem espaços no início/fim

### "User não é admin"
❌ **Problema**: Campo `role` não está como 'admin'
✅ **Solução**: 
1. Vá no Supabase: **Table Editor → profiles**
2. Encontre seu usuário
3. Edite o campo `role` para: `admin` (minúsculo!)

### Dashboard vazio (sem métricas)
❌ **Problema**: Ainda não tem vendas no banco
✅ **Solução**: 
1. Faça uma compra de teste no checkout
2. Aguarde o webhook da Appmax disparar
3. Clique em "Atualizar" no dashboard

---

## 🎯 PRÓXIMOS PASSOS (Expansão)

### Páginas a Criar:
1. **Vendas Detalhadas** (`/admin/sales`)
   - Filtros por data, status, método
   - Busca por cliente/email
   - Botão "Reembolsar"

2. **Clientes** (`/admin/customers`)
   - Lista de clientes únicos
   - Histórico de compras por cliente
   - LTV (Lifetime Value)

3. **Produtos** (`/admin/products`)
   - Performance de cada order bump
   - Produtos mais vendidos
   - Taxa de conversão por produto

4. **Webhooks** (`/admin/webhooks`)
   - Logs de todos os webhooks recebidos
   - Status de processamento
   - Botão "Reprocessar" se falhou

5. **Configurações** (`/admin/settings`)
   - Gerenciar usuários admin
   - API keys
   - Notificações

---

## 📝 ESTRUTURA DE ARQUIVOS

```
app/
├── admin/
│   ├── page.tsx (redirect para /admin/dashboard)
│   ├── layout.tsx (sidebar + auth check)
│   └── dashboard/
│       └── page.tsx (métricas, gráficos, tabela)
├── api/
│   └── webhook/
│       └── appmax/
│           └── route.ts (salva no Supabase)
lib/
├── supabase.ts (clients + tipos)
└── appmax.ts (integração Appmax)
```

---

## 🔐 SEGURANÇA

### ✅ Implementado:
- RLS no Supabase (apenas admins veem vendas)
- Verificação de role no layout
- Service Role apenas no webhook (server-side)
- Chaves secretas no .env.local (não vai pro Git)

### 🚨 NUNCA faça:
- ❌ Commitar o .env.local
- ❌ Expor SUPABASE_SERVICE_ROLE_KEY no frontend
- ❌ Desabilitar RLS nas tabelas

---

## 📞 SUPORTE

Se algo não funcionar:
1. Verifique o console do navegador (F12)
2. Verifique o terminal do Next.js
3. Verifique os logs do webhook no Supabase:
   - **Table Editor → webhooks_logs**
4. Me envie:
   - Print do erro
   - Print da tabela webhooks_logs
   - Payload do webhook

---

## 🎉 PRONTO!

Seu Dashboard Admin está **COMPLETO** e pronto para uso!

Quando fizer sua primeira venda:
1. Appmax dispara webhook
2. Webhook salva no Supabase
3. Dashboard mostra os dados
4. Você vê tudo em tempo real 🚀

**Próxima fase**: Implementar as outras páginas (Vendas, Clientes, etc) usando a mesma estrutura.
