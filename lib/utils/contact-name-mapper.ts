// ================================================================
// Mapeamento de nomes de contatos
// ================================================================
// Permite substituir nomes genéricos por nomes reais
// Adicione aqui qualquer nome que precise ser corrigido
// ================================================================

const CONTACT_NAME_OVERRIDES: Record<string, string> = {
  'Assistente Virtual': 'Helcio Mattos',
  // Adicione mais mapeamentos aqui se necessário
  // 'Nome Errado': 'Nome Correto',
}

/**
 * Aplica mapeamento de nomes personalizados
 * Se o push_name estiver na lista de overrides, retorna o nome correto
 * Caso contrário, retorna o push_name ou formata o número
 */
export function getDisplayContactName(
  pushName?: string | null,
  remoteJid?: string
): string {
  // Se não tem push_name, formatar número
  if (!pushName) {
    return formatPhoneNumber(remoteJid || '')
  }

  // Verificar se existe override para este nome
  if (pushName in CONTACT_NAME_OVERRIDES) {
    return CONTACT_NAME_OVERRIDES[pushName]
  }

  return pushName
}

/**
 * Formata número de telefone para exibição
 */
function formatPhoneNumber(remoteJid: string): string {
  if (!remoteJid) return 'Cliente'
  
  // Remove @s.whatsapp.net ou @g.us
  const number = remoteJid.replace(/@s\.whatsapp\.net|@g\.us/g, '')
  
  // Se for número brasileiro (55), formatar
  if (number.startsWith('55') && number.length >= 12) {
    const ddd = number.substring(2, 4)
    const firstPart = number.substring(4, 9)
    const secondPart = number.substring(9)
    return `(${ddd}) ${firstPart}-${secondPart}`
  }
  
  return number
}
