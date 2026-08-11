'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Users, User, Briefcase, Lock, Mail, ArrowRight, Info } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

type Role = 'PARENT' | 'STUDENT' | 'STAFF';

const roles: { key: Role; label: string; icon: any; desc: string; color: string }[] = [
  { key: 'PARENT', label: 'Parent', icon: Users, desc: 'Access your child\'s academic information', color: 'navy' },
  { key: 'STUDENT', label: 'Student', icon: User, desc: 'View your academic portal', color: 'blue' },
  { key: 'STAFF', label: 'Staff', icon: Briefcase, desc: 'Manage academic information', color: 'gold' },
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>('PARENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await res.json();

      if (res.ok) {
        toast(`Welcome back, ${data.user.name}!`, 'success');
        if (data.user.role === 'PARENT') router.push('/portal/parent');
        else if (data.user.role === 'STUDENT') router.push('/portal/student');
        else if (data.user.role === 'STAFF') router.push('/portal/staff');
        else if (data.user.role === 'ADMIN') router.push('/portal/admin');
      } else {
        toast(data.error || 'Login failed', 'error');
      }
    } catch {
      toast('An error occurred during login', 'error');
    }
    setLoading(false);
  };

  const fillDemo = (role: Role) => {
    if (role === 'PARENT') { setEmail('parent@example.com'); setPassword('password123'); }
    else if (role === 'STUDENT') { setEmail('student@example.com'); setPassword('password123'); }
    else if (role === 'STAFF') { setEmail('teacher@example.com'); setPassword('password123'); }
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - branding */}
      <div className="relative gradient-hero text-white p-8 lg:w-2/5 flex flex-col justify-center lg:p-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="block text-lg font-bold">Sri Chaitanya</span>
              <span className="block text-xs text-gold-400">Learn. Grow. Excel.</span>
            </div>
          </Link>

          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-4xl">Welcome to Sri Chaitanya School Portal</h1>
          <p className="mt-4 text-navy-200 leading-relaxed">
            Access your personalized dashboard to view academic information, attendance, report cards, timetable, and more.
          </p>

          <div className="mt-12 space-y-4">
            {roles.map((role) => (
              <div key={role.key} className="flex items-center gap-3 text-navy-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <role.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{role.label} Portal</p>
                  <p className="text-xs text-navy-300">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-navy-50">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-navy-900">Sign In to Your Account</h2>
          <p className="mt-1 text-sm text-navy-500">Select your account type and enter your credentials.</p>

          {/* Role Selection */}
          <div className="mt-6">
            <label className="label-field">Select your account</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.key}
                  onClick={() => setSelectedRole(role.key)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                    selectedRole === role.key
                      ? 'border-navy-600 bg-navy-50 text-navy-900'
                      : 'border-navy-100 bg-white text-navy-500 hover:border-navy-200'
                  )}
                >
                  <role.icon className={cn('h-5 w-5', selectedRole === role.key ? 'text-navy-700' : 'text-navy-400')} />
                  <span className="text-xs font-semibold">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              label="Email / Username"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-navy-600">
                <input type="checkbox" className="rounded border-navy-300 text-navy-600 focus:ring-navy-200" />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-navy-600 hover:text-navy-900">
                Forgot password?
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Login to Portal
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 rounded-lg border border-gold-200 bg-gold-50 p-4">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="flex w-full items-center justify-between text-sm font-medium text-gold-800"
            >
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Demo Accounts (Click to use)
              </span>
            </button>
            {showDemo && (
              <div className="mt-3 space-y-2 animate-fade-in">
                {[
                  { role: 'PARENT' as Role, label: 'Parent', email: 'parent@example.com', name: 'Mr. Krishna Sharma' },
                  { role: 'STUDENT' as Role, label: 'Student', email: 'student@example.com', name: 'Aarav Sharma' },
                  { role: 'STAFF' as Role, label: 'Staff', email: 'teacher@example.com', name: 'Dr. Rajesh Kumar' },
                ].map((demo) => (
                  <button
                    key={demo.role}
                    onClick={() => fillDemo(demo.role)}
                    className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-xs hover:bg-gold-100 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-semibold text-navy-900">{demo.label}</p>
                      <p className="text-navy-500">{demo.email}</p>
                    </div>
                    <span className="text-navy-400">password123</span>
                  </button>
                ))}
                <p className="text-xs text-gold-700 mt-2">Admin: admin@example.com / password123</p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-navy-400">
            By logging in, you agree to the school&apos;s terms of use and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
