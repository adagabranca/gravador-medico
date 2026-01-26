import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint de TESTE para verificar conexão com Appmax
 * Retorna exatamente o que a API da Appmax responde
 */

const APPMAX_API_URL = process.env.APPMAX_API_URL || 'https://admin.appmax.com.br/api/v3'
const APPMAX_API_TOKEN = process.env.APPMAX_API_TOKEN || ''

export async function GET(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente
    const envCheck = {
      APPMAX_API_URL: APPMAX_API_URL || 'NÃO CONFIGURADO',
      APPMAX_API_TOKEN: APPMAX_API_TOKEN ? `Configurado (***${APPMAX_API_TOKEN.slice(-4)})` : 'NÃO CONFIGURADO'
    }

    console.log('🔍 [TEST] Variáveis de ambiente:', envCheck)

    if (!APPMAX_API_TOKEN) {
      return NextResponse.json({
        success: false,
        error: 'Token da Appmax não configurado',
        env: envCheck
      }, { status: 500 })
    }

    // Fazer requisição para Appmax
    const url = `${APPMAX_API_URL}/order?limit=10&offset=0`
    console.log('🔍 [TEST] URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${APPMAX_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('🔍 [TEST] Status:', response.status, response.statusText)

    const responseText = await response.text()
    console.log('🔍 [TEST] Response raw:', responseText.substring(0, 500))

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Resposta da Appmax não é JSON válido',
        status: response.status,
        statusText: response.statusText,
        responseText: responseText.substring(0, 1000),
        env: envCheck
      })
    }

    // Retornar resposta completa da Appmax
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      env: envCheck,
      appmaxResponse: {
        keys: Object.keys(data),
        dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
        dataLength: data.data?.length || 0,
        firstOrder: data.data?.[0] || null,
        fullResponse: data
      }
    })

  } catch (error: any) {
    console.error('❌ [TEST] Erro:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
