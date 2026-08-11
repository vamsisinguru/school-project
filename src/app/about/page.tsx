import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Card } from '@/components/ui';
import { Target, Eye, Award, Users, Building2, Trophy, BookOpen, Heart, Lightbulb, GraduationCap } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sri Chaitanya School - our vision, mission, academic excellence, and commitment to student development for over 25 years.',
};

async function getSiteConfig() {
  const configs = await prisma.siteConfig.findMany();
  return Object.fromEntries(configs.map((c) => [c.key, c.value]));
}

export default async function AboutPage() {
  const config = await getSiteConfig();
  const stats = [
    { label: 'Years of Excellence', value: parseInt(config.yearsOfExcellence || '25'), suffix: '+' },
    { label: 'Happy Students', value: parseInt(config.totalStudents || '5000'), suffix: '+' },
    { label: 'Expert Faculty', value: parseInt(config.totalFaculty || '300'), suffix: '+' },
    { label: 'Academic Programs', value: parseInt(config.academicPrograms || '50'), suffix: '+' },
  ];

  return (
    <>
      <Navbar />
      <section className="gradient-hero text-white py-10 sm:py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-5xl">About Sri Chaitanya School</h1>
          <p className="mt-3 text-sm text-navy-200 max-w-2xl mx-auto sm:mt-4 sm:text-base">Learn. Grow. Excel. - Building the foundation for a brighter future.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">Our Story</span>
              <h2 className="mt-2 text-[1.375rem] font-bold text-navy-900 sm:text-3xl">A Legacy of Educational Excellence</h2>
              <p className="mt-4 text-navy-600 leading-relaxed">
                For over 25 years, Sri Chaitanya School has been at the forefront of quality education in India. We believe that every child has unique potential waiting to be unlocked. Our mission is to provide an environment where students can discover their strengths, develop their skills, and grow into confident, responsible, and successful individuals.
              </p>
              <p className="mt-4 text-navy-600 leading-relaxed">
                With a team of 300+ experienced faculty members, state-of-the-art facilities, and a curriculum that balances academics with extracurricular activities, we ensure that every student receives a well-rounded education that prepares them for the challenges of tomorrow.
              </p>
            </div>
            <img src="/images/about-school.jpg" alt="Modern Sri Chaitanya School campus with students" className="rounded-xl shadow-lg w-full h-[400px] object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-100">
                <Eye className="h-6 w-6 text-navy-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-navy-900">Our Vision</h3>
              <p className="mt-2 text-navy-600 leading-relaxed">
                To be a globally recognized institution that nurtures young minds into responsible, innovative, and compassionate leaders who contribute positively to society.
              </p>
            </Card>
            <Card className="p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold-100">
                <Target className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-navy-900">Our Mission</h3>
              <p className="mt-2 text-navy-600 leading-relaxed">
                To provide quality education that combines academic excellence with character development, fostering creativity, critical thinking, and a lifelong love for learning.
              </p>
            </Card>
          </div>
        </div>
      </section>

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

      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-center text-[1.375rem] font-bold text-navy-900 sm:text-3xl">What Makes Us Different</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Award, title: 'Academic Excellence', desc: 'Consistent 98%+ pass rate in board examinations with numerous state-level rank holders.' },
              { icon: Users, title: 'Experienced Faculty', desc: '300+ qualified teachers with an average of 10+ years of teaching experience.' },
              { icon: Building2, title: 'Modern Infrastructure', desc: 'Smart classrooms, well-equipped labs, digital library, and sports facilities.' },
              { icon: Trophy, title: 'Sports & Activities', desc: 'Comprehensive sports programs, cultural events, and extracurricular activities.' },
              { icon: Lightbulb, title: 'Innovation Focus', desc: 'STEM education, robotics, coding, and project-based learning integrated into curriculum.' },
              { icon: Heart, title: 'Character Development', desc: 'Value-based education that builds integrity, empathy, and social responsibility.' },
            ].map((item, i) => (
              <Card key={i} className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50">
                  <item.icon className="h-6 w-6 text-navy-600" />
                </div>
                <h3 className="mt-4 font-semibold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm text-navy-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
