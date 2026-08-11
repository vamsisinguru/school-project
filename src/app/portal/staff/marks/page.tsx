'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Button, Select, Badge, EmptyState, Skeleton, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { LayoutDashboard, Users, CheckSquare, FileEdit, Clock, Bell, Calendar, Save } from 'lucide-react';
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

export default function StaffMarksPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, { internal: string; exam: string; remarks: string }>>({});
  const [maxMarks, setMaxMarks] = useState(100);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/staff/marks-options');
        if (res.ok) {
          const data = await res.json();
          setSubjects(data.subjects);
          setExams(data.exams);
          if (data.subjects.length > 0) setSelectedSubject(data.subjects[0].id);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedSubject || !selectedExam) return;
    async function fetchStudents() {
      setStudents([]);
      setMarks({});
      try {
        const res = await fetch(`/api/staff/marks-students?subjectId=${selectedSubject}&examId=${selectedExam}`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students);
          setMaxMarks(data.maxMarks);
          const existingMarks: Record<string, { internal: string; exam: string; remarks: string }> = {};
          data.existingMarks.forEach((m: any) => {
            existingMarks[m.studentId] = {
              internal: m.internalMarks.toString(),
              exam: m.examMarks.toString(),
              remarks: m.remarks || '',
            };
          });
          setMarks(existingMarks);
        }
      } catch {}
    }
    fetchStudents();
  }, [selectedSubject, selectedExam]);

  const updateMark = (studentId: string, field: 'internal' | 'exam' | 'remarks', value: string) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || { internal: '', exam: '', remarks: '' }), [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/staff/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId: selectedSubject, examId: selectedExam, marks }),
      });
      if (res.ok) {
        toast('Marks saved successfully!', 'success');
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to save marks', 'error');
      }
    } catch {
      toast('An error occurred', 'error');
    }
    setSaving(false);
  };

  const examSubjects = exams.filter(e => e.subjectIds?.includes(selectedSubject));

  return (
    <DashboardShell navItems={navItems} userName="" userRole="STAFF" basePath="/portal/staff">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Marks Management</h1>
        <p className="text-sm text-navy-500 mt-1">Enter and update student marks.</p>
      </div>

      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select label="Subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
            <option value="">Select subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} - {s.className}</option>)}
          </Select>
          <Select label="Examination" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
            <option value="">Select examination</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </Select>
        </div>
      </Card>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : !selectedSubject || !selectedExam ? (
        <Card><EmptyState icon={FileEdit} title="Select Options" description="Choose a subject and examination to enter marks." /></Card>
      ) : students.length === 0 ? (
        <Card><EmptyState icon={Users} title="No Students" description="No students found for this subject." /></Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-navy-500">Max Marks: <strong className="text-navy-700">{maxMarks}</strong></div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="gradient-navy text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Student</th>
                    <th className="px-4 py-3 text-center font-semibold">Internal (max 20)</th>
                    <th className="px-4 py-3 text-center font-semibold">Exam (max {maxMarks - 20})</th>
                    <th className="px-4 py-3 text-left font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {students.map(student => (
                    <tr key={student.id} className="hover:bg-navy-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={getAvatarUrl(student.name)} alt="" className="h-8 w-8 rounded-full" />
                          <div>
                            <p className="font-medium text-navy-900">{student.name}</p>
                            <p className="text-xs text-navy-500">Roll: {student.rollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          className="input-field !py-1.5 !px-2 w-20 text-center mx-auto"
                          value={marks[student.id]?.internal || ''}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            if (val > 20) { toast('Internal marks cannot exceed 20', 'error'); return; }
                            updateMark(student.id, 'internal', e.target.value);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks - 20}
                          className="input-field !py-1.5 !px-2 w-20 text-center mx-auto"
                          value={marks[student.id]?.exam || ''}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            if (val > maxMarks - 20) { toast(`Exam marks cannot exceed ${maxMarks - 20}`, 'error'); return; }
                            updateMark(student.id, 'exam', e.target.value);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="input-field !py-1.5 !px-2"
                          placeholder="Remarks..."
                          value={marks[student.id]?.remarks || ''}
                          onChange={e => updateMark(student.id, 'remarks', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} loading={saving}><Save className="h-4 w-4" /> Save Marks</Button>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
