import Link from 'next/link';
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="gradient-navy text-white">
      <div className="container-max px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="block text-lg font-bold">Sri Chaitanya</span>
                <span className="block text-xs text-gold-400">Learn. Grow. Excel.</span>
              </div>
            </div>
            <p className="text-sm text-navy-200 leading-relaxed">
              Empowering young minds with academic excellence, discipline, innovation, and character development for over 25 years.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gold-400">Quick Links</h3>
            <ul className="space-y-2 text-sm text-navy-200">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/academics" className="hover:text-white transition-colors">Academics</Link></li>
              <li><Link href="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
              <li><Link href="/facilities" className="hover:text-white transition-colors">Facilities</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gold-400">Portal Access</h3>
            <ul className="space-y-2 text-sm text-navy-200">
              <li><Link href="/login" className="hover:text-white transition-colors">Parent Login</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Student Login</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Staff Login</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gold-400">Contact Info</h3>
            <ul className="space-y-3 text-sm text-navy-200">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold-400" />
                <span>123 Education City Road, Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>+91 80 2345 6789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>info@srichaitanya.edu.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0 text-gold-400" />
                <span>Mon - Sat: 8:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-300">© 2024 Sri Chaitanya School. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-navy-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
