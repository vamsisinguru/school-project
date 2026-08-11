'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/academics', label: 'Academics' },
  { href: '/facilities', label: 'Facilities' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={cn('sticky top-0 z-50 transition-all', scrolled ? 'glass shadow-sm border-b border-navy-100' : 'bg-white')}>
        <nav className="container-max flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-lg font-bold leading-tight text-navy-900">Sri Chaitanya</span>
              <span className="block text-xs font-medium text-gold-600">Learn. Grow. Excel.</span>
            </div>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(pathname === link.href ? 'nav-link-active' : 'nav-link')}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" className="btn-primary !py-2 !px-4">
              <LogIn className="h-4 w-4" />
              Portal Login
            </Link>
          </div>

          <button
            className="rounded-lg p-2 text-navy-700 hover:bg-navy-50 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="lg:hidden border-t border-navy-100 bg-white animate-fade-in">
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                    pathname === link.href ? 'bg-navy-50 text-navy-900' : 'text-navy-600 hover:bg-navy-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="btn-primary mt-2 w-full">
                <LogIn className="h-4 w-4" />
                Portal Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
