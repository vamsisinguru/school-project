'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

export function PerformanceChart({ marks }: { marks: any[] }) {
  if (!marks || marks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-navy-400">
        No academic data available yet.
      </div>
    );
  }

  const data = marks.map(m => ({
    subject: m.examSubject.subject.name.slice(0, 8),
    percentage: Math.round(((m.internalMarks + m.examMarks) / m.examSubject.maxMarks) * 100),
    exam: m.examSubject.exam.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#627d98' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#627d98' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #d9e2ec', fontSize: '12px' }}
          formatter={(value: number) => [`${value}%`, 'Score']}
        />
        <Bar dataKey="percentage" fill="#102a43" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AttendanceChart({ attendance }: { attendance: any[] }) {
  if (!attendance || attendance.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-navy-400">
        No attendance data available.
      </div>
    );
  }

  const present = attendance.filter(a => a.status === 'PRESENT').length;
  const absent = attendance.filter(a => a.status === 'ABSENT').length;
  const late = attendance.filter(a => a.status === 'LATE').length;

  const data = [
    { name: 'Present', value: present, color: '#22c55e' },
    { name: 'Absent', value: absent, color: '#ef4444' },
    { name: 'Late', value: late, color: '#f59e0b' },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #d9e2ec', fontSize: '12px' }} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProgressChart({ data }: { data: { exam: string; percentage: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-navy-400">
        No progress data available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="exam" tick={{ fontSize: 12, fill: '#627d98' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#627d98' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #d9e2ec', fontSize: '12px' }}
          formatter={(value: number) => [`${value}%`, 'Score']}
        />
        <Line type="monotone" dataKey="percentage" stroke="#102a43" strokeWidth={2} dot={{ r: 4, fill: '#102a43' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
