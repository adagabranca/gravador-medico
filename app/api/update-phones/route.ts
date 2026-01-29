import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const updates = [
    // 3 encontrados pelo WhatsApp
    { email: 'dramirandavanessa@gmail.com', phone: '556596750638', source: 'WhatsApp' },
    { email: 'wevertonfcarvalho@hotmail.com', phone: '556294349259', source: 'WhatsApp' },
    { email: 'bernadetebottene@gmail.com', phone: '553199185012', source: 'WhatsApp' },
    
    // 4 fornecidos manualmente
    { email: 'azortea-es@udabol.edu.bo', phone: '5594992150717', source: 'Manual' },
    { email: 'carol.lucas20@hotmail.com', phone: '5531997188086', source: 'Manual' },
    { email: 'silasjuba@me.com', phone: '5541992533891', source: 'Manual' },
    { email: 'patrmirandaperfil06@gmail.com', phone: '5571981546688', source: 'Manual' },
  ];
  
  const results = [];
  
  for (const update of updates) {
    const { data: sale, error: fetchError } = await supabase
      .from('sales')
      .select('id, customer_name, customer_email, customer_phone')
      .eq('customer_email', update.email)
      .in('status', ['paid', 'provisioning', 'active'])
      .or('customer_phone.is.null,customer_phone.eq.')
      .single();
    
    if (fetchError || !sale) {
      results.push({
        email: update.email,
        status: 'not_found',
        error: fetchError?.message || 'Sale not found'
      });
      continue;
    }
    
    const { error: updateError } = await supabase
      .from('sales')
      .update({ 
        customer_phone: update.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', sale.id);
    
    if (updateError) {
      results.push({
        email: update.email,
        status: 'error',
        error: updateError.message
      });
    } else {
      results.push({
        email: update.email,
        name: sale.customer_name,
        phone: update.phone,
        source: update.source,
        status: 'updated'
      });
    }
  }
  
  const successCount = results.filter(r => r.status === 'updated').length;
  
  return NextResponse.json({
    success: true,
    total_updates: updates.length,
    successful: successCount,
    failed: updates.length - successCount,
    results
  });
}
