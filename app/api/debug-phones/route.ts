import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Verificar secret para segurança
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  
  if (secret !== 'debug123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  console.log('\n🔍 BUSCANDO TELEFONES DO WHATSAPP...\n');
  
  // 1. Ver contatos do WhatsApp
  const { data: contacts } = await supabase
    .from('whatsapp_contacts')
    .select('push_name, remote_jid')
    .not('push_name', 'is', null)
    .limit(20)
    .order('last_message_timestamp', { ascending: false });
    
  const contactsInfo = contacts?.map((c: any) => {
    const phone = c.remote_jid?.replace('@s.whatsapp.net', '').replace('@c.us', '');
    return { name: c.push_name, phone };
  });
  
  // 2. Ver vendas sem telefone
  const { data: sales } = await supabase
    .from('sales')
    .select('id, customer_name, customer_email, customer_phone')
    .in('status', ['paid', 'provisioning', 'active'])
    .or('customer_phone.is.null,customer_phone.eq.')
    .order('created_at', { ascending: false })
    .limit(20);
  
  // 3. Tentar cruzar por nome
  const matches: any[] = [];
  
  for (const sale of sales || []) {
    const contact = contacts?.find((c: any) => {
      const saleName = sale.customer_name?.toLowerCase().trim();
      const contactName = c.push_name?.toLowerCase().trim();
      return saleName === contactName || 
             saleName?.includes(contactName || '') || 
             contactName?.includes(saleName || '');
    });
    
    if (contact) {
      const phone = contact.remote_jid?.replace('@s.whatsapp.net', '').replace('@c.us', '');
      matches.push({ 
        sale_id: sale.id,
        customer_name: sale.customer_name,
        customer_email: sale.customer_email,
        whatsapp_name: contact.push_name,
        phone 
      });
    }
  }
  
  return NextResponse.json({
    success: true,
    stats: {
      total_whatsapp_contacts: contacts?.length || 0,
      total_sales_without_phone: sales?.length || 0,
      matches_found: matches.length
    },
    whatsapp_contacts: contactsInfo,
    sales_without_phone: sales?.map((s: any) => ({
      name: s.customer_name,
      email: s.customer_email
    })),
    matches
  });
}
