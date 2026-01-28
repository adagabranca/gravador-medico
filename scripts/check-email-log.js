#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function main(){
  const email = 'drglp@outlook.com'
  const { data, error } = await supabase.from('email_logs').select('*').eq('recipient_email', email).order('created_at', {ascending:false}).limit(5)
  if(error) return console.error('Erro:', error)
  console.log('Found logs:', data.length)
  console.dir(data, {depth:4})
}

main().catch(console.error)
