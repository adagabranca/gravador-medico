"use client"'use client'



/**import { useEffect, useState } from 'react'

 * 📊 ANALYTICS & ATRIBUIÇÃO - Dashboard Profissionalimport { supabaseAdmin } from '@/lib/supabase'

 * Nível: Google Analytics 4 / Mixpanelimport { Card } from '@/components/ui/card'

 * Foco: Revenue Attribution (De onde vem o dinheiro e onde trava?)import { BarChart3, Users, TrendingUp, Eye, MousePointerClick, Radio, Globe, Smartphone } from 'lucide-react'

 */import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import { format, subDays, startOfDay, endOfDay } from 'date-fns'

import { useState, useEffect } from 'react'import { ptBR } from 'date-fns/locale'

import { motion } from 'framer-motion'import { formatPercent } from '@/lib/format'

import {

  TrendingUp,interface AnalyticsData {

  TrendingDown,  totalVisits: number

  DollarSign,  uniqueSessions: number

  Users,  conversionRate: number

  Clock,  totalSales: number

  Target,  abandonedCarts: number

  BarChart3,  topPages: Array<{ page: string; visits: number }>

  ArrowUp,  trafficSources: Array<{ source: string; count: number }>

  ArrowDown,  dailyVisits: Array<{ date: string; visits: number; sales: number }>

  Calendar,  onlineVisitors: number

  RefreshCw,  topCountries: Array<{ country: string; count: number }>

  Download,  topCities: Array<{ city: string; count: number }>

  Eye,  deviceBreakdown: Array<{ device: string; count: number }>

  ShoppingCart,}

  CreditCard,

  Filterconst COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

} from 'lucide-react'

import { supabase } from '@/lib/supabase'export default function AnalyticsPage() {

import {  const [data, setData] = useState<AnalyticsData | null>(null)

  AreaChart,  const [loading, setLoading] = useState(true)

  Area,  const [dateRange, setDateRange] = useState(7) // últimos 7 dias

  BarChart,  const [onlineCount, setOnlineCount] = useState(0) // Estado separado para online

  Bar,

  XAxis,  useEffect(() => {

  YAxis,    loadAnalytics()

  CartesianGrid,  }, [dateRange])

  Tooltip,

  ResponsiveContainer,  // 🔥 Atualização em tempo real do "Online Agora" a cada 3 segundos

  FunnelChart,  useEffect(() => {

  Funnel,    // Carregar imediatamente

  LabelList,    updateOnlineCount()

  Cell

} from 'recharts'    // Atualizar a cada 3 segundos

import { RealtimeVisitors } from '@/components/dashboard/RealtimeVisitors'    const interval = setInterval(() => {

      console.log('🔄 Atualizando contador online...')

// ==========================================      updateOnlineCount()

// 🎨 TIPOS    }, 3000) // 3 segundos

// ==========================================

    return () => clearInterval(interval) // Limpar ao desmontar

interface HealthMetrics {  }, [])

  unique_visitors: number

  sales: number  // Função para atualizar apenas o contador online

  revenue: number  async function updateOnlineCount() {

  average_order_value: number    try {

  avg_time_seconds: number      const now = new Date()

  conversion_rate: number      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()

  visitors_change: number      

  revenue_change: number      const { data: onlineData, error } = await supabaseAdmin

  aov_change: number        .from('analytics_visits')

  time_change: number        .select('session_id, last_seen')

}        .gte('last_seen', fiveMinutesAgo)

        .eq('is_online', true)

interface MarketingAttribution {

  source: string      if (error) {

  medium: string        console.error('❌ Erro na query:', error)

  campaign: string        return

  visitors: number      }

  sessions: number

  sales_count: number      if (onlineData) {

  total_revenue: number        const uniqueOnline = new Set(onlineData.map(v => v.session_id)).size

  conversion_rate: number        console.log(`👥 Online agora: ${uniqueOnline} usuários`, {

  average_order_value: number          total_registros: onlineData.length,

  primary_device: string          ultimos_5min: fiveMinutesAgo,

}          agora: now.toISOString()

        })

interface FunnelData {        setOnlineCount(uniqueOnline)

  step_visitors: number      }

  step_interested: number    } catch (error) {

  step_checkout_started: number      console.error('💥 Erro ao atualizar online:', error)

  step_purchased: number    }

}  }



// ==========================================  async function loadAnalytics() {

// 🎯 COMPONENTE PRINCIPAL    try {

// ==========================================      setLoading(true)

      const startDate = startOfDay(subDays(new Date(), dateRange))

export default function AnalyticsPage() {      const endDate = endOfDay(new Date())

  // Estados

  const [loading, setLoading] = useState(true)      // 1. Total de visitas e sessões únicas

  const [refreshing, setRefreshing] = useState(false)      const { data: visits, error: visitsError } = await supabaseAdmin

  const [dateRange, setDateRange] = useState(30) // Dias        .from('analytics_visits')

          .select('*')

  // Dados        .gte('created_at', startDate.toISOString())

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null)        .lte('created_at', endDate.toISOString())

  const [attribution, setAttribution] = useState<MarketingAttribution[]>([])

  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)      if (visitsError) throw visitsError

  const [dailyTrend, setDailyTrend] = useState<any[]>([])

      const uniqueSessions = new Set(visits?.map(v => v.session_id) || []).size

  // ==========================================

  // 📡 CARREGAMENTO DE DADOS      // 2. Total de vendas no período

  // ==========================================      const { data: sales, error: salesError } = await supabaseAdmin

        .from('sales')

  useEffect(() => {        .select('*')

    loadAnalyticsData()        .eq('status', 'approved')

  }, [dateRange])        .gte('created_at', startDate.toISOString())

        .lte('created_at', endDate.toISOString())

  const loadAnalyticsData = async () => {

    try {      if (salesError) throw salesError

      setRefreshing(true)

      // 3. Carrinhos abandonados

      // 1️⃣ Health Metrics (KPIs com Delta)      const { data: abandoned, error: abandonedError } = await supabaseAdmin

      const { data: health, error: healthError } = await supabase        .from('abandoned_carts')

        .from('analytics_health')        .select('*')

        .select('*')        .eq('status', 'abandoned')

        .single()        .gte('created_at', startDate.toISOString())

        .lte('created_at', endDate.toISOString())

      if (healthError) console.error('Erro health:', healthError)

      else setHealthMetrics(health)      if (abandonedError) throw abandonedError



      // 2️⃣ Marketing Attribution (Fontes de Tráfego → Receita)      // 4. Páginas mais visitadas

      const { data: attr, error: attrError } = await supabase      const pageCount = (visits || []).reduce((acc, visit) => {

        .from('marketing_attribution')        const page = visit.page_path || '/'

        .select('*')        acc[page] = (acc[page] || 0) + 1

        .order('total_revenue', { ascending: false })        return acc

        .limit(10)      }, {} as Record<string, number>)



      if (attrError) console.error('Erro attribution:', attrError)      const topPages = Object.entries(pageCount)

      else setAttribution(attr || [])        .map(([page, visits]) => ({ page, visits: visits as number }))

        .sort((a, b) => b.visits - a.visits)

      // 3️⃣ Funil de Conversão        .slice(0, 5)

      const { data: funnel, error: funnelError } = await supabase

        .from('analytics_funnel')      // 5. Fontes de tráfego CATEGORIZADAS

        .select('*')      const sourceCount: Record<string, number> = {

        .single()        'Facebook': 0,

        'Instagram': 0,

      if (funnelError) console.error('Erro funnel:', funnelError)        'Google': 0,

      else setFunnelData(funnel)        'Direto': 0,

        'Outros': 0

      // 4️⃣ Tendência Diária (Visitantes vs Vendas)      }

      const { data: summary, error: summaryError } = await supabase

        .from('analytics_daily_summary')      ;(visits || []).forEach(visit => {

        .select('*')        const source = (visit.utm_source || visit.referrer || '').toLowerCase()

        .order('date', { ascending: true })        

        .limit(30)        if (source.includes('facebook') || source.includes('fb.com') || source.includes('m.facebook')) {

          sourceCount['Facebook']++

      if (summaryError) console.error('Erro summary:', summaryError)        } else if (source.includes('instagram') || source.includes('ig.me')) {

      else {          sourceCount['Instagram']++

        const chartData = (summary || []).map(d => ({        } else if (source.includes('google')) {

          date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),          sourceCount['Google']++

          visitors: d.unique_visitors,        } else if (!source || source === 'direto' || source === '') {

          sales: d.total_sales,          sourceCount['Direto']++

          revenue: d.total_revenue        } else {

        }))          sourceCount['Outros']++

        setDailyTrend(chartData)        }

      }      })



    } catch (error) {      const trafficSources = Object.entries(sourceCount)

      console.error('Erro geral analytics:', error)        .map(([source, count]) => ({ source, count }))

    } finally {        .filter(item => item.count > 0)

      setLoading(false)        .sort((a, b) => b.count - a.count)

      setRefreshing(false)

    }      // 6. Visitas e vendas por dia

  }      const dailyData: Record<string, { visits: number; sales: number }> = {}



  // ==========================================      for (let i = 0; i < dateRange; i++) {

  // 🧩 COMPONENTES INTERNOS        const date = format(subDays(new Date(), dateRange - i - 1), 'dd/MM')

  // ==========================================        dailyData[date] = { visits: 0, sales: 0 }

      }

  const HealthCard = ({ 

    title,       visits?.forEach(visit => {

    value,         const date = format(new Date(visit.created_at), 'dd/MM')

    delta,         if (dailyData[date]) {

    icon: Icon,           dailyData[date].visits++

    color,        }

    format = 'number'      })

  }: any) => {

    const isPositive = delta >= 0      sales?.forEach(sale => {

    const formattedValue = format === 'currency'         const date = format(new Date(sale.created_at), 'dd/MM')

      ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`         if (dailyData[date]) {

      : format === 'percent'          dailyData[date].sales++

      ? `${value.toFixed(1)}%`        }

      : format === 'time'      })

      ? `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`

      : value.toLocaleString('pt-BR')      const dailyVisits = Object.entries(dailyData).map(([date, data]) => ({

        date,

    return (        visits: data.visits,

      <motion.div        sales: data.sales

        initial={{ opacity: 0, y: 20 }}      }))

        animate={{ opacity: 1, y: 0 }}

        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:shadow-2xl hover:border-brand-500/30 transition-all"      // 7. 🆕 VISITANTES ONLINE (últimos 5 minutos)

      >      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

        <div className="flex items-center justify-between mb-4">      const { data: onlineData, error: onlineError } = await supabaseAdmin

          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>        .from('analytics_visits')

            <Icon className="w-6 h-6 text-white" />        .select('session_id')

          </div>        .gte('last_seen', fiveMinutesAgo)

          {delta !== 0 && (        .eq('is_online', true)

            <div className={`flex items-center gap-1 text-sm font-bold ${

              isPositive ? 'text-green-400' : 'text-red-400'      const onlineVisitors = onlineData ? new Set(onlineData.map(v => v.session_id)).size : 0

            }`}>

              {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}      // 8. 🆕 TOP PAÍSES

              {Math.abs(delta).toFixed(1)}%      const countryCount = (visits || []).reduce((acc, visit) => {

            </div>        if (visit.country) {

          )}          acc[visit.country] = (acc[visit.country] || 0) + 1

        </div>        }

        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">{title}</h3>        return acc

        <p className="text-3xl font-black text-white">{formattedValue}</p>      }, {} as Record<string, number>)

        <p className="text-xs text-gray-500 mt-2">vs período anterior</p>

      </motion.div>      const topCountries = Object.entries(countryCount)

    )        .map(([country, count]) => ({ country, count: count as number }))

  }        .sort((a, b) => b.count - a.count)

        .slice(0, 5)

  // ==========================================

  // 🎨 RENDERIZAÇÃO      // 9. 🆕 TOP CIDADES

  // ==========================================      const cityCount = (visits || []).reduce((acc, visit) => {

        if (visit.city) {

  if (loading) {          acc[visit.city] = (acc[visit.city] || 0) + 1

    return (        }

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 flex items-center justify-center">        return acc

        <div className="text-center">      }, {} as Record<string, number>)

          <RefreshCw className="w-12 h-12 text-brand-400 animate-spin mx-auto mb-4" />

          <p className="text-gray-400">Carregando Analytics...</p>      const topCities = Object.entries(cityCount)

        </div>        .map(([city, count]) => ({ city, count: count as number }))

      </div>        .sort((a, b) => b.count - a.count)

    )        .slice(0, 5)

  }

      // 10. 🆕 DISPOSITIVOS

  // Preparar dados do funil para o gráfico      const deviceCount = (visits || []).reduce((acc, visit) => {

  const funnelChartData = funnelData ? [        const device = visit.device_type || 'desktop'

    { name: 'Visitantes', value: funnelData.step_visitors, fill: '#3b82f6' },        acc[device] = (acc[device] || 0) + 1

    { name: 'Interessados', value: funnelData.step_interested, fill: '#8b5cf6' },        return acc

    { name: 'Checkout', value: funnelData.step_checkout_started, fill: '#f59e0b' },      }, {} as Record<string, number>)

    { name: 'Compraram', value: funnelData.step_purchased, fill: '#10b981' }

  ] : []      const deviceBreakdown = Object.entries(deviceCount)

        .map(([device, count]) => ({ device, count: count as number }))

  return (        .sort((a, b) => b.count - a.count)

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">

      <div className="max-w-7xl mx-auto space-y-8">      setData({

                totalVisits: visits?.length || 0,

        {/* ==========================================        uniqueSessions,

            📌 HEADER        conversionRate: visits?.length ? ((sales?.length || 0) / visits.length) * 100 : 0,

        ========================================== */}        totalSales: sales?.length || 0,

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">        abandonedCarts: abandoned?.length || 0,

          <div>        topPages,

            <h1 className="text-4xl font-black text-white flex items-center gap-3">        trafficSources,

              <BarChart3 className="w-10 h-10 text-brand-400" />        dailyVisits,

              Analytics & Atribuição        onlineVisitors,

            </h1>        topCountries,

            <p className="text-gray-400 mt-2">        topCities,

              Revenue Attribution • De onde vem o dinheiro e onde ele trava?        deviceBreakdown

            </p>      })

          </div>    } catch (error) {

      console.error('Erro ao carregar analytics:', error)

          <div className="flex items-center gap-3">    } finally {

            {/* Date Range */}      setLoading(false)

            <select     }

              value={dateRange}  }

              onChange={(e) => setDateRange(Number(e.target.value))}

              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"  if (loading) {

            >    return (

              <option value={7}>Últimos 7 dias</option>      <div className="p-8">

              <option value={30}>Últimos 30 dias</option>        <div className="animate-pulse space-y-4">

              <option value={60}>Últimos 60 dias</option>          <div className="h-8 bg-gray-200 rounded w-1/4"></div>

              <option value={90}>Últimos 90 dias</option>          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            </select>            {[1, 2, 3, 4].map(i => (

              <div key={i} className="h-32 bg-gray-200 rounded"></div>

            <button            ))}

              onClick={loadAnalyticsData}          </div>

              disabled={refreshing}        </div>

              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 text-white transition-colors"      </div>

            >    )

              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />  }

              Atualizar

            </button>  return (

    <div className="p-4 md:p-8 space-y-6">

            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl hover:shadow-lg hover:shadow-brand-500/30 transition-all">      {/* Header */}

              <Download className="w-4 h-4" />      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

              Exportar        <div>

            </button>          <h1 className="text-3xl font-bold text-white">Analytics</h1>

          </div>          <p className="text-gray-300 mt-1">Visão geral do desempenho do site</p>

        </div>        </div>

        

        {/* ==========================================        <select

            🔥 HEALTH MONITOR (KPIs com Delta)          value={dateRange}

        ========================================== */}          onChange={(e) => setDateRange(Number(e.target.value))}

        <div>          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"

          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">        >

            <Target className="w-5 h-5 text-green-400" />          <option value={7}>Últimos 7 dias</option>

            Health Monitor          <option value={14}>Últimos 14 dias</option>

          </h2>          <option value={30}>Últimos 30 dias</option>

                    <option value={90}>Últimos 90 dias</option>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">        </select>

            {healthMetrics && (      </div>

              <>

                <HealthCard      {/* Cards de métricas principais */}

                  title="Visitantes Únicos"      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                  value={healthMetrics.unique_visitors}        {/* 🆕 VISITANTES ONLINE - ATUALIZAÇÃO EM TEMPO REAL */}

                  delta={healthMetrics.visitors_change}        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white relative">

                  icon={Users}          <div className="flex items-center gap-4">

                  color="from-blue-500 to-cyan-600"            <div className="p-3 bg-white/20 rounded-lg relative">

                />              <Radio className="w-6 h-6" />

                <HealthCard              {/* Indicador pulsante */}

                  title="Taxa de Conversão"              <span className="absolute top-0 right-0 flex h-3 w-3">

                  value={healthMetrics.conversion_rate}                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>

                  delta={0} // Não temos delta de conversão ainda                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>

                  icon={Target}              </span>

                  color="from-green-500 to-emerald-600"            </div>

                  format="percent"            <div>

                />              <p className="text-sm text-white/80">Online Agora</p>

                <HealthCard              <p className="text-2xl font-bold">{onlineCount}</p>

                  title="Receita Total"              <p className="text-xs text-white/60 mt-1">Atualiza a cada 3s</p>

                  value={healthMetrics.revenue}            </div>

                  delta={healthMetrics.revenue_change}          </div>

                  icon={DollarSign}        </Card>

                  color="from-purple-500 to-pink-600"

                  format="currency"        <Card className="p-6">

                />          <div className="flex items-center gap-4">

                <HealthCard            <div className="p-3 bg-violet-100 rounded-lg">

                  title="Ticket Médio (AOV)"              <Eye className="w-6 h-6 text-violet-600" />

                  value={healthMetrics.average_order_value}            </div>

                  delta={healthMetrics.aov_change}            <div>

                  icon={CreditCard}              <p className="text-sm text-gray-400">Total de Visitas</p>

                  color="from-orange-500 to-red-600"              <p className="text-2xl font-bold text-white">{data?.totalVisits || 0}</p>

                  format="currency"            </div>

                />          </div>

              </>        </Card>

            )}

          </div>        <Card className="p-6">

        </div>          <div className="flex items-center gap-4">

            <div className="p-3 bg-blue-100 rounded-lg">

        {/* ==========================================              <Users className="w-6 h-6 text-blue-600" />

            📈 GRÁFICO PRINCIPAL (Visitantes vs Vendas)            </div>

        ========================================== */}            <div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">              <p className="text-sm text-gray-400">Sessões Únicas</p>

          {/* Gráfico (66%) */}              <p className="text-2xl font-bold text-white">{data?.uniqueSessions || 0}</p>

          <div className="lg:col-span-2">            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">          </div>

              <h3 className="text-xl font-bold text-white mb-1">Tendência de Tráfego vs Vendas</h3>        </Card>

              <p className="text-sm text-gray-400 mb-6">Correlação entre visitantes e receita</p>

                      <Card className="p-6">

              <ResponsiveContainer width="100%" height={320}>          <div className="flex items-center gap-4">

                <AreaChart data={dailyTrend}>            <div className="p-3 bg-green-100 rounded-lg">

                  <defs>              <TrendingUp className="w-6 h-6 text-green-600" />

                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">            </div>

                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>            <div>

                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>              <p className="text-sm text-gray-400">Taxa de Conversão</p>

                    </linearGradient>              <p className="text-2xl font-bold text-white">

                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">                {formatPercent(data?.conversionRate)}%

                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>              </p>

                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>            </div>

                    </linearGradient>          </div>

                  </defs>        </Card>

                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />        <Card className="p-6">

                  <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} />          <div className="flex items-center gap-4">

                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} />            <div className="p-3 bg-amber-100 rounded-lg">

                  <Tooltip               <MousePointerClick className="w-6 h-6 text-amber-600" />

                    contentStyle={{             </div>

                      backgroundColor: '#1f2937',             <div>

                      border: '1px solid #374151',              <p className="text-sm text-gray-400">Vendas</p>

                      borderRadius: '12px',              <p className="text-2xl font-bold text-white">{data?.totalSales || 0}</p>

                      color: '#fff'            </div>

                    }}          </div>

                  />        </Card>

                  <Area       </div>

                    yAxisId="left"

                    type="monotone"       {/* Gráfico de visitas e vendas por dia */}

                    dataKey="visitors"       <Card className="p-6">

                    stroke="#3b82f6"         <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">

                    strokeWidth={2}          <BarChart3 className="w-5 h-5" />

                    fillOpacity={1}           Visitas e Vendas ao Longo do Tempo

                    fill="url(#colorVisitors)"        </h2>

                    name="Visitantes"        <ResponsiveContainer width="100%" height={300}>

                  />          <LineChart data={data?.dailyVisits || []}>

                  <Area             <CartesianGrid strokeDasharray="3 3" />

                    yAxisId="right"            <XAxis dataKey="date" />

                    type="monotone"             <YAxis />

                    dataKey="sales"             <Tooltip />

                    stroke="#10b981"             <Legend />

                    strokeWidth={2}            <Line type="monotone" dataKey="visits" stroke="#8b5cf6" name="Visitas" strokeWidth={2} />

                    fillOpacity={1}             <Line type="monotone" dataKey="sales" stroke="#10b981" name="Vendas" strokeWidth={2} />

                    fill="url(#colorSales)"          </LineChart>

                    name="Vendas"        </ResponsiveContainer>

                  />      </Card>

                </AreaChart>

              </ResponsiveContainer>      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            </div>        {/* Páginas mais visitadas */}

          </div>        <Card className="p-6">

          <h2 className="text-xl font-bold text-white mb-4">Páginas Mais Visitadas</h2>

          {/* Visitantes Online (33%) */}          <ResponsiveContainer width="100%" height={300}>

          <div className="lg:col-span-1">            <BarChart data={data?.topPages || []}>

            <RealtimeVisitors />              <CartesianGrid strokeDasharray="3 3" />

          </div>              <XAxis dataKey="page" />

        </div>              <YAxis />

              <Tooltip />

        {/* ==========================================              <Bar dataKey="visits" fill="#8b5cf6" />

            💰 ATRIBUIÇÃO DE MARKETING + FUNIL            </BarChart>

        ========================================== */}          </ResponsiveContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        </Card>

          

          {/* ESQUERDA: Atribuição */}        {/* Fontes de tráfego */}

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">        <Card className="p-6">

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">          <h2 className="text-xl font-bold text-white mb-4">Fontes de Tráfego</h2>

              <TrendingUp className="w-5 h-5 text-brand-400" />          <ResponsiveContainer width="100%" height={300}>

              Atribuição de Marketing            <PieChart>

            </h3>              <Pie

            <p className="text-sm text-gray-400 mb-6">Receita por canal de tráfego</p>                data={data?.trafficSources || []}

                cx="50%"

            {attribution.length > 0 ? (                cy="50%"

              <ResponsiveContainer width="100%" height={300}>                labelLine={false}

                <BarChart data={attribution} layout="vertical">                label={(entry: any) => `${entry.source}: ${formatPercent(entry.percent * 100)}%`}

                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />                outerRadius={80}

                  <XAxis type="number" stroke="#9ca3af" fontSize={11} />                fill="#8884d8"

                  <YAxis dataKey="source" type="category" stroke="#9ca3af" fontSize={11} width={100} />                dataKey="count"

                  <Tooltip               >

                    contentStyle={{                 {data?.trafficSources.map((entry, index) => (

                      backgroundColor: '#1f2937',                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />

                      border: '1px solid #374151',                ))}

                      borderRadius: '12px',              </Pie>

                      color: '#fff'              <Tooltip />

                    }}            </PieChart>

                    formatter={(value: any, name: string) => {          </ResponsiveContainer>

                      if (name === 'total_revenue') return [`R$ ${Number(value).toFixed(2)}`, 'Receita']        </Card>

                      if (name === 'conversion_rate') return [`${Number(value).toFixed(2)}%`, 'Conversão']      </div>

                      return [value, name]

                    }}      {/* 🆕 NOVOS GRÁFICOS: Geolocalização e Dispositivos */}

                  />      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  <Bar dataKey="total_revenue" fill="#8b5cf6" radius={[0, 8, 8, 0]} />        {/* Top Países */}

                </BarChart>        <Card className="p-6">

              </ResponsiveContainer>          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">

            ) : (            <Globe className="w-5 h-5" />

              <div className="h-[300px] flex items-center justify-center text-gray-500">            Top Países

                <div className="text-center">          </h2>

                  <Filter className="w-12 h-12 mx-auto mb-2 opacity-20" />          <div className="space-y-3">

                  <p>Nenhum dado de atribuição ainda</p>            {data?.topCountries && data.topCountries.length > 0 ? (

                </div>              data.topCountries.map((item, index) => (

              </div>                <div key={index} className="flex items-center justify-between">

            )}                  <span className="text-gray-300">{item.country}</span>

          </div>                  <span className="font-bold text-white">{item.count}</span>

                </div>

          {/* DIREITA: Funil */}              ))

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">            ) : (

            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">              <p className="text-gray-400 text-sm">Nenhum dado de país disponível</p>

              <ShoppingCart className="w-5 h-5 text-green-400" />            )}

              Funil de Conversão          </div>

            </h3>        </Card>

            <p className="text-sm text-gray-400 mb-6">Onde os usuários estão abandonando</p>

        {/* Top Cidades */}

            {funnelData && (        <Card className="p-6">

              <div className="space-y-4">          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">

                {funnelChartData.map((step, index) => {            <Globe className="w-5 h-5" />

                  const percentage = index === 0             Top Cidades

                    ? 100           </h2>

                    : (step.value / funnelChartData[0].value) * 100          <div className="space-y-3">

                              {data?.topCities && data.topCities.length > 0 ? (

                  return (              data.topCities.map((item, index) => (

                    <div key={step.name}>                <div key={index} className="flex items-center justify-between">

                      <div className="flex items-center justify-between mb-2">                  <span className="text-gray-300">{item.city}</span>

                        <span className="text-sm font-semibold text-white">{step.name}</span>                  <span className="font-bold text-white">{item.count}</span>

                        <span className="text-sm text-gray-400">                </div>

                          {step.value.toLocaleString('pt-BR')} ({percentage.toFixed(1)}%)              ))

                        </span>            ) : (

                      </div>              <p className="text-gray-400 text-sm">Nenhum dado de cidade disponível</p>

                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">            )}

                        <motion.div           </div>

                          initial={{ width: 0 }}        </Card>

                          animate={{ width: `${percentage}%` }}

                          transition={{ duration: 0.5, delay: index * 0.1 }}        {/* Dispositivos */}

                          className="h-full rounded-full"        <Card className="p-6">

                          style={{ backgroundColor: step.fill }}          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">

                        />            <Smartphone className="w-5 h-5" />

                      </div>            Dispositivos

                    </div>          </h2>

                  )          <ResponsiveContainer width="100%" height={200}>

                })}            <PieChart>

              </div>              <Pie

            )}                data={data?.deviceBreakdown || []}

          </div>                cx="50%"

        </div>                cy="50%"

                labelLine={false}

        {/* ==========================================                label={(entry: any) => `${entry.device}: ${entry.count}`}

            📊 TABELA DETALHADA DE ATRIBUIÇÃO                outerRadius={70}

        ========================================== */}                fill="#8884d8"

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">                dataKey="count"

          <div className="p-6 border-b border-gray-700">              >

            <h3 className="text-xl font-bold text-white">Detalhamento de Canais</h3>                {data?.deviceBreakdown.map((entry, index) => (

            <p className="text-sm text-gray-400 mt-1">Performance completa por origem de tráfego</p>                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />

          </div>                ))}

              </Pie>

          <div className="overflow-x-auto">              <Tooltip />

            <table className="w-full">            </PieChart>

              <thead className="bg-gray-900/50 border-b border-gray-700">          </ResponsiveContainer>

                <tr>        </Card>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Canal</th>      </div>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Visitantes</th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Sessões</th>      {/* Card de carrinhos abandonados */}

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Vendas</th>      <Card className="p-6 bg-amber-50 border-amber-200">

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Receita</th>        <div className="flex items-center justify-between">

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Conv. %</th>          <div>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">AOV</th>            <h3 className="text-lg font-bold text-gray-900">⚠️ Carrinhos Abandonados</h3>

                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Dispositivo</th>            <p className="text-gray-700 mt-1">

                </tr>              {data?.abandonedCarts || 0} carrinhos foram abandonados neste período

              </thead>            </p>

              <tbody className="divide-y divide-gray-700">          </div>

                {attribution.map((channel, idx) => (          <a

                  <tr key={idx} className="hover:bg-gray-700/30 transition-colors">            href="/admin/abandoned-carts"

                    <td className="px-6 py-4">            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"

                      <div className="font-bold text-white capitalize">{channel.source}</div>          >

                      <div className="text-xs text-gray-500">{channel.medium} • {channel.campaign}</div>            Ver Carrinhos

                    </td>          </a>

                    <td className="px-6 py-4 text-white font-semibold">{channel.visitors.toLocaleString('pt-BR')}</td>        </div>

                    <td className="px-6 py-4 text-gray-400">{channel.sessions.toLocaleString('pt-BR')}</td>      </Card>

                    <td className="px-6 py-4 text-white font-semibold">{channel.sales_count}</td>    </div>

                    <td className="px-6 py-4 text-green-400 font-bold">R$ {channel.total_revenue.toFixed(2)}</td>  )

                    <td className="px-6 py-4">}

                      <span className={`font-bold ${
                        channel.conversion_rate > 2 ? 'text-green-400' : 
                        channel.conversion_rate > 1 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {channel.conversion_rate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">R$ {channel.average_order_value.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-400 capitalize text-sm">{channel.primary_device}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {attribution.length === 0 && (
              <div className="p-12 text-center">
                <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Nenhum dado ainda</h3>
                <p className="text-gray-400">Aguardando primeiras visitas com UTMs</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
