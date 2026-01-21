import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_email, note, created_by_email, is_important = false } = body;
    
    if (!customer_email || !note) {
      return NextResponse.json(
        { error: 'Email e nota são obrigatórios' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabaseAdmin
      .from('customer_notes')
      .insert({
        customer_email,
        note,
        created_by_email: created_by_email || 'admin@system',
        is_important,
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error saving note:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, note: data });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
