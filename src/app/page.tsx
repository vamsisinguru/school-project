import Link from 'next/link';
import {
  GraduationCap, BookOpen, Users, Award, Trophy, FlaskConical,
  Library, Bus, UtensilsCrossed, HeartPulse, Shield, Monitor,
  Cpu, Building2, Calendar, ArrowRight, CheckCircle2, Star,
  Microscope, Dumbbell, Home, Phone, MapPin, Mail,
} from 'lucide-react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Card } from '@/components/ui';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

async function getSiteConfig() {
  const configs = await prisma.siteConfig.findMany();
  return Object.fromEntries(configs.map((c) => [c.key, c.value]));
}

async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: { startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: 4,
  });
}

async function getNotices() {
  return prisma.notice.findMany({
    orderBy: { publishDate: 'desc' },
    take: 5,
  });
}

export default async function HomePage() {
  const config = await getSiteConfig();
  const events = await getUpcomingEvents();
  const notices = await getNotices();

  const stats = [
    { label: 'Years of Excellence', value: parseInt(config.yearsOfExcellence || '25'), suffix: '+' },
    { label: 'Happy Students', value: parseInt(config.totalStudents || '5000'), suffix: '+' },
    { label: 'Expert Faculty', value: parseInt(config.totalFaculty || '300'), suffix: '+' },
    { label: 'Academic Programs', value: parseInt(config.academicPrograms || '50'), suffix: '+' },
  ];

  const academics = [
    { title: 'Primary School', grades: 'Classes 1-5', icon: BookOpen, desc: 'Foundation building with interactive learning, creative activities, and personalized attention for young learners.', color: 'bg-blue-50 text-blue-600' },
    { title: 'Middle School', grades: 'Classes 6-8', icon: FlaskConical, desc: 'Concept-driven education with hands-on experiments, digital learning tools, and skill development programs.', color: 'bg-green-50 text-green-600' },
    { title: 'High School', grades: 'Classes 9-10', icon: Award, desc: 'Rigorous academic curriculum with competitive exam preparation, career guidance, and comprehensive assessments.', color: 'bg-purple-50 text-purple-600' },
    { title: 'Higher Secondary', grades: 'Classes 11-12', icon: GraduationCap, desc: 'Specialized streams in Science and Commerce with expert faculty, career counseling, and university preparation.', color: 'bg-gold-50 text-gold-600' },
  ];

  const facilities = [
    { icon: Monitor, title: 'Smart Classrooms', desc: 'Digital boards and interactive learning systems in every classroom.' },
    { icon: FlaskConical, title: 'Science Laboratories', desc: 'Fully equipped physics, chemistry, and biology labs for practical learning.' },
    { icon: Cpu, title: 'Computer Labs', desc: 'Modern computer labs with high-speed internet and latest software.' },
    { icon: Library, title: 'Library', desc: 'Extensive collection of books, journals, and digital resources.' },
    { icon: Trophy, title: 'Sports Ground', desc: 'Large playground for cricket, football, athletics, and more.' },
    { icon: Dumbbell, title: 'Indoor Sports', desc: 'Table tennis, badminton, chess, and other indoor games.' },
    { icon: Bus, title: 'Transportation', desc: 'Safe and reliable bus service covering all major routes.' },
    { icon: UtensilsCrossed, title: 'Cafeteria', desc: 'Hygienic cafeteria serving nutritious and balanced meals.' },
    { icon: HeartPulse, title: 'Medical / First Aid', desc: 'On-campus medical room with qualified nurse and first aid facilities.' },
    { icon: Shield, title: 'Security', desc: '24/7 security with CCTV surveillance and trained personnel.' },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-10 right-20 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="container-max relative px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gold-300 backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-sm">
                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400 sm:h-4 sm:w-4" />
                Ranked Among Top Schools in India
              </div>
              <h1 className="mt-5 text-[2rem] font-bold leading-[1.15] sm:mt-6 sm:text-5xl sm:leading-tight lg:text-6xl text-balance">
                Empowering Young Minds for a <span className="text-gold-400">Brighter Future</span>
              </h1>
              <p className="mt-4 text-[1.0625rem] leading-[1.6] text-navy-200 max-w-xl sm:mt-6 sm:text-lg sm:leading-relaxed">
                Sri Chaitanya School focuses on academic excellence, discipline, innovation, character development, and overall student growth. Join us in shaping tomorrow&apos;s leaders.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <Link href="/about" className="btn-gold">
                  Explore Our School
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  Parent / Student Login
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&h=600&fit=crop"
                  alt="Students learning at Sri Chaitanya School"
                  className="w-full h-[280px] sm:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-4 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900">98%</p>
                    <p className="text-xs text-navy-500">Pass Rate</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 rounded-xl bg-white p-4 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-100">
                    <Award className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy-900">25+</p>
                    <p className="text-xs text-navy-500">Years Legacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-navy-100 bg-white py-12">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-navy-900 sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm font-medium text-navy-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">About Our School</span>
              <h2 className="mt-2 text-[1.375rem] font-bold text-navy-900 sm:text-4xl text-balance">
                Nurturing Excellence in Education Since 1999
              </h2>
              <p className="mt-4 text-navy-600 leading-relaxed">
                Sri Chaitanya School has been a beacon of quality education, committed to shaping well-rounded individuals who excel academically and personally. Our holistic approach combines rigorous academics with character development, sports, and cultural activities.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  { icon: Award, title: 'Academic Excellence', desc: 'Consistent track record of outstanding board results and competitive exam achievements.' },
                  { icon: Users, title: 'Experienced Faculty', desc: '300+ qualified and dedicated teachers committed to student success.' },
                  { icon: Building2, title: 'Modern Learning Environment', desc: 'State-of-the-art infrastructure with smart classrooms and digital learning tools.' },
                  { icon: Trophy, title: 'Sports & Extracurricular', desc: 'Comprehensive sports programs and cultural activities for all-round development.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-50">
                      <item.icon className="h-5 w-5 text-navy-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900">{item.title}</h3>
                      <p className="text-sm text-navy-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/about" className="btn-primary mt-8">
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=400&fit=crop" alt="Classroom" className="rounded-[10px] object-cover w-[100px] h-[125px] max-[374px]:w-[85px] max-[374px]:h-[110px] mx-auto shadow-md sm:rounded-xl sm:w-full sm:h-64" />
              <img src="/images/about-school.jpg" alt="Modern Sri Chaitanya School campus with students" className="rounded-[10px] object-cover w-[100px] h-[125px] max-[374px]:w-[85px] max-[374px]:h-[110px] mx-auto shadow-md sm:rounded-xl sm:w-full sm:h-48 sm:mt-8" />
              <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop" alt="Science Lab" className="rounded-[10px] object-cover w-[100px] h-[125px] max-[374px]:w-[85px] max-[374px]:h-[110px] mx-auto shadow-md sm:rounded-xl sm:w-full sm:h-48" />
              <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=400&h=400&fit=crop" alt="Sports" className="rounded-[10px] object-cover w-[100px] h-[125px] max-[374px]:w-[85px] max-[374px]:h-[110px] mx-auto shadow-md sm:rounded-xl sm:w-full sm:h-64 sm:-mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">Academics</span>
            <h2 className="mt-2 text-[1.375rem] font-bold text-navy-900 sm:text-4xl">Comprehensive Academic Programs</h2>
            <p className="mt-4 text-navy-600">From primary foundation to higher secondary specialization, we provide a complete educational journey.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {academics.map((item, i) => (
              <Card key={i} className="p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-navy-900">{item.title}</h3>
                <p className="text-xs font-medium text-gold-600">{item.grades}</p>
                <p className="mt-3 text-sm text-navy-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/academics" className="btn-secondary">
              View All Academic Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">Facilities</span>
            <h2 className="mt-2 text-[1.375rem] font-bold text-navy-900 sm:text-4xl">World-Class School Facilities</h2>
            <p className="mt-4 text-navy-600">Modern infrastructure designed to support comprehensive learning and development.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {facilities.map((facility, i) => (
              <Card key={i} className="p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50">
                  <facility.icon className="h-6 w-6 text-navy-600" />
                </div>
                <h3 className="mt-3 font-semibold text-navy-900 text-sm">{facility.title}</h3>
                <p className="mt-2 text-xs text-navy-500 leading-relaxed">{facility.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events & Notices Section */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">Upcoming Events</h2>
                <Link href="/events" className="text-sm font-medium text-navy-600 hover:text-navy-900">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {events.length === 0 && <p className="text-sm text-navy-500">No upcoming events at this time.</p>}
                {events.map((event) => (
                  <Card key={event.id} className="p-4 flex gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg gradient-navy text-white">
                      <span className="text-lg font-bold">{new Date(event.startDate).getDate()}</span>
                      <span className="text-xs">{new Date(event.startDate).toLocaleDateString('en-IN', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-navy-900 truncate">{event.title}</h3>
                      <p className="text-sm text-navy-500 line-clamp-2">{event.description}</p>
                      {event.venue && <p className="text-xs text-navy-400 mt-1">📍 {event.venue}</p>}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">School Notices</h2>
                <Link href="/events" className="text-sm font-medium text-navy-600 hover:text-navy-900">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {notices.map((notice) => (
                  <Card key={notice.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-navy-900 text-sm">{notice.title}</h3>
                      <span className={`badge flex-shrink-0 ${notice.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-navy-100 text-navy-600'}`}>
                        {notice.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-navy-500 line-clamp-2">{notice.content}</p>
                    <p className="mt-2 text-xs text-navy-400">{new Date(notice.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="section-padding">
        <div className="container-max">
          <div className="relative overflow-hidden rounded-2xl gradient-navy px-5 py-8 text-center text-white sm:px-12 sm:py-16">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-[1.375rem] font-bold sm:text-4xl text-balance">Ready to Join Sri Chaitanya School?</h2>
              <p className="mt-4 text-navy-200 max-w-2xl mx-auto">
                Admissions open for the academic year 2024-2025. Give your child the gift of quality education and holistic development.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
                <Link href="/admissions" className="btn-gold">
                  Apply for Admission
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
