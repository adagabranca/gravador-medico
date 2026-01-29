import { NextResponse } from 'next/server';
import { getOutboundClicks } from '@/lib/google-analytics';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Cache 5 minutos

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '';
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    const normalizeDate = (value: string) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().split('T')[0];
    };

    const since = startParam ? normalizeDate(startParam) : null;
    const until = endParam ? normalizeDate(endParam) : null;

    let dateRange: '7daysAgo' | '30daysAgo' | '90daysAgo' | { startDate: string; endDate: string } = '30daysAgo';

    if (since && until) {
      dateRange = { startDate: since, endDate: until };
    } else {
      const today = new Date();
      const toIso = (d: Date) => d.toISOString().split('T')[0];

      switch (period) {
        case 'today': {
          const date = toIso(today);
          dateRange = { startDate: date, endDate: date };
          break;
        }
        case 'yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const date = toIso(yesterday);
          dateRange = { startDate: date, endDate: date };
          break;
        }
        case 'last_7d': {
          const start = new Date(today);
          start.setDate(start.getDate() - 6);
          dateRange = { startDate: toIso(start), endDate: toIso(today) };
          break;
        }
        case 'last_14d': {
          const start = new Date(today);
          start.setDate(start.getDate() - 13);
          dateRange = { startDate: toIso(start), endDate: toIso(today) };
          break;
        }
        case 'last_30d': {
          const start = new Date(today);
          start.setDate(start.getDate() - 29);
          dateRange = { startDate: toIso(start), endDate: toIso(today) };
          break;
        }
        case 'this_month': {
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          dateRange = { startDate: toIso(start), endDate: toIso(today) };
          break;
        }
        case 'last_month': {
          const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const end = new Date(today.getFullYear(), today.getMonth(), 0);
          dateRange = { startDate: toIso(start), endDate: toIso(end) };
          break;
        }
        case '7daysAgo':
        case '30daysAgo':
        case '90daysAgo':
          dateRange = period as '7daysAgo' | '30daysAgo' | '90daysAgo';
          break;
        default:
          dateRange = '30daysAgo';
      }
    }
    
    const data = await getOutboundClicks(dateRange);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar cliques de saída:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar dados do Google Analytics',
        clicks: [],
        summary: {
          whatsapp: 0,
          appstore: 0,
          playstore: 0,
          external: 0,
          total: 0,
        }
      },
      { status: 500 }
    );
  }
}
