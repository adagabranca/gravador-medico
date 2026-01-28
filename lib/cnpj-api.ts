/**
 * 🏢 Serviço de Consulta de CNPJ
 * 
 * Busca dados da empresa através de APIs públicas gratuitas.
 * Retorna razão social, nome fantasia, situação cadastral, etc.
 */

export interface CNPJData {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  situacao: string
  dataAbertura?: string
  naturezaJuridica?: string
  atividadePrincipal?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
  telefone?: string
  email?: string
  capitalSocial?: number
}

export interface CNPJResponse {
  success: boolean
  data?: CNPJData
  error?: string
}

/**
 * Consulta dados do CNPJ usando APIs públicas gratuitas
 * Tenta múltiplas APIs em cascata para maior confiabilidade
 */
export async function consultarCNPJ(cnpj: string): Promise<CNPJResponse> {
  // Remove formatação
  const cnpjLimpo = cnpj.replace(/\D/g, '')

  if (cnpjLimpo.length !== 14) {
    return { success: false, error: 'CNPJ deve ter 14 dígitos' }
  }

  // Tenta API BrasilAPI (gratuita, sem limite)
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      const data = await response.json()
      
      return {
        success: true,
        data: {
          cnpj: cnpjLimpo,
          razaoSocial: data.razao_social || '',
          nomeFantasia: data.nome_fantasia || undefined,
          situacao: data.descricao_situacao_cadastral || 'DESCONHECIDA',
          dataAbertura: data.data_inicio_atividade,
          naturezaJuridica: data.natureza_juridica,
          atividadePrincipal: data.cnae_fiscal_descricao,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          municipio: data.municipio,
          uf: data.uf,
          cep: data.cep,
          telefone: data.ddd_telefone_1,
          email: data.email,
          capitalSocial: data.capital_social,
        }
      }
    }

    // Se a API retornou erro (404, etc)
    if (response.status === 404) {
      return { success: false, error: 'CNPJ não encontrado na base da Receita Federal' }
    }

    throw new Error(`Status ${response.status}`)
  } catch (error: any) {
    console.warn('⚠️ BrasilAPI falhou, tentando ReceitaWS...', error.message)
  }

  // Fallback: ReceitaWS (tem limite de requisições)
  try {
    const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpjLimpo}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      const data = await response.json()

      if (data.status === 'ERROR') {
        return { success: false, error: data.message || 'CNPJ não encontrado' }
      }

      return {
        success: true,
        data: {
          cnpj: cnpjLimpo,
          razaoSocial: data.nome || '',
          nomeFantasia: data.fantasia || undefined,
          situacao: data.situacao || 'DESCONHECIDA',
          dataAbertura: data.abertura,
          naturezaJuridica: data.natureza_juridica,
          atividadePrincipal: data.atividade_principal?.[0]?.text,
          logradouro: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          municipio: data.municipio,
          uf: data.uf,
          cep: data.cep,
          telefone: data.telefone,
          email: data.email,
          capitalSocial: parseFloat(data.capital_social?.replace(/\D/g, '') || '0') / 100,
        }
      }
    }
  } catch (error: any) {
    console.error('❌ ReceitaWS também falhou:', error.message)
  }

  return { 
    success: false, 
    error: 'Não foi possível consultar o CNPJ. Preencha os dados manualmente.' 
  }
}

/**
 * Valida se um CNPJ é válido (algoritmo)
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')

  if (cleanCNPJ.length !== 14) return false
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false

  let tamanho = cleanCNPJ.length - 2
  let numeros = cleanCNPJ.substring(0, tamanho)
  const digitos = cleanCNPJ.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
  if (resultado !== parseInt(digitos.charAt(0))) return false

  tamanho = tamanho + 1
  numeros = cleanCNPJ.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
  return resultado === parseInt(digitos.charAt(1))
}

/**
 * Formata CNPJ para exibição: XX.XXX.XXX/XXXX-XX
 */
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '')
  
  if (cleanCNPJ.length <= 2) return cleanCNPJ
  if (cleanCNPJ.length <= 5) return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2)}`
  if (cleanCNPJ.length <= 8) return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5)}`
  if (cleanCNPJ.length <= 12) return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8)}`
  return `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8, 12)}-${cleanCNPJ.slice(12, 14)}`
}
