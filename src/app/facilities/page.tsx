import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Card } from '@/components/ui';
import { Monitor, FlaskConical, Cpu, Library, Trophy, Dumbbell, Bus, UtensilsCrossed, HeartPulse, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Facilities',
  description: 'Explore the world-class facilities at Sri Chaitanya School - smart classrooms, labs, library, sports, transportation, and more.',
};

export default function FacilitiesPage() {
  const facilities = [
    { icon: Monitor, title: 'Smart Classrooms', desc: 'Every classroom is equipped with interactive digital boards, projectors, and audio systems. Our smart classrooms enable teachers to use multimedia content, interactive lessons, and real-time student engagement tools.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop' },
    { icon: FlaskConical, title: 'Science Laboratories', desc: 'Separate, well-equipped laboratories for Physics, Chemistry, and Biology. Each lab has modern equipment, safety measures, and materials for hands-on experiments aligned with the curriculum.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop' },
    { icon: Cpu, title: 'Computer Labs', desc: 'Modern computer labs with high-speed internet, latest hardware, and educational software. Students learn coding, digital literacy, and technology skills from an early age.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop' },
    { icon: Library, title: 'Library', desc: 'A vast collection of over 15,000 books, journals, magazines, and digital resources. The library provides a quiet study environment and access to online research databases.', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop' },
    { icon: Trophy, title: 'Sports Ground', desc: 'Large outdoor playground for cricket, football, athletics, basketball, and volleyball. Professional coaches train students in various sports disciplines.', image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&h=400&fit=crop' },
    { icon: Dumbbell, title: 'Indoor Sports', desc: 'Dedicated indoor sports area for table tennis, badminton, chess, carrom, and yoga. Regular tournaments and competitions are organized throughout the year.', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop' },
    { icon: Bus, title: 'Transportation', desc: 'Safe, reliable, and comfortable transportation services to ensure students travel securely to and from school.', image: 'https://images.pexels.com/photos/35105982/pexels-photo-35105982.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
    { icon: UtensilsCrossed, title: 'Cafeteria', desc: 'Hygienic cafeteria serving nutritious and balanced meals. The menu is designed by nutritionists to ensure students receive healthy and tasty food options.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop' },
    { icon: HeartPulse, title: 'Medical / First Aid', desc: 'On-campus first-aid and medical support to ensure student health and safety during school hours.', image: 'https://images.pexels.com/photos/7447002/pexels-photo-7447002.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
    { icon: Shield, title: 'Security', desc: 'A secure school environment supported by trained security personnel and modern safety and monitoring systems.', image: 'https://images.pexels.com/photos/18166929/pexels-photo-18166929.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  ];

  return (
    <>
      <Navbar />
      <section className="gradient-hero text-white py-10 sm:py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-5xl">School Facilities</h1>
          <p className="mt-3 text-sm text-navy-200 max-w-2xl mx-auto sm:mt-4 sm:text-base">World-class infrastructure designed to support comprehensive learning and all-round development.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid gap-8 md:grid-cols-2">
            {facilities.map((facility, i) => (
              <Card key={i} className="overflow-hidden group">
                <div className="relative h-52 overflow-hidden rounded-t-xl">
                  <img
                    src={facility.image}
                    alt={`${facility.title} at Sri Chaitanya School`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm shadow-md">
                    <facility.icon className="h-5 w-5 text-navy-700" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-navy-900">{facility.title}</h3>
                  <p className="mt-2 text-sm text-navy-500 leading-relaxed">{facility.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
