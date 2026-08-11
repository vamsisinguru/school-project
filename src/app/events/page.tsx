import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Card } from '@/components/ui';
import { prisma } from '@/lib/prisma';
import { Calendar, MapPin, Bell, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events & Announcements',
  description: 'Stay updated with upcoming events, announcements, holidays, and important dates at Sri Chaitanya School.',
};

export const revalidate = 3600;

async function getEvents() {
  const now = new Date();
  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({ where: { startDate: { gte: now } }, orderBy: { startDate: 'asc' } }),
    prisma.event.findMany({ where: { startDate: { lt: now } }, orderBy: { startDate: 'desc' }, take: 6 }),
  ]);
  return { upcoming, past };
}

async function getNotices() {
  return prisma.notice.findMany({ orderBy: { publishDate: 'desc' } });
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents();
  const notices = await getNotices();

  const categoryColors: Record<string, string> = {
    Cultural: 'bg-purple-100 text-purple-700',
    Sports: 'bg-green-100 text-green-700',
    Academic: 'bg-blue-100 text-blue-700',
    PTM: 'bg-gold-100 text-gold-700',
    Holiday: 'bg-red-100 text-red-700',
  };

  return (
    <>
      <Navbar />
      <section className="gradient-hero text-white py-10 sm:py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight sm:text-5xl">Events & Announcements</h1>
          <p className="mt-3 text-sm text-navy-200 max-w-2xl mx-auto sm:mt-4 sm:text-base">Stay updated with everything happening at Sri Chaitanya School.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-navy-900 mb-6 sm:text-2xl">Upcoming Events</h2>
              {upcoming.length === 0 ? (
                <Card className="p-8 text-center">
                  <Calendar className="h-10 w-10 text-navy-300 mx-auto mb-3" />
                  <p className="text-navy-500">No upcoming events at this time.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((event) => (
                    <Card key={event.id} className="p-5 flex gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg gradient-navy text-white">
                        <span className="text-xl font-bold">{new Date(event.startDate).getDate()}</span>
                        <span className="text-xs">{new Date(event.startDate).toLocaleDateString('en-IN', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-navy-900">{event.title}</h3>
                          <span className={`badge flex-shrink-0 ${categoryColors[event.category] || 'bg-navy-100 text-navy-700'}`}>{event.category}</span>
                        </div>
                        <p className="mt-1 text-sm text-navy-500">{event.description}</p>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-navy-400">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          {event.venue && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</span>}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {past.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-navy-900 mb-6 mt-12 sm:text-2xl">Past Events</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {past.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        {event.imageUrl && <img src={event.imageUrl} alt={`${event.title} at Sri Chaitanya School`} loading="lazy" className="w-full h-32 object-cover" />}
                        <div className="p-4">
                          <span className={`badge ${categoryColors[event.category] || 'bg-navy-100 text-navy-700'}`}>{event.category}</span>
                          <h3 className="mt-2 font-semibold text-navy-900 text-sm">{event.title}</h3>
                          <p className="mt-1 text-xs text-navy-400">{new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-6 sm:text-2xl">School Notices</h2>
              <div className="space-y-3">
                {notices.map((notice) => (
                  <Card key={notice.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {notice.priority === 'High' ? (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Bell className="h-4 w-4 text-navy-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h3 className="font-semibold text-navy-900 text-sm">{notice.title}</h3>
                          <p className="mt-1 text-xs text-navy-500 line-clamp-2">{notice.content}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`badge ${notice.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-navy-100 text-navy-600'}`}>{notice.category}</span>
                            <span className="text-xs text-navy-400">{new Date(notice.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
