import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  
  let query = supabase.from('appointments').select('*').order('created_at', { ascending: false })
  if (date) query = query.eq('appointment_date', date)
  
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ appointments: data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { customer_name, customer_email, customer_phone, service, appointment_date, appointment_time, notes } = body
  
  if (!customer_name || !customer_email || !customer_phone || !service || !appointment_date || !appointment_time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  // Check if slot is already booked
  const { data: existing } = await supabase
    .from('appointments')
    .select('id')
    .eq('appointment_date', appointment_date)
    .eq('appointment_time', appointment_time)
    .neq('status', 'cancelled')
    .single()
  
  if (existing) {
    return NextResponse.json({ error: 'This time slot is already booked' }, { status: 409 })
  }
  
  const { data, error } = await supabase
    .from('appointments')
    .insert([{ customer_name, customer_email, customer_phone, service, appointment_date, appointment_time, notes, status: 'pending' }])
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ appointment: data }, { status: 201 })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { id, status } = body
  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  
  const { data, error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ appointment: data })
}
