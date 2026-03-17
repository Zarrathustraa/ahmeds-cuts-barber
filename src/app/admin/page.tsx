'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Appointment, ContactMessage } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Scissors, Calendar, MessageSquare, TrendingUp, Check, X, Clock, RefreshCw, LogOut, Eye, EyeOff } from 'lucide-react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

type Tab = 'overview' | 'appointments' | 'messages'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [tab, setTab] = useState<Tab>('overview')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [apptRes, msgRes] = await Promise.all([
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ])
    if (apptRes.data) setAppointments(apptRes.data)
    if (msgRes.data) setMessages(msgRes.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authenticated) loadData()
  }, [authenticated, loadData])

  const updateAppointmentStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) { toast.error('Failed to update status'); return }
    toast.success(`Appointment ${status}`)
    setAppointments(prev => prev.map(a => a.id === id ? {...a, status: status as Appointment['status']} : a))
  }

  const markMessageRead = async (id: string) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? {...m, read: true} : m))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      toast.success('Welcome, Admin!')
    } else {
      toast.error('Invalid password')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors size={32} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Ahmed&apos;s Cuts</p>
          </div>
          <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="Enter admin password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-3 rounded-lg transition-all">
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    today: appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0]).length,
    unreadMessages: messages.filter(m => !m.read).length,
    revenue: appointments.filter(a => a.status !== 'cancelled').length * 30,
  }

  const statusColor = (status: string) => ({
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }[status] || 'bg-gray-500/20 text-gray-400')

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="text-amber-500" size={20} />
            <span className="font-bold text-amber-500">Ahmed&apos;s Cuts</span>
            <span className="text-gray-600 ml-2">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="text-gray-400 hover:text-amber-500 transition-colors" disabled={loading}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setAuthenticated(false)} className="text-gray-400 hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Calendar size={16} className="text-amber-500" />Total Bookings</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Clock size={16} className="text-yellow-500" />Pending</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><TrendingUp size={16} className="text-green-500" />Est. Revenue</div>
            <div className="text-3xl font-bold text-green-400">${stats.revenue}</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><MessageSquare size={16} className="text-blue-500" />New Messages</div>
            <div className="text-3xl font-bold text-blue-400">{stats.unreadMessages}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6 w-fit">
          {(['overview', 'appointments', 'messages'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-amber-600 text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}{t === 'messages' && stats.unreadMessages > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{stats.unreadMessages}</span>
              )}
            </button>
          ))}
        </div>

        {/* Appointments Tab */}
        {(tab === 'appointments' || tab === 'overview') && (
          <div className="mb-8">
            {tab === 'overview' && <h3 className="text-lg font-bold text-white mb-4">Recent Appointments</h3>}
            <div className="space-y-3">
              {appointments.slice(0, tab === 'overview' ? 5 : undefined).map((appt) => (
                <div key={appt.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-white">{appt.customer_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor(appt.status)}`}>{appt.status}</span>
                    </div>
                    <div className="text-gray-400 text-sm">{appt.service} &bull; {appt.appointment_date} at {appt.appointment_time}</div>
                    <div className="text-gray-500 text-xs mt-1">{appt.customer_email} &bull; {appt.customer_phone}</div>
                  </div>
                  {appt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateAppointmentStatus(appt.id, 'confirmed')} className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/30 rounded-lg text-sm transition-all">
                        <Check size={14} /> Confirm
                      </button>
                      <button onClick={() => updateAppointmentStatus(appt.id, 'cancelled')} className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 rounded-lg text-sm transition-all">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  )}
                  {appt.status === 'confirmed' && (
                    <button onClick={() => updateAppointmentStatus(appt.id, 'completed')} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 rounded-lg text-sm transition-all">
                      <Check size={14} /> Mark Done
                    </button>
                  )}
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-12 text-gray-500">No appointments yet</div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {(tab === 'messages' || tab === 'overview') && (
          <div>
            {tab === 'overview' && <h3 className="text-lg font-bold text-white mb-4">Recent Messages</h3>}
            <div className="space-y-3">
              {messages.slice(0, tab === 'overview' ? 3 : undefined).map((msg) => (
                <div key={msg.id} onClick={() => markMessageRead(msg.id)} className={`bg-gray-900 rounded-xl p-5 border cursor-pointer transition-all hover:border-gray-600 ${
                  !msg.read ? 'border-amber-600/40' : 'border-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white flex items-center gap-2">
                      {!msg.read && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                      {msg.name}
                    </span>
                    <span className="text-gray-500 text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{msg.email}{msg.phone && ` · ${msg.phone}`}</div>
                  <p className="text-gray-300 text-sm">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-500">No messages yet</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
