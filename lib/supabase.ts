import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos
export interface User {
  id: string
  email: string
  name?: string
  appmax_customer_id?: string
  has_access: boolean
  created_at: string
  updated_at: string
}

/**
 * Cria ou atualiza um usuário após compra na APPMAX
 */
export async function createOrUpdateUser(data: {
  email: string
  name?: string
  appmax_customer_id?: string
}) {
  const { data: user, error } = await supabase
    .from('users')
    .upsert({
      email: data.email,
      name: data.name,
      appmax_customer_id: data.appmax_customer_id,
      has_access: true,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'email'
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar/atualizar usuário:', error)
    throw error
  }

  return user
}

/**
 * Busca usuário por email
 */
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Erro ao buscar usuário:', error)
    throw error
  }

  return data
}

/**
 * Verifica se usuário tem acesso
 */
export async function checkUserAccess(email: string): Promise<boolean> {
  const user = await getUserByEmail(email)
  return user?.has_access || false
}