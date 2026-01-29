import { NextRequest, NextResponse } from 'next/server';
import { analyticsDataClient, GA4_PROPERTY_ID } from '@/lib/google-analytics';

export async function GET(request: NextRequest) {
  try {
    // Verifica se as variáveis de ambiente estão configuradas
    if (!GA4_PROPERTY_ID) {
      return NextResponse.json(
        { error: 'GA4_PROPERTY_ID não configurado' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    const normalizeDate = (value: string) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().split('T')[0];
    };

    const since = startParam ? normalizeDate(startParam) : null;
    const until = endParam ? normalizeDate(endParam) : null;

    const dateRanges = since && until
      ? [{ startDate: since, endDate: until }]
      : [{ startDate: '7daysAgo', endDate: 'today' }];

    // Busca dados do Google Analytics 4
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges,
      dimensions: [
        { name: 'date' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          dimension: { dimensionName: 'date' },
          desc: false,
        },
      ],
    });

    // Formata os dados para o Recharts
    const formattedData = response.rows?.map((row) => {
      const dateString = row.dimensionValues?.[0]?.value || '';
      // Formato original: YYYYMMDD -> DD/MM
      const day = dateString.slice(6, 8);
      const month = dateString.slice(4, 6);
      const formattedDate = `${day}/${month}`;

      return {
        date: formattedDate,
        usuarios: parseInt(row.metricValues?.[0]?.value || '0', 10),
        visualizacoes: parseInt(row.metricValues?.[1]?.value || '0', 10),
      };
    }) || [];

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erro ao buscar dados do GA4:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do Google Analytics' },
      { status: 500 }
    );
  }
}
