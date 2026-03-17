'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, SERVICES } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Scissors, Clock, Star, Phone, Mail, MapPin, Instagram, Facebook, ChevronDown, Menu, X } from 'lucide-react'

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop', alt: 'Classic fade haircut' },
  { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', alt: 'Beard grooming' },
  { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop', alt: 'Precision cut' },
  { src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=600&fit=crop', alt: 'Barber at work' },
  { src: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=600&h=600&fit=crop', alt: 'Modern style' },
  { src: 'https://images.unsplash.com/photo-1593702288056-f9454571b4b8?w=600&h=600&fit=crop', alt: 'Sharp lines' },
]

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { error } = await supabase.from('contact_messages').insert([contactForm])
      if (error) throw error
      toast.success('Message sent! We\'ll get back to you soon.')
      setContactForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Scissors className="text-amber-500" size={24} />
              <span className="text-xl font-bold text-amber-500">Ahmed&apos;s Cuts</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-300 hover:text-amber-500 transition-colors">Services</a>
              <a href="#gallery" className="text-gray-300 hover:text-amber-500 transition-colors">Gallery</a>
              <a href="#about" className="text-gray-300 hover:text-amber-500 transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-amber-500 transition-colors">Contact</a>
              <Link href="/booking" className="bg-amber-600 hover:bg-amber-500 text-black font-semibold px-5 py-2 rounded-full transition-colors">
                Book Now
              </Link>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col gap-4">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-500">Services</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-500">Gallery</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-500">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-amber-500">Contact</a>
            <Link href="/booking" className="bg-amber-600 text-black font-semibold px-5 py-2 rounded-full text-center">Book Now</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, #d97706 0, #d97706 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px'}} />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center">
              <Scissors size={40} className="text-black" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-white">Ahmed&apos;s</span>{' '}
            <span className="text-amber-500">Cuts</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">Premium Barbershop Experience</p>
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-amber-500 fill-amber-500" />)}
            <span className="text-gray-400 ml-2">5.0 · 200+ Reviews</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105">
              Book Appointment
            </Link>
            <a href="#services" className="border-2 border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-black font-bold px-8 py-4 rounded-full text-lg transition-all">
              View Services
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">10+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">5K+</div>
              <div className="text-gray-400 text-sm">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">100%</div>
              <div className="text-gray-400 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-amber-500" size={32} />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-amber-500">Services</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Premium grooming services tailored to your style. Every cut is a masterpiece.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <div key={service.id} className="card-hover bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-amber-600">
                <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Scissors className="text-amber-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-amber-500 text-2xl font-bold">${service.price}</span>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock size={14} />
                    <span>{service.duration}</span>
                  </div>
                </div>
                <Link href="/booking" className="mt-4 w-full block text-center bg-amber-600/20 hover:bg-amber-600 text-amber-500 hover:text-black border border-amber-600 font-semibold py-2 rounded-lg transition-all">
                  Book This Service
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-amber-500">Work</span></h2>
            <p className="text-gray-400 text-lg">Every cut tells a story. See our latest work.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-semibold">{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Hours Section */}
      <section id="about" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About <span className="text-amber-500">Ahmed&apos;s Cuts</span></h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                With over 10 years of experience, Ahmed&apos;s Cuts has been the go-to destination for men who demand the best. 
                We combine traditional barbering techniques with modern styles to give you a look that&apos;s uniquely yours.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Our skilled barbers are passionate about their craft, staying up-to-date with the latest trends while mastering 
                the timeless classics. From a sharp fade to a classic taper, we&apos;ve got you covered.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-amber-500 font-bold text-lg mb-1">Premium Products</div>
                  <div className="text-gray-400 text-sm">We use only top-quality grooming products</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="text-amber-500 font-bold text-lg mb-1">Expert Barbers</div>
                  <div className="text-gray-400 text-sm">Certified professionals with years of experience</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-amber-500" size={24} />
                Business Hours
              </h3>
              <div className="space-y-3">
                {[
                  { day: 'Monday', hours: '9:00 AM - 7:00 PM' },
                  { day: 'Tuesday', hours: '9:00 AM - 7:00 PM' },
                  { day: 'Wednesday', hours: '9:00 AM - 7:00 PM' },
                  { day: 'Thursday', hours: '9:00 AM - 8:00 PM' },
                  { day: 'Friday', hours: '9:00 AM - 8:00 PM' },
                  { day: 'Saturday', hours: '8:00 AM - 6:00 PM' },
                  { day: 'Sunday', hours: '10:00 AM - 4:00 PM' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-300 font-medium">{day}</span>
                    <span className="text-amber-500">{hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-amber-500" size={18} />
                  <span>123 Main Street, New York, NY 10001</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="text-amber-500" size={18} />
                  <a href="tel:+12125551234" className="hover:text-amber-500 transition-colors">(212) 555-1234</a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="text-amber-500" size={18} />
                  <a href="mailto:info@ahmedscuts.com" className="hover:text-amber-500 transition-colors">info@ahmedscuts.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In <span className="text-amber-500">Touch</span></h2>
            <p className="text-gray-400 text-lg">Have a question? We&apos;d love to hear from you.</p>
          </div>
          <form onSubmit={handleContactSubmit} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="(555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
              <textarea
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-[1.02]"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="text-amber-500" size={24} />
                <span className="text-xl font-bold text-amber-500">Ahmed&apos;s Cuts</span>
              </div>
              <p className="text-gray-400">Premium barbershop experience. Where style meets tradition.</p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <a href="#services" className="text-gray-400 hover:text-amber-500 transition-colors">Services</a>
                <a href="#gallery" className="text-gray-400 hover:text-amber-500 transition-colors">Gallery</a>
                <a href="#about" className="text-gray-400 hover:text-amber-500 transition-colors">About Us</a>
                <Link href="/booking" className="text-gray-400 hover:text-amber-500 transition-colors">Book Appointment</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <div className="flex flex-col gap-2 text-gray-400">
                <div className="flex items-center gap-2"><MapPin size={16} className="text-amber-500" /> 123 Main St, New York, NY</div>
                <div className="flex items-center gap-2"><Phone size={16} className="text-amber-500" /> (212) 555-1234</div>
                <div className="flex items-center gap-2"><Mail size={16} className="text-amber-500" /> info@ahmedscuts.com</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Ahmed&apos;s Cuts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
