import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Card } from '@/components/ui';
import { BookOpen, FlaskConical, Award, GraduationCap, Monitor, FileCheck, Trophy, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Academics',
  description: 'Explore the comprehensive academic programs at Sri Chaitanya School - from primary to higher secondary education.',
};

export default function AcademicsPage() {
  const programs = [
    {
      title: 'Primary School',
      grades: 'Classes 1-5',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'General Knowledge', 'Art & Craft'],
      desc: 'Our primary program focuses on building strong foundations through interactive and experiential learning. We emphasize reading, writing, numerical literacy, and curiosity-driven exploration.',
      methodology: 'Activity-based learning, storytelling, hands-on experiments, and creative projects that make learning enjoyable and memorable.',
    },
    {
      title: 'Middle School',
      grades: 'Classes 6-8',
      icon: FlaskConical,
      color: 'bg-green-50 text-green-600',
      subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Hindi', 'Computer Science'],
      desc: 'The middle school program transitions students to concept-based learning with increased depth in each subject. Students begin to explore scientific concepts through laboratory experiments.',
      methodology: 'Inquiry-based learning, laboratory experiments, group discussions, project work, and digital learning tools.',
    },
    {
      title: 'High School',
      grades: 'Classes 9-10',
      icon: Award,
      color: 'bg-purple-50 text-purple-600',
      subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Hindi', 'Computer Science'],
      desc: 'Our high school program prepares students for board examinations and competitive exams. The curriculum is rigorous yet balanced, ensuring students develop critical thinking and problem-solving skills.',
      methodology: 'Exam-focused preparation, competitive exam coaching, regular assessments, personalized mentoring, and career guidance.',
    },
    {
      title: 'Higher Secondary',
      grades: 'Classes 11-12',
      icon: GraduationCap,
      color: 'bg-gold-50 text-gold-600',
      subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Commerce', 'Economics'],
      desc: 'Students can choose between Science and Commerce streams. Our higher secondary program is designed to prepare students for university education and competitive entrance exams.',
      methodology: 'Stream-specialized learning, entrance exam coaching (JEE/NEET), research projects, and university preparation.',
    },
  ];

  const features = [
    { icon: Monitor, title: 'Digital Learning', desc: 'Smart classrooms with interactive digital boards and online learning resources.' },
    { icon: FileCheck, title: 'Regular Assessments', desc: 'Continuous evaluation through tests, quizzes, projects, and examinations.' },
    { icon: Trophy, title: 'Competitive Exam Prep', desc: 'Special coaching for Olympiads, JEE, NEET, and other competitive exams.' },
    { icon: Cpu, title: 'Skill Development', desc: 'Coding, robotics, communication skills, and personality development programs.' },
  ];

  return (
    <>
      <Navbar />
      <section className="gradient-hero text-white py-10 sm:py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-5xl">Academic Programs</h1>
          <p className="mt-3 text-sm text-navy-200 max-w-2xl mx-auto sm:mt-4 sm:text-base">Comprehensive education from primary to higher secondary, designed to nurture every student&apos;s potential.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="space-y-12">
            {programs.map((program, i) => (
              <div key={i} className={`grid gap-8 lg:grid-cols-2 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <Card className={`p-8 ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${program.color}`}>
                    <program.icon className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-navy-900 sm:text-2xl">{program.title}</h2>
                  <p className="text-sm font-medium text-gold-600">{program.grades}</p>
                  <p className="mt-4 text-navy-600 leading-relaxed">{program.desc}</p>
                  <div className="mt-6">
                    <h3 className="font-semibold text-navy-900 text-sm">Teaching Methodology</h3>
                    <p className="mt-1 text-sm text-navy-500">{program.methodology}</p>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-semibold text-navy-900 text-sm">Subjects Offered</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {program.subjects.map((subj) => (
                        <span key={subj} className="badge bg-navy-50 text-navy-700">{subj}</span>
                      ))}
                    </div>
                  </div>
                </Card>
                <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <img
                    src={i === 0 ? '/images/academics/primary-school.jpg' :
                         i === 1 ? 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop' :
                         i === 2 ? '/images/academics/high-school.jpg' :
                         'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&h=600&fit=crop'}
                    alt={i === 0 ? 'Primary school students learning in a Sri Chaitanya School classroom' :
                         i === 2 ? 'High school students studying in a Sri Chaitanya School classroom' :
                         program.title}
                    className="rounded-xl shadow-lg w-full h-[300px] sm:h-[350px] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max">
          <h2 className="text-center text-3xl font-bold text-navy-900">Our Approach to Learning</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50">
                  <feature.icon className="h-6 w-6 text-navy-600" />
                </div>
                <h3 className="mt-3 font-semibold text-navy-900 text-sm">{feature.title}</h3>
                <p className="mt-2 text-xs text-navy-500 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
