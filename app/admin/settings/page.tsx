"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Key,
  Webhook,
  Database,
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [showAppmaxToken, setShowAppmaxToken] = useState(false)
  const [showSupabaseUrl, setShowSupabaseUrl] = useState(false)
  const [showSupabaseKey, setShowSupabaseKey] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    // URL do webhook para configurar na Appmax
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    setWebhookUrl(`${baseUrl}/api/webhook/appmax`)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copiado para a área de transferência!')
  }

  const testWebhook = async () => {
    try {
      setSaveStatus('saving')
      
      const response = await fetch('/api/webhook/appmax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'test',
          data: {
            order_id: 'TEST-' + Date.now(),
            status: 'approved',
            amount: 100.00,
            customer: {
              name: 'Teste Webhook',
              email: 'teste@gravadormedico.com',
            },
          },
        }),
      })

      if (response.ok) {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Configurações</h1>
          <p className="text-gray-400 mt-1">Gerencie integrações e credenciais</p>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Webhook className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Webhook da Appmax</h3>
              <p className="text-sm text-gray-400">Configure este endpoint na sua conta Appmax</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">URL do Webhook</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={() => copyToClipboard(webhookUrl)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Cole esta URL na seção de webhooks da Appmax para receber notificações de pagamento
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Eventos Suportados</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                'order.approved',
                'order.pending',
                'order.rejected',
                'order.refunded',
                'pix.generated',
                'pix.paid',
              ].map((event) => (
                <div key={event} className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg border border-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300 font-mono">{event}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={testWebhook}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-50"
          >
            {saveStatus === 'saving' && <RefreshCw className="w-4 h-4 animate-spin" />}
            {saveStatus === 'success' && <CheckCircle className="w-4 h-4" />}
            {saveStatus === 'error' && <AlertCircle className="w-4 h-4" />}
            {saveStatus === 'idle' && <Webhook className="w-4 h-4" />}
            {saveStatus === 'saving' ? 'Testando...' : saveStatus === 'success' ? 'Teste bem-sucedido!' : saveStatus === 'error' ? 'Erro no teste' : 'Testar Webhook'}
          </button>
        </div>
      </div>

      {/* Appmax API */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Credenciais Appmax</h3>
              <p className="text-sm text-gray-400">Conecte-se à API da Appmax</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Token da API</label>
            <div className="flex gap-2">
              <input
                type={showAppmaxToken ? 'text' : 'password'}
                value={process.env.NEXT_PUBLIC_APPMAX_API_TOKEN || 'Não configurado'}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none"
              />
              <button
                onClick={() => setShowAppmaxToken(!showAppmaxToken)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                {showAppmaxToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Configure a variável <code className="bg-gray-900 px-2 py-1 rounded">NEXT_PUBLIC_APPMAX_API_TOKEN</code> no arquivo .env.local
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">URL da API</label>
            <input
              type="text"
              value="https://api.appmax.com.br/v3"
              readOnly
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">IDs dos Produtos</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-500">VoicePen (Mensal)</div>
                <div className="text-sm text-white font-mono mt-1">32991339</div>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-500">VoicePen (Anual)</div>
                <div className="text-sm text-white font-mono mt-1">32989468</div>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-500">MediSmart (Mensal)</div>
                <div className="text-sm text-white font-mono mt-1">32989503</div>
              </div>
              <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-500">MediSmart (Anual)</div>
                <div className="text-sm text-white font-mono mt-1">32989520</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Supabase Database</h3>
              <p className="text-sm text-gray-400">Conexão com banco de dados</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Project URL</label>
            <div className="flex gap-2">
              <input
                type={showSupabaseUrl ? 'text' : 'password'}
                value={process.env.NEXT_PUBLIC_SUPABASE_URL || 'Não configurado'}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none"
              />
              <button
                onClick={() => setShowSupabaseUrl(!showSupabaseUrl)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                {showSupabaseUrl ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Anon Key</label>
            <div className="flex gap-2">
              <input
                type={showSupabaseKey ? 'text' : 'password'}
                value={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Não configurado'}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white font-mono text-sm focus:outline-none"
              />
              <button
                onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                {showSupabaseKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Tabelas Criadas</label>
            <div className="grid grid-cols-2 gap-3">
              {['profiles', 'sales', 'sales_items', 'webhooks_logs'].map((table) => (
                <div key={table} className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg border border-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300 font-mono">{table}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Segurança</h3>
              <p className="text-sm text-gray-400">Políticas e permissões</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <strong className="text-white">Importante:</strong> Mantenha suas credenciais seguras. Nunca compartilhe tokens de API ou chaves de acesso. Use variáveis de ambiente para armazenar informações sensíveis.
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Nível de Acesso</label>
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 rounded-xl border border-gray-700">
              <Shield className="w-5 h-5 text-brand-400" />
              <span className="text-white font-semibold">Administrador</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">Práticas Recomendadas</label>
            <ul className="space-y-2">
              {[
                'Use HTTPS em produção',
                'Habilite Row Level Security (RLS) no Supabase',
                'Valide IPs de origem dos webhooks',
                'Faça backups regulares do banco de dados',
                'Monitore logs de acesso e erros',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-brand-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-brand-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Precisa de ajuda?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Consulte a documentação completa ou entre em contato com o suporte para configurar integrações.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-semibold">
                📚 Documentação
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-semibold">
                💬 Suporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
