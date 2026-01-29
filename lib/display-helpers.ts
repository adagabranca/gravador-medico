// =====================================================
// HELPERS DE EXIBIÇÃO
// =====================================================
// Funções utilitárias para melhorar a UX de nomes vazios
// =====================================================

/**
 * Lista de valores inválidos que não devem ser exibidos como nome
 */
const INVALID_NAMES = [
  'Cliente MP',
  'Cliente Appmax',
  'unknown',
  'collection_id',
  'Sem nome',
  'N/A',
  'null',
  'undefined',
]

/**
 * Verifica se um nome é válido para exibição
 */
export function isValidDisplayName(name: string | null | undefined): boolean {
  if (!name || typeof name !== 'string') return false
  
  const trimmedName = name.trim()
  if (trimmedName.length === 0) return false
  
  // Verificar se está na lista de nomes inválidos (case-insensitive)
  const lowerName = trimmedName.toLowerCase()
  return !INVALID_NAMES.some(invalid => lowerName === invalid.toLowerCase())
}

/**
 * Extrai o primeiro nome do email (parte antes do @)
 * e capitaliza a primeira letra
 * 
 * @example
 * getNameFromEmail('joao.silva@gmail.com') // 'Joao'
 * getNameFromEmail('MARIA@hotmail.com') // 'Maria'
 */
export function getNameFromEmail(email: string): string {
  if (!email || typeof email !== 'string') return 'Usuário'
  
  try {
    // Pegar a parte antes do @
    const username = email.split('@')[0]
    
    // Remover pontos, underscores, números do final
    const cleanName = username
      .split(/[._-]/)[0] // Pega só a primeira parte antes de . _ -
      .replace(/[0-9]/g, '') // Remove números
      .trim()
    
    if (cleanName.length === 0) return 'Usuário'
    
    // Capitalizar primeira letra, resto minúsculo
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase()
  } catch {
    return 'Usuário'
  }
}

/**
 * Retorna o nome de exibição ideal para um usuário
 * 
 * Prioridade:
 * 1. Se nome válido existe → retorna o nome
 * 2. Se nome inválido/vazio → extrai do email
 * 
 * @param name Nome do usuário (pode ser null/undefined/inválido)
 * @param email Email do usuário (usado como fallback)
 * @param fallback Valor padrão se tudo falhar (default: 'Usuário')
 * @returns { displayName, isGenerated }
 */
export function getDisplayName(
  name: string | null | undefined,
  email: string,
  fallback: string = 'Usuário'
): {
  displayName: string
  isGenerated: boolean
} {
  // Se temos um nome válido, usar ele
  if (isValidDisplayName(name)) {
    return {
      displayName: name!.trim(),
      isGenerated: false,
    }
  }
  
  // Caso contrário, tentar extrair do email
  if (email) {
    return {
      displayName: getNameFromEmail(email),
      isGenerated: true,
    }
  }
  
  // Último caso: fallback
  return {
    displayName: fallback,
    isGenerated: true,
  }
}
