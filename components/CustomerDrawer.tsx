'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MessageCircle, ShoppingBag, DollarSign, Calendar, TrendingUp, Sparkles, StickyNote, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Customer } from '@/app/api/admin/customers/route';

interface CustomerDrawerProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
}

interface Sale {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  payment_method: string;
  product_name?: string;
}

interface Note {
  id: string;
  created_at: string;
  note: string;
  created_by_email: string;
  is_important: boolean;
}

export default function CustomerDrawer({ customer, open, onClose }: CustomerDrawerProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (open && customer) {
      fetchCustomerDetails();
    }
  }, [open, customer]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customer.email }),
      });
      
      const data = await response.json();
      setSales(data.sales || []);
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    
    setSavingNote(true);
    try {
      // TODO: Implementar endpoint para salvar nota
      const response = await fetch('/api/admin/customer-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: customer.email,
          note: newNote,
          created_by_email: 'admin@example.com', // Pegar do auth
        }),
      });
      
      if (response.ok) {
        setNewNote('');
        fetchCustomerDetails(); // Atualizar notas
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSavingNote(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-500/20 text-green-400 border-green-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      refunded: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: '✅ Pago',
      approved: '✅ Aprovado',
      pending: '⏳ Pendente',
      failed: '❌ Falhou',
      refunded: '↩️ Estornado',
    };
    return labels[status] || status;
  };

  const openWhatsApp = () => {
    const phone = customer.phone?.replace(/\D/g, '');
    if (phone) {
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const openEmail = () => {
    window.location.href = `mailto:${customer.email}`;
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-[#0A0A0A] border-l border-gray-800 z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    backgroundColor: `hsl(${customer.email.charCodeAt(0) * 7 % 360}, 65%, 55%)`,
                  }}
                >
                  {customer.name ? customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{customer.name || 'Sem nome'}</h2>
                  <p className="text-gray-400 text-sm">{customer.email}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={openWhatsApp}
                  disabled={!customer.phone}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={openEmail}
                  variant="outline"
                  className="bg-[#1A1A1A] border-gray-700 text-white hover:bg-[#222222]"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Separator className="bg-gray-800" />

          {/* Métricas Destacadas */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-green-900/30 to-emerald-800/20 border-green-700/30 p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-xs font-medium">Lifetime Value</span>
              </div>
              <p className="text-2xl font-bold text-white">{formatCurrency(customer.ltv || 0)}</p>
              <p className="text-xs text-gray-500 mt-1">Ticket Médio: {formatCurrency(customer.aov || 0)}</p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-800/20 border-purple-700/30 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-xs font-medium">Engagement Score</span>
              </div>
              <p className="text-2xl font-bold text-white">{customer.engagement_score}/100</p>
              <p className="text-xs text-gray-500 mt-1">{customer.paid_orders} pedidos pagos</p>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-xs">Primeira Compra</span>
              </div>
              <p className="text-white text-sm font-medium">
                {customer.first_purchase ? formatDate(customer.first_purchase) : 'N/A'}
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400 text-xs">Última Compra</span>
              </div>
              <p className="text-white text-sm font-medium">
                {customer.last_purchase ? formatDate(customer.last_purchase) : 'N/A'}
              </p>
            </div>

            {customer.phone && (
              <div className="bg-[#111111] border border-gray-800 rounded-lg p-3 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-xs">Telefone</span>
                </div>
                <p className="text-white text-sm font-medium">{customer.phone}</p>
              </div>
            )}
          </div>

          <Separator className="bg-gray-800" />

          {/* Timeline de Compras */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              Histórico de Compras ({sales.length})
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {loading ? (
                <p className="text-gray-500 text-sm">Carregando...</p>
              ) : sales.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma compra registrada</p>
              ) : (
                sales.map((sale) => (
                  <Card key={sale.id} className="bg-[#111111] border-gray-800 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">
                          {sale.product_name || 'Produto'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {formatDate(sale.created_at)}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(sale.status)} border`}>
                        {getStatusLabel(sale.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                      <span className="text-gray-400 text-xs">{sale.payment_method || 'N/A'}</span>
                      <span className="text-green-400 font-bold">{formatCurrency(sale.total_amount)}</span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Notas Internas */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-yellow-400" />
              Notas Internas
            </h3>

            {/* Nova Nota */}
            <div className="mb-4">
              <Textarea
                placeholder="Adicionar nota sobre o cliente..."
                value={newNote}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                className="bg-[#1A1A1A] border-gray-700 text-white placeholder:text-gray-500 min-h-[80px]"
              />
              <Button
                onClick={handleSaveNote}
                disabled={!newNote.trim() || savingNote}
                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {savingNote ? 'Salvando...' : 'Salvar Nota'}
              </Button>
            </div>

            {/* Lista de Notas */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma nota registrada</p>
              ) : (
                notes.map((note) => (
                  <Card key={note.id} className="bg-[#111111] border-gray-800 p-3">
                    <p className="text-white text-sm mb-2">{note.note}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{note.created_by_email}</span>
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
