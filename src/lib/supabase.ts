import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Appointment = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service: string
  appointment_date: string
  appointment_time: string
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  read: boolean
  created_at: string
}

export const SERVICES = [
  { id: 'haircut', name: 'Classic Haircut', price: 25, duration: '30 min', description: 'Precision cut tailored to your style' },
  { id: 'beard-trim', name: 'Beard Trim & Shape', price: 15, duration: '20 min', description: 'Clean lines and perfect shape' },
  { id: 'shave', name: 'Hot Towel Shave', price: 30, duration: '30 min', description: 'Traditional straight razor shave' },
  { id: 'kids-cut', name: "Kids' Haircut", price: 20, duration: '20 min', description: 'For children under 12' },
  { id: 'full-service', name: 'Full Service', price: 45, duration: '60 min', description: 'Haircut + beard trim + hot towel' },
  { id: 'fade', name: 'Skin Fade', price: 30, duration: '45 min', description: 'Clean skin fade with any style' },
]

export const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM',
]
