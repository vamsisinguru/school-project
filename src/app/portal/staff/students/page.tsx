'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Input, Select, Badge, EmptyState, Skeleton } from '@/components/ui';
import { LayoutDashboard, Users, CheckSquare, FileEdit, Clock, Bell, Calendar, Search } from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils';

const navItems = [
  { href: '/portal/staff', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/staff/students', label: 'Students', icon: 'users' },
  { href: '/portal/staff/attendance', label: 'Attendance', icon: 'check-square' },
  { href: '/portal/staff/marks', label: 'Marks', icon: 'file-edit' },
  { href: '/portal/staff/timetable', label: 'Timetable', icon: 'clock' },
  { href: '/portal/staff/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/staff/events', label: 'Events', icon: 'calendar' },
];

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  admissionNo: string;
  className: string;
  sectionName: string;
  gender?: string;
}

export default function StaffStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/staff/students');
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students);
          setClasses(data.classes);
          setSections(data.sections);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = students.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.admissionNo.includes(search)) return false;
    if (classFilter && s.className !== classFilter) return false;
    if (sectionFilter && s.sectionName !== sectionFilter) return false;
    return true;
  });

  const availableSections = sections.filter(s => !classFilter || s.className === classFilter);

  return (
    <DashboardShell navItems={navItems} userName="" userRole="STAFF" basePath="/portal/staff">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Student Management</h1>
        <p className="text-sm text-navy-500 mt-1">View, search, and filter students.</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input
              className="input-field pl-10"
              placeholder="Search by name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={classFilter} onChange={e => { setClassFilter(e.target.value); setSectionFilter(''); }}>
            <option value="">All Classes</option>
            {[...new Set(classes.map(c => c.name))].map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
            <option value="">All Sections</option>
            {availableSections.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </Select>
        </div>
      </Card>

      {/* Results */}
      <div className="mb-4 text-sm text-navy-500">{filtered.length} students found</div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={Users} title="No Students Found" description="Try adjusting your filters." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="gradient-navy text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Student</th>
                  <th className="px-4 py-3 text-left font-semibold">Admission No</th>
                  <th className="px-4 py-3 text-left font-semibold">Class</th>
                  <th className="px-4 py-3 text-left font-semibold">Section</th>
                  <th className="px-4 py-3 text-left font-semibold">Roll No</th>
                  <th className="px-4 py-3 text-left font-semibold">Gender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {filtered.map(student => (
                  <tr key={student.id} className="hover:bg-navy-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={getAvatarUrl(student.name)} alt="" className="h-8 w-8 rounded-full" />
                        <span className="font-medium text-navy-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy-600">{student.admissionNo}</td>
                    <td className="px-4 py-3 text-navy-600">{student.className}</td>
                    <td className="px-4 py-3 text-navy-600">{student.sectionName}</td>
                    <td className="px-4 py-3 text-navy-600">{student.rollNumber}</td>
                    <td className="px-4 py-3"><Badge>{student.gender || '-'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardShell>
  );
}
