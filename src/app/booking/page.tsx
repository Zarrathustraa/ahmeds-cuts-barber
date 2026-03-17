'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase, SERVICES, TIME_SLOTS } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Scissors, ChevronLeft, ChevronRight, Check, Calendar, Clock, User, Phone, Mail } from 'lucide-react'

const STEPS = ['Service', 'Date & Time', 'Your Info', 'Confirm']

export default function BookingPage() {
  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const service = SERVICES.find(s => s.id === selectedService)

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 60)
    return maxDate.toISOString().split('T')[0]
  }

  const loadBookedSlots = async (date: string) => {
    const { data } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .neq('status', 'cancelled')
    setBookedSlots(data?.map(d => d.appointment_time) || [])
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    loadBookedSlots(date)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          service: service?.name || selectedService,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          notes: form.notes,
          status: 'pending',
        }])
        .select('id')
        .single()
      if (error) throw error
      setBookingId(data.id)
      setConfirmed(true)
      toast.success('Appointment booked successfully!')
    } catch {
      toast.error('Failed to book appointment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
          <p className="text-gray-400 mb-2">Booking ID: <span className="text-amber-500 font-mono text-sm">{bookingId.slice(0,8).toUpperCase()}</span></p>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mt-6 mb-8 text-left space-y-3">
            <div className="flex justify-between"><span className="text-gray-400">Service</span><span className="text-white font-medium">{service?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="text-white font-medium">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Time</span><span className="text-white font-medium">{selectedTime}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Price</span><span className="text-amber-500 font-bold">${service?.price}</span></div>
          </div>
          <p className="text-gray-400 mb-6">A confirmation email will be sent to <span className="text-amber-500">{form.email}</span></p>
          <Link href="/" className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-8 py-3 rounded-full transition-all inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <Scissors className="text-amber-500" size={20} />
            <span className="font-bold text-amber-500">Ahmed&apos;s Cuts</span>
          </div>
          <span className="text-gray-600 ml-auto">Book Appointment</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-amber-500' : 'text-gray-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  i < step ? 'bg-amber-600 border-amber-600 text-black' :
                  i === step ? 'border-amber-500 text-amber-500' :
                  'border-gray-700 text-gray-600'
                }`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-amber-600' : 'bg-gray-800'}`} style={{minWidth: '20px'}} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Choose a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${
                    selectedService === s.id
                      ? 'border-amber-500 bg-amber-600/10'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white">{s.name}</h3>
                    {selectedService === s.id && <Check size={18} className="text-amber-500" />}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{s.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-500 font-bold text-lg">${s.price}</span>
                    <span className="text-gray-500 text-sm flex items-center gap-1"><Clock size={12} />{s.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Pick a Date & Time</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-amber-500" /> Select Date
              </label>
              <input
                type="date"
                min={getMinDate()}
                max={getMaxDate()}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-amber-500" /> Available Time Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isBooked = bookedSlots.includes(slot)
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedTime(slot)}
                        className={`time-slot py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          isBooked ? 'opacity-40 cursor-not-allowed bg-gray-800 border-gray-700 text-gray-500' :
                          selectedTime === slot ? 'bg-amber-600 border-amber-600 text-black' :
                          'bg-gray-900 border-gray-700 text-gray-300 hover:border-amber-500'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Customer Info */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Your Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <User size={16} className="text-amber-500" /> Full Name *
                </label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-amber-500" /> Email Address *
                </label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-amber-500" /> Phone Number *
                </label>
                <input
                  type="tel" required value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="(555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Special Notes (Optional)</label>
                <textarea
                  rows={3} value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  placeholder="Any special requests or preferences..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Confirm Your Booking</h2>
            <div className="bg-gray-900 rounded-2xl p-6 border border-amber-600/30 space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 flex items-center gap-2"><Scissors size={16} className="text-amber-500" />Service</span>
                <span className="text-white font-medium">{service?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 flex items-center gap-2"><Calendar size={16} className="text-amber-500" />Date</span>
                <span className="text-white font-medium">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {weekday:'short',month:'short',day:'numeric',year:'numeric'})}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 flex items-center gap-2"><Clock size={16} className="text-amber-500" />Time</span>
                <span className="text-white font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 flex items-center gap-2"><User size={16} className="text-amber-500" />Name</span>
                <span className="text-white font-medium">{form.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 flex items-center gap-2"><Mail size={16} className="text-amber-500" />Email</span>
                <span className="text-white font-medium">{form.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800">
                <span className="text-gray-400 flex items-center gap-2"><Phone size={16} className="text-amber-500" />Phone</span>
                <span className="text-white font-medium">{form.phone}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-300 font-semibold text-lg">Total</span>
                <span className="text-amber-500 font-bold text-2xl">${service?.price}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm text-center mb-6">By confirming, you agree to our cancellation policy. Please arrive 5 minutes early.</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-full text-gray-300 hover:border-amber-500 hover:text-amber-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} /> Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 0 && !selectedService) { toast.error('Please select a service'); return }
                if (step === 1 && !selectedDate) { toast.error('Please select a date'); return }
                if (step === 1 && !selectedTime) { toast.error('Please select a time slot'); return }
                if (step === 2 && (!form.name || !form.email || !form.phone)) { toast.error('Please fill in all required fields'); return }
                setStep(step + 1)
              }}
              className="flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-full transition-all"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-bold rounded-full transition-all"
            >
              {submitting ? 'Booking...' : 'Confirm Booking'} <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
