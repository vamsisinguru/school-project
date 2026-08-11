'use client';

import { useState } from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast('Message sent successfully! We will get back to you soon.', 'success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast('Failed to send message. Please try again.', 'error');
      }
    } catch {
      toast('An error occurred. Please try again.', 'error');
    }
    setSubmitting(false);
  };

  const contactInfo = [
    { icon: MapPin, title: 'Address', value: '123 Education City Road, Bangalore, Karnataka 560001' },
    { icon: Phone, title: 'Phone', value: '+91 80 2345 6789' },
    { icon: Mail, title: 'Email', value: 'info@srichaitanya.edu.in' },
    { icon: Clock, title: 'Working Hours', value: 'Mon - Sat: 8:00 AM - 4:00 PM' },
  ];

  return (
    <>
      <Navbar />
      <section className="gradient-hero text-white py-10 sm:py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-5xl">Contact Us</h1>
          <p className="mt-3 text-sm text-navy-200 max-w-2xl mx-auto sm:mt-4 sm:text-base">We're here to help. Reach out to us with any questions or concerns.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              {contactInfo.map((info, i) => (
                <Card key={i} className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                    <info.icon className="h-5 w-5 text-navy-600" />
                  </div>
                  <h3 className="mt-3 font-semibold text-navy-900 text-sm">{info.title}</h3>
                  <p className="mt-1 text-sm text-navy-500">{info.value}</p>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-xl font-bold text-navy-900">Send us a message</h2>
                <p className="text-sm text-navy-500 mt-1">Fill out the form below and we'll respond within 48 hours.</p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Your Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" />
                    <Input label="Email *" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                    <Input label="Subject *" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" />
                  </div>
                  <Textarea label="Message *" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Type your message here..." />
                  <Button type="submit" loading={submitting} className="w-full">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>

          <Card className="mt-8 overflow-hidden">
            <div className="relative h-80 bg-navy-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              />
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
}
