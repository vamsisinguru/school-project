'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Button, Select, Badge, EmptyState, Skeleton } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LayoutDashboard, Users, CheckSquare, FileEdit, Clock, Bell, Calendar, CheckCircle2, XCircle, Clock as ClockIcon, Save } from 'lucide-react';
import { getAvatarUrl, cn } from '@/lib/utils';

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
  className: string;
  sectionName: string;
}

export default function StaffAttendancePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [existingAttendance, setExistingAttendance] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/staff/attendance-options');
        if (res.ok) {
          const data = await res.json();
          setSubjects(data.subjects);
          if (data.subjects.length > 0) {
            setSelectedSubject(data.subjects[0].id);
          }
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    async function fetchStudents() {
      setStudents([]);
      setAttendance({});
      setExistingAttendance({});
      try {
        const res = await fetch(`/api/staff/attendance-students?subjectId=${selectedSubject}`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students);
          const existing: Record<string, string> = {};
          data.existingAttendance.forEach((a: any) => {
            existing[a.studentId] = a.status;
          });
          setExistingAttendance(existing);
          setAttendance(existing);
        }
      } catch {}
    }
    fetchStudents();
  }, [selectedSubject, selectedDate]);

  const markAttendance = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: string) => {
    const all: Record<string, string> = {};
    students.forEach(s => { all[s.id] = status; });
    setAttendance(all);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/staff/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId: selectedSubject, date: selectedDate, attendance }),
      });
      if (res.ok) {
        toast('Attendance saved successfully!', 'success');
        setExistingAttendance(attendance);
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to save attendance', 'error');
      }
    } catch {
      toast('An error occurred', 'error');
    }
    setSaving(false);
  };

  const hasExisting = Object.keys(existingAttendance).length > 0;

  return (
    <DashboardShell navItems={navItems} userName="" userRole="STAFF" basePath="/portal/staff">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Attendance Management</h1>
        <p className="text-sm text-navy-500 mt-1">Mark attendance for your classes.</p>
      </div>

      {/* Controls */}
      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} - {s.className}</option>)}
          </Select>
          <div>
            <label className="label-field">Date</label>
            <input type="date" className="input-field" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </div>
        </div>
        {hasExisting && (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            ⚠️ Attendance already marked for this date. Changes will update existing records.
          </div>
        )}
      </Card>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : !selectedSubject ? (
        <Card><EmptyState icon={CheckSquare} title="Select a Subject" description="Choose a subject to mark attendance." /></Card>
      ) : students.length === 0 ? (
        <Card><EmptyState icon={Users} title="No Students" description="No students found for this subject." /></Card>
      ) : (
        <>
          {/* Quick Actions */}
          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => markAll('PRESENT')}><CheckCircle2 className="h-4 w-4 text-green-600" /> Mark All Present</Button>
            <Button variant="secondary" onClick={() => markAll('ABSENT')}><XCircle className="h-4 w-4 text-red-600" /> Mark All Absent</Button>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="gradient-navy text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Student</th>
                    <th className="px-4 py-3 text-left font-semibold">Roll No</th>
                    <th className="px-4 py-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-navy-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={getAvatarUrl(student.name)} alt="" className="h-8 w-8 rounded-full" />
                          <span className="font-medium text-navy-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-navy-600">{student.rollNumber}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {['PRESENT', 'ABSENT', 'LATE'].map(status => (
                            <button
                              key={status}
                              onClick={() => markAttendance(student.id, status)}
                              className={cn(
                                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                                attendance[student.id] === status
                                  ? status === 'PRESENT' ? 'bg-green-500 text-white'
                                    : status === 'ABSENT' ? 'bg-red-500 text-white'
                                    : 'bg-amber-500 text-white'
                                  : 'bg-navy-50 text-navy-500 hover:bg-navy-100'
                              )}
                            >
                              {status === 'PRESENT' ? 'Present' : status === 'ABSENT' ? 'Absent' : 'Late'}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} loading={saving}><Save className="h-4 w-4" /> Save Attendance</Button>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
