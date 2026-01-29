/**
 * Logs de Disparos de Webhook
 * Página para visualizar histórico de webhooks enviados
 * URL: /admin/tracking/logs/webhooks
 */

'use client';

import { useEffect, useState } from 'react';
import { 
  Webhook, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Calendar,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WebhookLog {
  id: string;
  created_at: string;
  processed_at?: string | null;
  source?: string | null;
  event_type?: string | null;
  processed?: boolean | null;
  success?: boolean | null;
  error_message?: string | null;
  payload?: any;
}

export default function WebhookLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/webhooks/logs', { credentials: 'include' });
      const result = await response.json();
      setLogs(Array.isArray(result.logs) ? result.logs : []);
    } catch (error) {
      console.error('Erro ao carregar logs de webhooks:', error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    (log.source || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.event_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const successCount = logs.filter(l => l.success === true).length;
  const failedCount = logs.filter(l => l.processed && !l.success).length;
  const logsWithTime = logs.filter(l => l.processed_at && l.created_at);
  const avgResponseTime = logsWithTime.length > 0
    ? (
        logsWithTime.reduce((acc, l) => {
          const created = new Date(l.created_at).getTime();
          const processed = new Date(l.processed_at as string).getTime();
          return acc + Math.max(processed - created, 0);
        }, 0) / logsWithTime.length
      ).toFixed(0)
    : '0';

  return (
    <div className="min-h-screen bg-zinc-950 p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <Webhook className="w-8 h-8 text-purple-400" />
            Disparos de Webhook
          </h1>
          <p className="text-zinc-400 mt-2">
            Histórico de webhooks enviados para seus endpoints configurados
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={loadLogs} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Disparos</p>
                <p className="text-2xl font-bold text-zinc-100 mt-1">{logs.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-600/30 flex items-center justify-center">
                <Webhook className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Sucesso</p>
                <p className="text-2xl font-bold text-zinc-100 mt-1">{successCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-600/10 border border-green-600/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Falhas</p>
                <p className="text-2xl font-bold text-zinc-100 mt-1">{failedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Tempo Médio</p>
                <p className="text-2xl font-bold text-zinc-100 mt-1">{avgResponseTime}ms</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/30 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                placeholder="Buscar por endpoint ou tipo de evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700">
              <Calendar className="w-4 h-4 mr-2" />
              Hoje
            </Button>
            <Button variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Logs */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Histórico de Webhooks</CardTitle>
          <CardDescription className="text-zinc-400">
            Registros de todos os webhooks enviados para seus endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/50">
                  <TableHead className="text-zinc-300 font-semibold">Horário</TableHead>
                  <TableHead className="text-zinc-300 font-semibold">Fonte</TableHead>
                  <TableHead className="text-zinc-300 font-semibold">Evento</TableHead>
                  <TableHead className="text-zinc-300 font-semibold">Status</TableHead>
                  <TableHead className="text-zinc-300 font-semibold">HTTP Code</TableHead>
                  <TableHead className="text-zinc-300 font-semibold">Tempo</TableHead>
                  <TableHead className="text-zinc-300 font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const createdAt = log.created_at
                    ? new Date(log.created_at).toLocaleString('pt-BR')
                    : '-';
                  const status = log.success
                    ? 'success'
                    : log.processed
                      ? 'failed'
                      : 'pending';
                  const httpCode = log.payload?.http_code ?? log.payload?.status ?? '-';
                  const responseTime = log.processed_at
                    ? `${Math.max(new Date(log.processed_at).getTime() - new Date(log.created_at).getTime(), 0)}ms`
                    : '-';

                  return (
                  <TableRow 
                    key={log.id} 
                    className="border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                  >
                    <TableCell className="text-zinc-400 text-sm font-mono">
                      {createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300 text-sm font-mono truncate max-w-[300px]">
                          {log.source || 'webhook'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-300 border border-blue-600/40 text-xs font-semibold">
                        {log.event_type || 'unknown'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {status === 'success' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-600/20 border border-green-600/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-xs font-semibold text-green-300">Sucesso</span>
                        </div>
                      ) : status === 'failed' ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/20 border border-red-600/40">
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-xs font-semibold text-red-300">Falhou</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-600/20 border border-yellow-600/40">
                          <Clock className="w-3.5 h-3.5 text-yellow-400" />
                          <span className="text-xs font-semibold text-yellow-300">Pendente</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-mono ${
                        typeof httpCode === 'number' && httpCode >= 200 && httpCode < 300 
                          ? 'text-green-400' 
                          : typeof httpCode === 'number' && httpCode >= 400 
                          ? 'text-red-400' 
                          : 'text-yellow-400'
                      }`}>
                        {httpCode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-mono ${
                        typeof responseTime === 'string' && parseInt(responseTime) < 200 
                          ? 'text-green-400' 
                          : typeof responseTime === 'string' && parseInt(responseTime) < 1000 
                          ? 'text-yellow-400' 
                          : 'text-red-400'
                      }`}>
                        {responseTime}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
