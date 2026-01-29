import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkPhones() {
  console.log('\n🔍 BUSCANDO TELEFONES DO WHATSAPP...\n');
  
  // 1. Ver contatos do WhatsApp
  const { data: contacts } = await supabase
    .from('whatsapp_contacts')
    .select('push_name, remote_jid')
    .not('push_name', 'is', null)
    .limit(10)
    .order('last_message_timestamp', { ascending: false });
    
  console.log('📱 CONTATOS WHATSAPP (últimos 10):');
  contacts?.forEach(c => {
    const phone = c.remote_jid?.replace('@s.whatsapp.net', '').replace('@c.us', '');
    console.log(`  ${c.push_name} -> ${phone}`);
  });
  
  // 2. Ver vendas sem telefone
  const { data: sales } = await supabase
    .from('sales')
    .select('id, customer_name, customer_email, customer_phone')
    .in('status', ['paid', 'provisioning', 'active'])
    .or('customer_phone.is.null,customer_phone.eq.')
    .order('created_at', { ascending: false })
    .limit(15);
    
  console.log('\n\n❌ VENDAS SEM TELEFONE:');
  sales?.forEach(s => {
    console.log(`  ${s.customer_name} (${s.customer_email})`);
  });
  
  // 3. Tentar cruzar por nome
  console.log('\n\n🔗 TENTANDO CRUZAMENTO POR NOME...\n');
  
  let found = 0;
  const updates: any[] = [];
  
  for (const sale of sales || []) {
    const contact = contacts?.find(c => {
      const saleName = sale.customer_name?.toLowerCase().trim();
      const contactName = c.push_name?.toLowerCase().trim();
      return saleName === contactName || 
             saleName?.includes(contactName || '') || 
             contactName?.includes(saleName || '');
    });
    
    if (contact) {
      const phone = contact.remote_jid?.replace('@s.whatsapp.net', '').replace('@c.us', '');
      console.log(`✅ MATCH: ${sale.customer_name} -> ${phone}`);
      found++;
      updates.push({ id: sale.id, phone });
    }
  }
  
  console.log(`\n\n📊 RESULTADO: ${found} telefones encontrados de ${sales?.length || 0} vendas sem telefone`);
  
  // 4. Atualizar se encontrou algum
  if (updates.length > 0) {
    console.log('\n💾 ATUALIZANDO VENDAS...\n');
    
    for (const update of updates) {
      const { error } = await supabase
        .from('sales')
        .update({ customer_phone: update.phone })
        .eq('id', update.id);
        
      if (error) {
        console.log(`❌ Erro ao atualizar ${update.id}: ${error.message}`);
      } else {
        console.log(`✅ Venda ${update.id} atualizada com telefone ${update.phone}`);
      }
    }
  }
}

checkPhones().catch(console.error);
