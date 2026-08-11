import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, EmptyState } from '@/components/ui';
import { LayoutDashboard, CheckCircle2, FileText, Clock, GraduationCap, Bell, AlertCircle, Paperclip } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = { robots: { index: false, follow: false } };

const navItems = [
  { href: '/portal/parent', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/parent/attendance', label: 'Attendance', icon: 'check-circle' },
  { href: '/portal/parent/report-card', label: 'Report Card', icon: 'file-text' },
  { href: '/portal/parent/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/parent/exams', label: 'Exams', icon: 'graduation-cap' },
  { href: '/portal/parent/notices', label: 'Notices', icon: 'bell' },
];

export default async function ParentNoticesPage() {
  const session = await getSession();
  if (!session || session.role !== 'PARENT') redirect('/login');

  const notices = await prisma.notice.findMany({
    orderBy: { publishDate: 'desc' },
  });

  const categoryColors: Record<string, any> = {
    Holiday: 'danger',
    Examination: 'info',
    PTM: 'warning',
    Fee: 'danger',
    Event: 'success',
    Circular: 'default',
  };

  return (
    <DashboardShell navItems={navItems} userName={session.name} userRole="PARENT" basePath="/portal/parent">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">School Notices</h1>
        <p className="text-sm text-navy-500 mt-1">Stay updated with school announcements and circulars.</p>
      </div>

      {notices.length === 0 ? (
        <Card>
          <EmptyState icon={Bell} title="No Notices" description="There are no notices at this time." />
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map(notice => (
            <Card key={notice.id} className="p-5">
              <div className="flex items-start gap-3">
                {notice.priority === 'High' ? (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-50">
                    <Bell className="h-5 w-5 text-navy-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-navy-900">{notice.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={categoryColors[notice.category] || 'default'}>{notice.category}</Badge>
                      {notice.priority === 'High' && <Badge variant="danger">High Priority</Badge>}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-navy-600 leading-relaxed">{notice.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-navy-400">
                    <span>{formatDate(notice.publishDate)}</span>
                    {notice.attachmentUrl && (
                      <a href={notice.attachmentUrl} className="flex items-center gap-1 text-navy-600 hover:text-navy-900">
                        <Paperclip className="h-3 w-3" /> Attachment
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
