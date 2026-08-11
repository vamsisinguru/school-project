'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Input, Select, Badge, EmptyState, Skeleton, Button, Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LayoutDashboard, Users, UserCog, ClipboardList, Bell, Calendar, Image, Search, Eye } from 'lucide-react';
import { getAvatarUrl, formatDate } from '@/lib/utils';

const navItems = [
  { href: '/portal/admin', label: 'Overview', icon: 'dashboard' },
  { href: '/portal/admin/students', label: 'Students', icon: 'users' },
  { href: '/portal/admin/staff', label: 'Staff', icon: 'user-cog' },
  { href: '/portal/admin/admissions', label: 'Admissions', icon: 'clipboard-list' },
  { href: '/portal/admin/notices', label: 'Notices', icon: 'bell' },
  { href: '/portal/admin/events', label: 'Events', icon: 'calendar' },
  { href: '/portal/admin/gallery', label: 'Gallery', icon: 'image' },
];

export default function AdminStudentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [viewStudent, setViewStudent] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
        setClasses(data.classes);
      }
    } catch {}
    setLoading(false);
  };

  const filtered = students.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.admissionNo.includes(search)) return false;
    if (classFilter && s.className !== classFilter) return false;
    return true;
  });

  return (
    <DashboardShell navItems={navItems} userName="" userRole="ADMIN" basePath="/portal/admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Student Management</h1>
        <p className="text-sm text-navy-500 mt-1">View all students across the school.</p>
      </div>

      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input className="input-field pl-10" placeholder="Search by name or admission no..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={classFilter} onChange={e => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            {classes.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </Select>
        </div>
      </Card>

      <div className="mb-4 text-sm text-navy-500">{filtered.length} students</div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={Users} title="No Students Found" /></Card>
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
                  <th className="px-4 py-3 text-center font-semibold">Action</th>
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
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setViewStudent(student)} className="text-navy-500 hover:text-navy-900"><Eye className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details">
        {viewStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={getAvatarUrl(viewStudent.name)} alt="" className="h-16 w-16 rounded-full" />
              <div>
                <h3 className="text-lg font-bold text-navy-900">{viewStudent.name}</h3>
                <p className="text-sm text-navy-500">{viewStudent.className} - {viewStudent.sectionName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-navy-400">Admission No</p><p className="font-medium text-navy-900">{viewStudent.admissionNo}</p></div>
              <div><p className="text-navy-400">Roll Number</p><p className="font-medium text-navy-900">{viewStudent.rollNumber}</p></div>
              <div><p className="text-navy-400">Gender</p><p className="font-medium text-navy-900">{viewStudent.gender || '-'}</p></div>
              <div><p className="text-navy-400">Blood Group</p><p className="font-medium text-navy-900">{viewStudent.bloodGroup || '-'}</p></div>
              <div><p className="text-navy-400">Date of Birth</p><p className="font-medium text-navy-900">{viewStudent.dateOfBirth ? formatDate(viewStudent.dateOfBirth) : '-'}</p></div>
              <div><p className="text-navy-400">Academic Year</p><p className="font-medium text-navy-900">{viewStudent.academicYear}</p></div>
            </div>
            {viewStudent.address && (
              <div><p className="text-navy-400 text-sm">Address</p><p className="font-medium text-navy-900">{viewStudent.address}</p></div>
            )}
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}
