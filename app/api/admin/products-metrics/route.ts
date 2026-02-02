import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Buscar produtos
    const { data: productsData, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('price', { ascending: false })

    if (productsError) {
      console.error('❌ Erro ao carregar produtos:', productsError)
      return NextResponse.json({ error: 'Erro ao carregar produtos' }, { status: 500 })
    }

    console.log('📦 PRODUTOS:', productsData?.length)

    // Buscar TODAS as vendas pagas
    const { data: salesData, error: salesError } = await supabaseAdmin
      .from('sales')
      .select('amount, total_amount, status, created_at, customer_email, payment_method')
      .eq('status', 'paid')

    if (salesError) {
      console.error('⚠️ Erro ao carregar vendas:', salesError)
    }

    console.log('💰 VENDAS:', salesData?.length)
    console.log('💰 VALORES:', salesData?.map(s => s.amount || s.total_amount))

    // Calcular métricas para cada produto
    const productsWithMetrics = (productsData || []).map(product => {
      let totalSales = 0
      let totalRevenue = 0
      const customers = new Set<string>()
      let lastSale: string | null = null
      const methods: Record<string, number> = {}

      salesData?.forEach(sale => {
        const amount = sale.amount || sale.total_amount || 0
        if (amount <= 0) return
        
        let matches = false
        let productRevenue = 0

        // Produto Principal (R$ 36) - está em TODA venda >= 10
        if (product.id === 'gravador-medico-vitalicio' && amount >= 10) {
          matches = true
          productRevenue = Math.min(amount, 36)
        }
        
        // Bump Implementação (R$ 97) - vendas de ~R$ 133
        if (product.id === 'implementacao-assistida' && amount >= 130 && amount <= 140) {
          matches = true
          productRevenue = 97
        }
        
        // Bump Análise (R$ 39.90) - vendas de ~R$ 75.90
        if (product.id === 'analise-inteligente' && amount >= 74 && amount <= 78) {
          matches = true
          productRevenue = 39.90
        }
        
        // Bump Instagram (R$ 29.90) - vendas de ~R$ 65.90
        if (product.id === 'conteudo-infinito-instagram' && amount >= 64 && amount <= 68) {
          matches = true
          productRevenue = 29.90
        }

        if (matches) {
          totalSales++
          totalRevenue += productRevenue
          if (sale.customer_email) customers.add(sale.customer_email)
          if (!lastSale || sale.created_at > lastSale) lastSale = sale.created_at
          const method = sale.payment_method || 'outro'
          methods[method] = (methods[method] || 0) + 1
        }
      })

      const totalValidSales = salesData?.filter(s => (s.amount || s.total_amount || 0) > 0).length || 1

      console.log(`📊 ${product.name}: ${totalSales} vendas, R$ ${totalRevenue.toFixed(2)}`)

      return {
        ...product,
        performance: {
          total_sales: totalSales,
          total_revenue: totalRevenue,
          refund_rate: 0,
          conversion_rate: totalSales ? Math.round((totalSales / totalValidSales) * 100) : 0,
          health_score: totalSales ? Math.min(100, Math.round((totalSales / totalValidSales) * 100 + 20)) : 0,
          unique_customers: customers.size,
          last_sale_at: lastSale,
          payment_methods: methods
        }
      }
    })

    // Calcular stats gerais
    const stats = {
      total_products: productsWithMetrics.length,
      active_products: productsWithMetrics.filter(p => p.is_active).length,
      total_revenue: productsWithMetrics.reduce((sum, p) => sum + (p.performance?.total_revenue || 0), 0),
      avg_health_score: productsWithMetrics.length 
        ? Math.round(productsWithMetrics.reduce((sum, p) => sum + (p.performance?.health_score || 0), 0) / productsWithMetrics.length)
        : 0
    }

    return NextResponse.json({
      products: productsWithMetrics,
      stats
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
