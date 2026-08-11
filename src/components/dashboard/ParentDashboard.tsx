'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { AttendanceChart, PerformanceChart } from '@/components/dashboard/Charts';
import { ChildSelector } from '@/components/dashboard/ChildSelector';
import {
  LayoutDashboard, Calendar, FileText, Clock, GraduationCap,
  Bell, TrendingUp, Users, Award, BookOpen, CheckCircle2,
  XCircle, Clock as ClockIcon,
} from 'lucide-react';
import { calculateGrade, formatDate, getAvatarUrl, cn } from '@/lib/utils';

interface Child {
  id: string;
  name: string;
  rollNumber: string;
  admissionNo: string;
  className: string;
  sectionName: string;
  academicYear: string;
  gender?: string;
  bloodGroup?: string;
  dateOfBirth?: Date;
}

interface DashboardData {
  attendance: any[];
  marks: any[];
  upcomingExams: any[];
  notices: any[];
  events: any[];
}

interface ParentDashboardProps {
  userName: string;
  studentChildren: Child[];
  selectedChild: Child | null;
  dashboardData: DashboardData | null;
}

const navItems = [
  { href: '/portal/parent', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/parent/attendance', label: 'Attendance', icon: 'check-circle' },
  { href: '/portal/parent/report-card', label: 'Report Card', icon: 'file-text' },
  { href: '/portal/parent/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/parent/exams', label: 'Exams', icon: 'graduation-cap' },
  { href: '/portal/parent/notices', label: 'Notices', icon: 'bell' },
];

export function ParentDashboard({ userName, studentChildren, selectedChild, dashboardData }: ParentDashboardProps) {
  const router = useRouter();
  const [selectedChildId, setSelectedChildId] = useState(selectedChild?.id || '');
  const [data, setData] = useState(dashboardData);
  const [currentChild, setCurrentChild] = useState(selectedChild);
  const [loading, setLoading] = useState(false);

  const handleChildSwitch = useCallback(async (childId: string) => {
    setSelectedChildId(childId);
    setLoading(true);
    const child = studentChildren.find(c => c.id === childId);
    setCurrentChild(child || null);

    try {
      const res = await fetch(`/api/parent/child-data?studentId=${childId}`);
      if (res.ok) {
        const newData = await res.json();
        setData(newData);
      }
    } catch {
      // handle error
    }
    setLoading(false);
  }, [studentChildren]);

  if (studentChildren.length === 0) {
    return (
      <DashboardShell navItems={navItems} userName={userName} userRole="PARENT" basePath="/portal/parent">
        <EmptyState icon={Users} title="No Children Linked" description="No students are linked to your parent account. Please contact the school office to link a student." />
      </DashboardShell>
    );
  }

  const attendance = data?.attendance || [];
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const absentDays = attendance.filter(a => a.status === 'ABSENT').length;
  const lateDays = attendance.filter(a => a.status === 'LATE').length;
  const attendancePct = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0;

  const marks = data?.marks || [];
  const totalMarks = marks.reduce((sum, m) => sum + m.internalMarks + m.examMarks, 0);
  const maxTotal = marks.reduce((sum, m) => sum + m.examSubject.maxMarks, 0);
  const overallPct = maxTotal > 0 ? Math.round((totalMarks / maxTotal) * 100) : 0;
  const overallGrade = calculateGrade(overallPct);

  const upcomingExams = data?.upcomingExams || [];
  const notices = data?.notices || [];
  const events = data?.events || [];

  const quickAccess = [
    { label: 'Attendance', icon: CheckCircle2, href: '/portal/parent/attendance', color: 'bg-green-50 text-green-600' },
    { label: 'Report Card', icon: FileText, href: '/portal/parent/report-card', color: 'bg-blue-50 text-blue-600' },
    { label: 'Timetable', icon: Clock, href: '/portal/parent/timetable', color: 'bg-purple-50 text-purple-600' },
    { label: 'Exams', icon: GraduationCap, href: '/portal/parent/exams', color: 'bg-gold-50 text-gold-600' },
    { label: 'Notices', icon: Bell, href: '/portal/parent/notices', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      userName={userName}
      userRole="PARENT"
      basePath="/portal/parent"
      notifications={notices.length}
      extraHeader={
        studentChildren.length > 1 ? (
          <ChildSelector
            studentChildren={studentChildren}
            selectedId={selectedChildId}
            onSelect={handleChildSwitch}
          />
        ) : undefined
      }
    >
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Welcome back, {userName} 👋</h1>
        <p className="text-sm text-navy-500 mt-1">Here&apos;s an overview of your child&apos;s academic progress.</p>
      </div>

      {loading && (
        <div className="mb-4 rounded-lg bg-navy-50 px-4 py-2 text-sm text-navy-500">Loading data...</div>
      )}

      {/* Student Profile Card */}
      {currentChild && (
        <Card className="mb-6 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img src={getAvatarUrl(currentChild.name)} alt={currentChild.name} className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-navy-900">{currentChild.name}</h2>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-navy-500">
                <span>Student ID: <strong className="text-navy-700">{currentChild.admissionNo}</strong></span>
                <span>Class: <strong className="text-navy-700">{currentChild.className} - {currentChild.sectionName}</strong></span>
                <span>Roll No: <strong className="text-navy-700">{currentChild.rollNumber}</strong></span>
                <span>Year: <strong className="text-navy-700">{currentChild.academicYear}</strong></span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Attendance</p>
              <p className="text-2xl font-bold text-navy-900 mt-1">{attendancePct}%</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <ProgressBar value={attendancePct} color={attendancePct >= 75 ? 'green' : 'red'} className="mt-3" />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Overall Grade</p>
              <p className="text-2xl font-bold text-navy-900 mt-1">{overallGrade}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
              <Award className="h-5 w-5 text-gold-600" />
            </div>
          </div>
          <p className="text-xs text-navy-400 mt-3">{overallPct}% overall score</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Next Exam</p>
              <p className="text-lg font-bold text-navy-900 mt-1">
                {upcomingExams.length > 0 ? upcomingExams[0].name : 'No exams'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          {upcomingExams.length > 0 && (
            <p className="text-xs text-navy-400 mt-3">{formatDate(upcomingExams[0].startDate)}</p>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-navy-500">Upcoming Event</p>
              <p className="text-lg font-bold text-navy-900 mt-1">
                {events.length > 0 ? events[0].title : 'No events'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          {events.length > 0 && (
            <p className="text-xs text-navy-400 mt-3">{formatDate(events[0].startDate)}</p>
          )}
        </Card>
      </div>

      {/* Quick Access */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-navy-700 mb-3">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickAccess.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all"
            >
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-navy-700">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy-900">Academic Performance</h3>
            <TrendingUp className="h-5 w-5 text-navy-400" />
          </div>
          <PerformanceChart marks={marks} />
        </Card>

        {/* Recent Notices */}
        <Card className="p-6">
          <h3 className="font-semibold text-navy-900 mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {notices.slice(0, 4).map((notice) => (
              <div key={notice.id} className="border-b border-navy-50 pb-3 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-navy-900">{notice.title}</p>
                  {notice.priority === 'High' && <Badge variant="danger">High</Badge>}
                </div>
                <p className="text-xs text-navy-400 mt-1">{formatDate(notice.publishDate)}</p>
              </div>
            ))}
            {notices.length === 0 && <p className="text-sm text-navy-400">No notices available.</p>}
          </div>
        </Card>
      </div>

      {/* Attendance Summary */}
      <Card className="mt-6 p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Attendance Summary</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{presentDays}</p>
            <p className="text-xs text-navy-500">Present</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{absentDays}</p>
            <p className="text-xs text-navy-500">Absent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{lateDays}</p>
            <p className="text-xs text-navy-500">Late</p>
          </div>
        </div>
        <AttendanceChart attendance={attendance} />
      </Card>
    </DashboardShell>
  );
}
