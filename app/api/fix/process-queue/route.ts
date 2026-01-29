import { NextRequest, NextResponse } from 'next/server'
import { processProvisioningQueue } from '@/lib/provisioning-worker'

/**
 * 🔧 ENDPOINT TEMPORÁRIO - Processar fila de provisionamento
 * 
 * ⚠️ REMOVER APÓS CORRIGIR AS VENDAS PENDENTES
 * 
 * Uso: GET /api/fix/process-queue
 */

export async function GET(request: NextRequest) {
  console.log('🔧 [FIX] Processando fila de provisionamento...')
  
  try {
    const result = await processProvisioningQueue()
    
    console.log('✅ [FIX] Resultado:', JSON.stringify(result, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'Fila processada',
      result
    })
    
  } catch (error: any) {
    console.error('❌ [FIX] Erro:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
