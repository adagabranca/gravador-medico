# Evolution API - Configuração de Eventos (Webhook)

## ✅ Eventos que DEVEM estar ATIVADOS

Na tela de configuração da Evolution API (Settings > Webhook > Events), ative os seguintes eventos:

### 🔴 OBRIGATÓRIOS

1. **MESSAGES_UPSERT** ⭐ **PRINCIPAL**
   - Dispara quando uma mensagem é recebida OU enviada
   - **SEM ESTE EVENTO AS MENSAGENS NÃO APARECEM NO PAINEL**
   - Responsável por capturar TODAS as mensagens (enviadas e recebidas)

2. **MESSAGES_UPDATE**
   - Atualiza o status da mensagem (enviada → entregue → lida)
   - Responsável pelos "checks" (✓ ✓✓)

3. **CONNECTION_UPDATE**
   - Monitora o status da conexão com WhatsApp
   - Útil para saber se a instância está conectada

### 📋 RECOMENDADOS (Funcionalidades extras)

4. **CONTACTS_UPSERT**
   - Atualiza informações de contatos automaticamente
   - Sincroniza nome e foto de perfil

5. **CONTACTS_UPDATE**
   - Atualiza mudanças nos contatos (nome, foto, etc)

### ❌ NÃO NECESSÁRIOS (Pode deixar desativado)

- CHATS_DELETE
- CHATS_SET
- CHATS_UPDATE
- CHATS_UPSERT
- CALL
- GROUPS_UPSERT
- GROUP_UPDATE
- GROUP_PARTICIPANTS_UPDATE
- LABELS_ASSOCIATION
- LABELS_EDIT
- PRESENCE_UPDATE
- QRCODE_UPDATED
- REMOVE_INSTANCE
- SEND_MESSAGE
- TYPEBOT_CHANGE_STATUS
- TYPEBOT_START
- LOGOUT_INSTANCE

---

## 🎯 Configuração Mínima Necessária

Se você quer o **mínimo necessário** para o WhatsApp Inbox funcionar:

```
✅ MESSAGES_UPSERT  (OBRIGATÓRIO - sem isso NADA funciona)
✅ MESSAGES_UPDATE  (Recomendado - para os checks funcionarem)
✅ CONNECTION_UPDATE (Recomendado - para monitorar conexão)
```

---

## 🔧 Como Configurar

1. Acesse o painel da Evolution API
2. Vá em **Settings** → **Webhook** → **Events**
3. **ATIVE** pelo menos **MESSAGES_UPSERT**
4. **ATIVE** também **MESSAGES_UPDATE** (para os checks)
5. Clique em **Save**
6. Reinicie a instância se necessário

---

## 🐛 Troubleshooting

### Mensagens da automação não aparecem?
- ✅ Verifique se **MESSAGES_UPSERT** está ATIVADO
- ✅ Verifique se o webhook URL está correto: `https://seu-dominio.com/api/webhooks/whatsapp`
- ✅ Execute o SQL: `database/14-fix-automation-messages.sql` para corrigir mensagens antigas

### Status das mensagens sempre aparece como relógio?
- ✅ Verifique se **MESSAGES_UPDATE** está ATIVADO
- ✅ Este evento atualiza o status de "enviado" → "entregue" → "lido"

### Fotos de perfil não aparecem?
- ✅ ATIVE **CONTACTS_UPSERT** e **CONTACTS_UPDATE**
- ✅ Estes eventos sincronizam automaticamente as fotos

---

## 📊 Status Atual do Webhook

Para verificar se o webhook está recebendo eventos:

```bash
# Ver últimas mensagens no banco
SELECT 
  from_me,
  COUNT(*) as total,
  MAX(timestamp) as ultima_msg
FROM whatsapp_messages
GROUP BY from_me;

# Ver logs da Evolution API
# (verifique os logs do container/servidor da Evolution)
```

---

## ✨ Resultado Esperado

Após ativar **MESSAGES_UPSERT**:
- ✅ Mensagens enviadas manualmente aparecem
- ✅ Mensagens da automação aparecem
- ✅ Mensagens recebidas aparecem
- ✅ Chat completo funciona

Após ativar **MESSAGES_UPDATE**:
- ✅ Status correto (enviado/entregue/lido)
- ✅ Checks corretos (⏱️ → ✓ → ✓✓ → ✓✓ azul)
