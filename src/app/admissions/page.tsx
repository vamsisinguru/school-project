'use client';

import { useState } from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Card, Button, Input, Select, Textarea } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2, FileText, Calendar, DollarSign, ChevronDown, Send } from 'lucide-react';

const admissionSteps = [
  { step: 1, title: 'Online Application', desc: 'Fill out the online admission enquiry form or visit the school office to collect the application form.' },
  { step: 2, title: 'Document Submission', desc: 'Submit the completed application form along with all required documents and application fee.' },
  { step: 3, title: 'Interaction Session', desc: 'An informal interaction session with the student and parents to understand the child\'s needs.' },
  { step: 4, title: 'Assessment', desc: 'Age-appropriate assessment or entrance test for certain classes to evaluate academic readiness.' },
  { step: 5, title: 'Admission Confirmation', desc: 'Upon selection, pay the admission fee and complete the enrollment process to confirm the seat.' },
];

const requiredDocuments = [
  'Birth Certificate (Original + Photocopy)',
  'Previous School Transfer Certificate',
  'Report Card / Mark Sheet from previous school',
  'Passport-size photographs (4 copies)',
  'Aadhaar Card of student and parents',
  'Address Proof',
  'Caste Certificate (if applicable)',
  'Medical Fitness Certificate',
];

const feeStructure = [
  { class: 'Primary (1-5)', admission: '₹15,000', tuition: '₹4,000/month', total: '₹63,000/year' },
  { class: 'Middle (6-8)', admission: '₹18,000', tuition: '₹5,000/month', total: '₹78,000/year' },
  { class: 'High (9-10)', admission: '₹22,000', tuition: '₹6,500/month', total: '₹100,000/year' },
  { class: 'Higher Secondary (11-12)', admission: '₹28,000', tuition: '₹8,000/month', total: '₹124,000/year' },
];

const faqs = [
  { q: 'What is the age criteria for admission to Class 1?', a: 'The child should have completed 5 years and 6 months as on June 1st of the academic year for admission to Class 1.' },
  { q: 'Is there an entrance test for admission?', a: 'For Classes 1-8, admission is based on interaction. For Classes 9-12, a written assessment in core subjects is conducted.' },
  { q: 'What is the student-teacher ratio?', a: 'We maintain a healthy student-teacher ratio of 25:1 to ensure personalized attention for every student.' },
  { q: 'Do you provide transportation facilities?', a: 'Yes, we provide safe and reliable bus service with GPS tracking covering all major routes in the city.' },
  { q: 'What is the medium of instruction?', a: 'English is the primary medium of instruction. Hindi and other regional languages are taught as additional subjects.' },
  { q: 'Do you offer scholarships?', a: 'Yes, merit-based scholarships are available for outstanding students. Contact the school office for details.' },
];

export default function AdmissionsPage() {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ studentName: '', parentName: '', email: '', phone: '', applyingClass: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast('Admission enquiry submitted successfully! We will contact you soon.', 'success');
        setForm({ studentName: '', parentName: '', email: '', phone: '', applyingClass: '', message: '' });
      } else {
        toast('Failed to submit enquiry. Please try again.', 'error');
      }
    } catch {
      toast('An error occurred. Please try again.', 'error');
    }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <section className="gradient-hero text-white py-10 sm:py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-5xl">Admissions Open 2024-2025</h1>
          <p className="mt-3 text-sm text-navy-200 max-w-2xl mx-auto sm:mt-4 sm:text-base">Begin your child&apos;s journey towards academic excellence and holistic development.</p>
          <a href="#apply" className="btn-gold mt-8 inline-flex">
            Apply for Admission
          </a>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-center text-[1.375rem] font-bold text-navy-900 sm:text-3xl">Admission Process</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {admissionSteps.map((step) => (
              <Card key={step.step} className="p-6 relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-navy text-white font-bold">
                  {step.step}
                </div>
                <h3 className="mt-3 font-semibold text-navy-900 text-sm">{step.title}</h3>
                <p className="mt-2 text-xs text-navy-500 leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Required Documents</h2>
              <Card className="mt-6 p-6">
                <ul className="space-y-3">
                  {requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-navy-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Important Dates</h2>
              <Card className="mt-6 p-6">
                <div className="space-y-4">
                  {[
                    { date: '1st October 2024', event: 'Application Forms Available' },
                    { date: '15th November 2024', event: 'Last Date for Submission' },
                    { date: '1st-15th December 2024', event: 'Interaction Sessions' },
                    { date: '20th December 2024', event: 'Results Announcement' },
                    { date: '1st-15th January 2025', event: 'Fee Payment & Confirmation' },
                    { date: '1st June 2025', event: 'Academic Year Begins' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 border-b border-navy-50 pb-3 last:border-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                        <Calendar className="h-5 w-5 text-navy-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{item.event}</p>
                        <p className="text-xs text-navy-500">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-center text-[1.375rem] font-bold text-navy-900 sm:text-3xl">Fee Structure</h2>
          <p className="text-center text-navy-500 mt-2 text-sm">* Fees may vary based on optional facilities. Contact school office for detailed breakdown.</p>
          <Card className="mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="gradient-navy text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Class Level</th>
                    <th className="px-6 py-4 text-left font-semibold">Admission Fee</th>
                    <th className="px-6 py-4 text-left font-semibold">Tuition Fee</th>
                    <th className="px-6 py-4 text-left font-semibold">Annual Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {feeStructure.map((row, i) => (
                    <tr key={i} className="hover:bg-navy-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-navy-900">{row.class}</td>
                      <td className="px-6 py-4 text-navy-600">{row.admission}</td>
                      <td className="px-6 py-4 text-navy-600">{row.tuition}</td>
                      <td className="px-6 py-4 font-semibold text-navy-900">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max">
          <h2 className="text-center text-[1.375rem] font-bold text-navy-900 sm:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-8 max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="overflow-hidden">
                <button
                  className="flex w-full items-center justify-between p-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-navy-900 text-sm">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-navy-400 transition-transform flex-shrink-0 ml-2 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-navy-500 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="section-padding">
        <div className="container-max max-w-2xl">
          <h2 className="text-center text-[1.375rem] font-bold text-navy-900 sm:text-3xl">Admission Enquiry Form</h2>
          <p className="text-center text-navy-500 mt-2 text-sm">Fill out the form below and we'll get back to you within 48 hours.</p>
          <Card className="mt-8 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Student Name *" required value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="Enter student's full name" />
                <Input label="Parent Name *" required value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Enter parent's name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Email *" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="parent@email.com" />
                <Input label="Phone *" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <Select label="Applying for Class *" required value={form.applyingClass} onChange={(e) => setForm({ ...form, applyingClass: e.target.value })}>
                <option value="">Select class</option>
                {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
              <Textarea label="Message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any additional information or questions..." />
              <Button type="submit" loading={submitting} className="w-full">
                <Send className="h-4 w-4" />
                Submit Enquiry
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
}
