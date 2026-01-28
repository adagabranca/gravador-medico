# ✅ Implementação CPF/CNPJ no Checkout

## 📋 Resumo das Alterações

Esta atualização adiciona suporte completo para **CPF (Pessoa Física)** e **CNPJ (Pessoa Jurídica)** no checkout, incluindo **consulta automática de dados da empresa** via API pública.

---

## 🆕 Arquivos Criados

### 1. `/lib/cnpj-api.ts`
Funções completas para CNPJ:
- `validateCNPJ(cnpj)` - Valida algoritmo do CNPJ
- `formatCNPJ(cnpj)` - Formata para `XX.XXX.XXX/XXXX-XX`
- `consultarCNPJ(cnpj)` - **🔥 NOVO!** Busca dados da empresa (Razão Social, etc.)

**APIs utilizadas (cascata):**
1. BrasilAPI (gratuita, sem limite)
2. ReceitaWS (fallback)

### 2. `/database/migrations/add-document-type.sql`
Migration SQL para adicionar colunas:
- `document_type` (CPF ou CNPJ)
- `company_name` (Razão Social)

---

## 📝 Arquivos Modificados

### Frontend

#### `/app/checkout/page.tsx`
- ✅ Campo `companyName` no formData
- ✅ Estado `cnpjLoading` e `cnpjError` para consulta
- ✅ Função `handleCNPJLookup()` para buscar dados
- ✅ Botão "Consultar dados do CNPJ"
- ✅ Campo "Razão Social" (aparece apenas para CNPJ)
- ✅ Validação: Razão Social obrigatória para CNPJ
- ✅ Payload enviado inclui `companyName`

### Backend

#### `/app/api/checkout/enterprise/route.ts`
- ✅ Inserção na tabela `sales` inclui `company_name`

---

## 🚀 Como Funciona

### Fluxo do Usuário:

1. **Seleciona "CNPJ (Empresa)"**
2. **Digita o CNPJ** (ex: `12.345.678/0001-95`)
3. **Clica em "Consultar dados do CNPJ"**
4. **Sistema busca na API pública:**
   - Razão Social ← Preenchida automaticamente
   - Situação cadastral (ATIVA, BAIXADA, etc.)
5. **Confere os dados e continua**

### Dados Retornados pela API:

```typescript
{
  cnpj: "12345678000195",
  razaoSocial: "EMPRESA EXEMPLO LTDA",
  nomeFantasia: "EXEMPLO",
  situacao: "ATIVA",
  dataAbertura: "2020-01-15",
  logradouro: "Rua das Flores",
  numero: "123",
  bairro: "Centro",
  municipio: "São Paulo",
  uf: "SP",
  cep: "01234567",
  telefone: "1133334444",
  email: "contato@exemplo.com.br"
}
```

---

## 🎨 Interface do Usuário

```
┌─────────────────────────────────────────┐
│  Tipo de Documento *                    │
│  ┌───────────────┐ ┌───────────────┐    │
│  │ CPF (PF)      │ │ CNPJ (Emp.) ✓│    │
│  └───────────────┘ └───────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 12.345.678/0001-95              │   │
│  └─────────────────────────────────┘   │
│  🔍 Consultar dados do CNPJ            │
│                                         │
│  🏢 Razão Social *                      │
│  ┌─────────────────────────────────┐   │
│  │ EMPRESA EXEMPLO LTDA            │   │
│  └─────────────────────────────────┘   │
│  (Preenchido automaticamente)          │
└─────────────────────────────────────────┘
```

---

## 🔧 Migration SQL

Execute no **Supabase Dashboard → SQL Editor**:

```sql
-- Adicionar coluna document_type
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CPF' 
CHECK (document_type IN ('CPF', 'CNPJ'));

-- Adicionar coluna company_name (Razão Social)
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sales_document_type ON public.sales(document_type);
CREATE INDEX IF NOT EXISTS idx_sales_company_name ON public.sales(company_name) WHERE company_name IS NOT NULL;
```

Arquivo completo: `/database/migrations/add-document-type.sql`

---

## 🧪 CNPJs de Teste Válidos

```
11.222.333/0001-81
12.345.678/0001-95
00.000.000/0001-91
```

⚠️ **Nota:** A API consulta dados reais da Receita Federal. Use CNPJs existentes para testar a consulta automática.

---

## ✅ Checklist de Implementação

- [x] Criar validador/formatador de CNPJ
- [x] Criar serviço de consulta de CNPJ (BrasilAPI + ReceitaWS)
- [x] Adicionar campo Razão Social no checkout
- [x] Botão para consulta automática
- [x] Atualizar payload para API
- [x] Atualizar API enterprise para salvar dados
- [x] Criar migration SQL
- [x] Integração com Mercado Pago (identificationType dinâmico)
- [x] Integração com Appmax (document_type no payload)
