'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, Button, Badge, EmptyState } from '@/components/ui';
import { FileText, Download, Award, TrendingUp } from 'lucide-react';
import { calculateGrade, calculateGradePoint, formatDate } from '@/lib/utils';

const navItems = [
  { href: '/portal/parent', label: 'Overview', icon: FileText },
  { href: '/portal/parent/attendance', label: 'Attendance', icon: FileText },
  { href: '/portal/parent/report-card', label: 'Report Card', icon: FileText },
  { href: '/portal/parent/timetable', label: 'Timetable', icon: FileText },
  { href: '/portal/parent/exams', label: 'Exams', icon: FileText },
  { href: '/portal/parent/notices', label: 'Notices', icon: FileText },
];

import { CheckCircle2, Clock, GraduationCap, Bell, LayoutDashboard } from 'lucide-react';

const navItemsFixed = [
  { href: '/portal/parent', label: 'Overview', icon: LayoutDashboard },
  { href: '/portal/parent/attendance', label: 'Attendance', icon: CheckCircle2 },
  { href: '/portal/parent/report-card', label: 'Report Card', icon: FileText },
  { href: '/portal/parent/timetable', label: 'Timetable', icon: Clock },
  { href: '/portal/parent/exams', label: 'Exams', icon: GraduationCap },
  { href: '/portal/parent/notices', label: 'Notices', icon: Bell },
];

interface Mark {
  id: string;
  internalMarks: number;
  examMarks: number;
  remarks: string | null;
  examSubject: {
    id: string;
    maxMarks: number;
    subject: { name: string };
    exam: { name: string; examType: string };
  };
}

export default function ParentReportCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/parent/report-card');
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
          setMarks(data.marks);
          setExams(data.exams);
          if (data.exams.length > 0) setSelectedExam(data.exams[0].id);
        }
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredMarks = marks.filter(m => m.examSubject.exam.name === exams.find(e => e.id === selectedExam)?.name);

  const totalMarks = filteredMarks.reduce((sum, m) => sum + m.internalMarks + m.examMarks, 0);
  const maxTotal = filteredMarks.reduce((sum, m) => sum + m.examSubject.maxMarks, 0);
  const overallPct = maxTotal > 0 ? Math.round((totalMarks / maxTotal) * 100) : 0;
  const overallGrade = calculateGrade(overallPct);
  const cgpa = filteredMarks.length > 0
    ? (filteredMarks.reduce((sum, m) => sum + calculateGradePoint(((m.internalMarks + m.examMarks) / m.examSubject.maxMarks) * 100), 0) / filteredMarks.length).toFixed(2)
    : '0.00';

  const handleDownloadPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Sri Chaitanya School', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Learn. Grow. Excel.', 105, 27, { align: 'center' });
        doc.setFontSize(14);
        doc.text('Report Card', 105, 40, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Student Name: ${student?.name || ''}`, 20, 55);
        doc.text(`Class: ${student?.className || ''} - ${student?.sectionName || ''}`, 20, 62);
        doc.text(`Roll No: ${student?.rollNumber || ''}`, 20, 69);
        doc.text(`Admission No: ${student?.admissionNo || ''}`, 20, 76);
        const exam = exams.find(e => e.id === selectedExam);
        doc.text(`Examination: ${exam?.name || ''}`, 130, 55);
        doc.text(`Academic Year: ${student?.academicYear || ''}`, 130, 62);

        doc.line(20, 82, 190, 82);

        const tableData = filteredMarks.map(m => {
          const total = m.internalMarks + m.examMarks;
          const pct = (total / m.examSubject.maxMarks) * 100;
          return [
            m.examSubject.subject.name,
            m.internalMarks.toString(),
            m.examMarks.toString(),
            total.toString(),
            m.examSubject.maxMarks.toString(),
            calculateGrade(pct),
          ];
        });

        (doc as any).autoTable({
          startY: 90,
          head: [['Subject', 'Internal', 'Exam', 'Total', 'Max', 'Grade']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [16, 42, 67] },
          styles: { fontSize: 10 },
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Overall Percentage: ${overallPct}%`, 20, finalY);
        doc.text(`Overall Grade: ${overallGrade}`, 20, finalY + 7);
        doc.text(`CGPA: ${cgpa}`, 20, finalY + 14);

        if (filteredMarks.length > 0 && filteredMarks[0].remarks) {
          doc.text('Teacher Remarks:', 20, finalY + 25);
          filteredMarks.forEach((m, i) => {
            if (m.remarks) {
              doc.setFontSize(8);
              doc.text(`${m.examSubject.subject.name}: ${m.remarks}`, 25, finalY + 31 + i * 5);
            }
          });
        }

        doc.setFontSize(8);
        doc.text('This is a computer-generated report card.', 105, 280, { align: 'center' });

        doc.save(`ReportCard_${student?.name || 'student'}_${exam?.name || ''}.pdf`);
      });
    });
  };

  if (loading) {
    return (
      <DashboardShell navItems={navItemsFixed} userName="" userRole="PARENT" basePath="/portal/parent">
        <div className="animate-pulse space-y-4">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-32 w-full" />
          <div className="skeleton h-64 w-full" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={navItemsFixed} userName={student?.parentName || ''} userRole="PARENT" basePath="/portal/parent">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Report Card</h1>
          <p className="text-sm text-navy-500 mt-1">{student?.name} - {student?.className} {student?.sectionName}</p>
        </div>
        <Button onClick={handleDownloadPDF} disabled={filteredMarks.length === 0}>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {exams.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {exams.map(exam => (
            <button
              key={exam.id}
              onClick={() => setSelectedExam(exam.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedExam === exam.id ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
              }`}
            >
              {exam.name}
            </button>
          ))}
        </div>
      )}

      {filteredMarks.length === 0 ? (
        <Card className="p-6">
          <EmptyState icon={FileText} title="No Results Available" description="Results for this examination have not been published yet." />
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Card className="p-5 text-center">
              <Award className="h-8 w-8 text-gold-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-navy-900">{overallGrade}</p>
              <p className="text-xs text-navy-500">Overall Grade</p>
            </Card>
            <Card className="p-5 text-center">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-navy-900">{overallPct}%</p>
              <p className="text-xs text-navy-500">Overall Percentage</p>
            </Card>
            <Card className="p-5 text-center">
              <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-navy-900">{cgpa}</p>
              <p className="text-xs text-navy-500">CGPA</p>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="gradient-navy text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Subject</th>
                    <th className="px-4 py-3 text-center font-semibold">Internal</th>
                    <th className="px-4 py-3 text-center font-semibold">Exam</th>
                    <th className="px-4 py-3 text-center font-semibold">Total</th>
                    <th className="px-4 py-3 text-center font-semibold">Max</th>
                    <th className="px-4 py-3 text-center font-semibold">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-50">
                  {filteredMarks.map(mark => {
                    const total = mark.internalMarks + mark.examMarks;
                    const pct = (total / mark.examSubject.maxMarks) * 100;
                    const grade = calculateGrade(pct);
                    return (
                      <tr key={mark.id} className="hover:bg-navy-50/50">
                        <td className="px-4 py-3 font-medium text-navy-900">{mark.examSubject.subject.name}</td>
                        <td className="px-4 py-3 text-center text-navy-700">{mark.internalMarks}</td>
                        <td className="px-4 py-3 text-center text-navy-700">{mark.examMarks}</td>
                        <td className="px-4 py-3 text-center font-semibold text-navy-900">{total}</td>
                        <td className="px-4 py-3 text-center text-navy-500">{mark.examSubject.maxMarks}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={grade.startsWith('A') ? 'success' : grade === 'F' ? 'danger' : 'warning'}>{grade}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <h3 className="font-semibold text-navy-900 mb-4">Teacher Remarks</h3>
            <div className="space-y-3">
              {filteredMarks.filter(m => m.remarks).map(mark => (
                <div key={mark.id} className="border-b border-navy-50 pb-3 last:border-0">
                  <p className="text-sm font-medium text-navy-900">{mark.examSubject.subject.name}</p>
                  <p className="text-sm text-navy-500 mt-1">{mark.remarks}</p>
                </div>
              ))}
              {filteredMarks.filter(m => m.remarks).length === 0 && <p className="text-sm text-navy-400">No remarks available.</p>}
            </div>
          </Card>
        </>
      )}
    </DashboardShell>
  );
}
