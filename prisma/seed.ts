import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Academic Year
  const academicYear = await prisma.academicYear.create({
    data: {
      year: '2024-2025',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-03-31'),
      isActive: true,
    },
  });

  // Create Classes and Sections
  const classData = [
    { name: 'Class 4', level: 'Primary', sections: ['A', 'B'] },
    { name: 'Class 5', level: 'Primary', sections: ['A', 'B'] },
    { name: 'Class 6', level: 'Middle', sections: ['A', 'B'] },
    { name: 'Class 7', level: 'Middle', sections: ['A', 'B'] },
    { name: 'Class 8', level: 'Middle', sections: ['A', 'B'] },
    { name: 'Class 9', level: 'High', sections: ['A', 'B'] },
    { name: 'Class 10', level: 'High', sections: ['A', 'B'] },
    { name: 'Class 11', level: 'Higher Secondary', sections: ['A', 'B'] },
    { name: 'Class 12', level: 'Higher Secondary', sections: ['A', 'B'] },
  ];

  const classes: Record<string, { id: string; sections: Record<string, string> }> = {};

  for (const cls of classData) {
    const createdClass = await prisma.class.create({
      data: {
        name: cls.name,
        level: cls.level,
        sections: {
          create: cls.sections.map((s) => ({ name: s })),
        },
      },
      include: { sections: true },
    });
    classes[cls.name] = {
      id: createdClass.id,
      sections: Object.fromEntries(createdClass.sections.map((s) => [s.name, s.id])),
    };
  }

  // Create Subjects for each class level
  const primarySubjects = ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer Science', 'General Knowledge'];
  const middleSubjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Hindi', 'Computer Science'];
  const highSubjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Social Studies', 'Hindi', 'Computer Science'];
  const higherSecSubjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

  const subjectMap: Record<string, string> = {};

  for (const [className, clsInfo] of Object.entries(classes)) {
    const cls = classData.find((c) => c.name === className)!;
    let subjects: string[];
    if (cls.level === 'Primary') subjects = primarySubjects;
    else if (cls.level === 'Middle') subjects = middleSubjects;
    else if (cls.level === 'High') subjects = highSubjects;
    else subjects = higherSecSubjects;

    for (const subj of subjects) {
      const code = `${subj.slice(0, 3).toUpperCase()}-${className.replace(/\s/g, '')}`;
      const created = await prisma.subject.create({
        data: { name: subj, code, classId: clsInfo.id },
      });
      subjectMap[`${className}-${subj}`] = created.id;
    }
  }

  // Create Staff users
  const staffUsers = [
    { name: 'Dr. Rajesh Kumar', email: 'teacher@example.com', designation: 'Senior Mathematics Teacher', employeeId: 'EMP001', qualification: 'M.Sc, B.Ed', canManageTimetable: true, canManageNotices: true, canManageEvents: true },
    { name: 'Mrs. Lakshmi Rao', email: 'lakshmi@example.com', designation: 'Science Teacher', employeeId: 'EMP002', qualification: 'M.Sc, B.Ed' },
    { name: 'Mr. Suresh Reddy', email: 'suresh@example.com', designation: 'English Teacher', employeeId: 'EMP003', qualification: 'M.A, B.Ed', canManageNotices: true },
    { name: 'Mrs. Priya Nair', email: 'priya@example.com', designation: 'Social Studies Teacher', employeeId: 'EMP004', qualification: 'M.A, B.Ed' },
    { name: 'Mr. Arjun Gupta', email: 'arjun@example.com', designation: 'Computer Science Teacher', employeeId: 'EMP005', qualification: 'M.Tech' },
  ];

  const staffIds: string[] = [];

  for (const s of staffUsers) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash,
        role: 'STAFF',
        name: s.name,
        phone: '+91 9876543210',
        staff: {
          create: {
            employeeId: s.employeeId,
            designation: s.designation,
            qualification: s.qualification,
            canManageTimetable: s.canManageTimetable || false,
            canManageNotices: s.canManageNotices || false,
            canManageEvents: s.canManageEvents || false,
          },
        },
      },
      include: { staff: true },
    });
    staffIds.push(user.staff!.id);
  }

  // Assign subjects to staff
  const class10Subjects = await prisma.subject.findMany({ where: { classId: classes['Class 10'].id } });
  for (const subj of class10Subjects) {
    if (subj.name === 'Mathematics') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[0] } });
    if (subj.name === 'Physics' || subj.name === 'Chemistry' || subj.name === 'Biology') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[1] } });
    if (subj.name === 'English') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[2] } });
    if (subj.name === 'Social Studies') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[3] } });
    if (subj.name === 'Computer Science') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[4] } });
  }

  const class7Subjects = await prisma.subject.findMany({ where: { classId: classes['Class 7'].id } });
  for (const subj of class7Subjects) {
    if (subj.name === 'Mathematics') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[0] } });
    if (subj.name === 'Science') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[1] } });
    if (subj.name === 'English') await prisma.subject.update({ where: { id: subj.id }, data: { staffId: staffIds[2] } });
  }

  // Create Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN',
      name: 'School Administrator',
      phone: '+91 9876543200',
      staff: {
        create: {
          employeeId: 'ADM001',
          designation: 'School Administrator',
          qualification: 'M.A, B.Ed, MBA',
          canManageTimetable: true,
          canManageNotices: true,
          canManageEvents: true,
          isAdmin: true,
        },
      },
    },
  });

  // Create Parent user with multiple children
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@example.com',
      passwordHash,
      role: 'PARENT',
      name: 'Mr. Krishna Sharma',
      phone: '+91 9876543299',
      parent: {
        create: {
          occupation: 'Software Engineer',
          address: '45 MG Road, Bangalore, Karnataka 560001',
        },
      },
    },
    include: { parent: true },
  });

  // Create Student users (children of the parent)
  const studentData = [
    { name: 'Aarav Sharma', email: 'student@example.com', rollNumber: '001', admissionNo: 'ADM2024001', className: 'Class 10', section: 'A', dob: '2009-05-15', gender: 'Male', bloodGroup: 'B+' },
    { name: 'Ananya Sharma', email: 'ananya@example.com', rollNumber: '015', admissionNo: 'ADM2024015', className: 'Class 7', section: 'B', dob: '2012-08-22', gender: 'Female', bloodGroup: 'O+' },
  ];

  const studentIds: string[] = [];

  for (const s of studentData) {
    const clsInfo = classes[s.className];
    const sectionId = clsInfo.sections[s.section];
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash,
        role: 'STUDENT',
        name: s.name,
        phone: '+91 9876543299',
        student: {
          create: {
            rollNumber: s.rollNumber,
            admissionNo: s.admissionNo,
            dateOfBirth: new Date(s.dob),
            gender: s.gender,
            bloodGroup: s.bloodGroup,
            address: '45 MG Road, Bangalore, Karnataka 560001',
            classId: clsInfo.id,
            sectionId,
            academicYearId: academicYear.id,
          },
        },
      },
      include: { student: true },
    });
    studentIds.push(user.student!.id);

    // Link student to parent
    await prisma.parentStudent.create({
      data: {
        parentId: parentUser.parent!.id,
        studentId: user.student!.id,
        relation: 'Father',
      },
    });
  }

  // Create additional students for staff to manage
  const additionalStudents = [
    { name: 'Vikram Reddy', email: 'vikram@example.com', rollNumber: '002', admissionNo: 'ADM2024002', className: 'Class 10', section: 'A', dob: '2009-03-10', gender: 'Male', bloodGroup: 'A+' },
    { name: 'Sneha Patel', email: 'sneha@example.com', rollNumber: '003', admissionNo: 'ADM2024003', className: 'Class 10', section: 'A', dob: '2009-07-18', gender: 'Female', bloodGroup: 'AB+' },
    { name: 'Rohan Verma', email: 'rohan@example.com', rollNumber: '004', admissionNo: 'ADM2024004', className: 'Class 10', section: 'A', dob: '2009-01-25', gender: 'Male', bloodGroup: 'O-' },
    { name: 'Kavya Iyer', email: 'kavya@example.com', rollNumber: '005', admissionNo: 'ADM2024005', className: 'Class 10', section: 'A', dob: '2009-11-05', gender: 'Female', bloodGroup: 'B-' },
    { name: 'Aditya Nair', email: 'aditya@example.com', rollNumber: '006', admissionNo: 'ADM2024006', className: 'Class 10', section: 'A', dob: '2009-06-12', gender: 'Male', bloodGroup: 'A-' },
    { name: 'Diya Gupta', email: 'diya@example.com', rollNumber: '016', admissionNo: 'ADM2024016', className: 'Class 7', section: 'B', dob: '2012-02-28', gender: 'Female', bloodGroup: 'O+' },
    { name: 'Arjun Singh', email: 'arjuns@example.com', rollNumber: '017', admissionNo: 'ADM2024017', className: 'Class 7', section: 'B', dob: '2012-09-14', gender: 'Male', bloodGroup: 'A+' },
  ];

  for (const s of additionalStudents) {
    const clsInfo = classes[s.className];
    const sectionId = clsInfo.sections[s.section];
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash,
        role: 'STUDENT',
        name: s.name,
        student: {
          create: {
            rollNumber: s.rollNumber,
            admissionNo: s.admissionNo,
            dateOfBirth: new Date(s.dob),
            gender: s.gender,
            bloodGroup: s.bloodGroup,
            classId: clsInfo.id,
            sectionId,
            academicYearId: academicYear.id,
          },
        },
      },
      include: { student: true },
    });
    studentIds.push(user.student!.id);
  }

  // Create Exams
  const exam1 = await prisma.exam.create({
    data: {
      name: 'Mid-Term Examination 2024',
      examType: 'Mid-Term',
      academicYearId: academicYear.id,
      startDate: new Date('2024-09-15'),
      endDate: new Date('2024-09-25'),
      isPublished: true,
    },
  });

  const exam2 = await prisma.exam.create({
    data: {
      name: 'Final Examination 2025',
      examType: 'Final',
      academicYearId: academicYear.id,
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-02-28'),
      isPublished: false,
    },
  });

  // Create ExamSubjects and Marks for Class 10 Mid-Term
  const class10SubjIds = await prisma.subject.findMany({ where: { classId: classes['Class 10'].id } });
  const aaravId = studentIds[0];

  for (const subj of class10SubjIds) {
    const examSubj = await prisma.examSubject.create({
      data: {
        examId: exam1.id,
        subjectId: subj.id,
        examDate: new Date('2024-09-16'),
        maxMarks: 100,
        passMarks: 35,
      },
    });

    // Create marks for Aarav (student 0)
    const internalMarks = Math.floor(Math.random() * 5) + 15;
    const examMarks = Math.floor(Math.random() * 15) + 60;
    await prisma.mark.create({
      data: {
        studentId: aaravId,
        examSubjectId: examSubj.id,
        internalMarks,
        examMarks,
        remarks: getRemarks(internalMarks + examMarks),
      },
    });

    // Create marks for other Class 10 students
    for (let i = 3; i < 8; i++) {
      const im = Math.floor(Math.random() * 8) + 12;
      const em = Math.floor(Math.random() * 25) + 50;
      await prisma.mark.create({
        data: {
          studentId: studentIds[i],
          examSubjectId: examSubj.id,
          internalMarks: im,
          examMarks: em,
          remarks: getRemarks(im + em),
        },
      });
    }
  }

  // Create ExamSubjects and Marks for Class 7 Mid-Term (for Ananya)
  const class7SubjIds = await prisma.subject.findMany({ where: { classId: classes['Class 7'].id } });
  const ananyaId = studentIds[1];

  for (const subj of class7SubjIds) {
    const examSubj = await prisma.examSubject.create({
      data: {
        examId: exam1.id,
        subjectId: subj.id,
        examDate: new Date('2024-09-17'),
        maxMarks: 100,
        passMarks: 35,
      },
    });

    const im = Math.floor(Math.random() * 5) + 15;
    const em = Math.floor(Math.random() * 15) + 65;
    await prisma.mark.create({
      data: {
        studentId: ananyaId,
        examSubjectId: examSubj.id,
        internalMarks: im,
        examMarks: em,
        remarks: getRemarks(im + em),
      },
    });
  }

  // Create Attendance for Aarav (last 30 days)
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const status = Math.random() > 0.06 ? 'PRESENT' : Math.random() > 0.5 ? 'ABSENT' : 'LATE';
    await prisma.attendance.create({
      data: {
        studentId: aaravId,
        date,
        status,
        markedBy: staffIds[0],
      },
    });
  }

  // Create Attendance for Ananya
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const status = Math.random() > 0.04 ? 'PRESENT' : Math.random() > 0.5 ? 'ABSENT' : 'LATE';
    await prisma.attendance.create({
      data: {
        studentId: ananyaId,
        date,
        status,
        markedBy: staffIds[2],
      },
    });
  }

  // Create Timetable for Class 10A
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    { start: '08:30', end: '09:15' },
    { start: '09:15', end: '10:00' },
    { start: '10:00', end: '10:15', isBreak: true, breakType: 'Short Break' },
    { start: '10:15', end: '11:00' },
    { start: '11:00', end: '11:45' },
    { start: '11:45', end: '12:30', isBreak: true, breakType: 'Lunch' },
    { start: '12:30', end: '01:15' },
    { start: '01:15', end: '02:00' },
  ];

  const subjectRotation = ['Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'Social Studies', 'Computer Science', 'Hindi'];

  for (const day of days) {
    const timetable = await prisma.timetable.create({
      data: { classId: classes['Class 10'].id, day, isActive: true },
    });

    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      if (slot.isBreak) {
        await prisma.timetablePeriod.create({
          data: {
            timetableId: timetable.id,
            periodNumber: i + 1,
            startTime: slot.start,
            endTime: slot.end,
            isBreak: true,
            breakType: slot.breakType,
          },
        });
      } else {
        const subjName = subjectRotation[(days.indexOf(day) + i) % subjectRotation.length];
        const subj = class10SubjIds.find((s) => s.name === subjName);
        if (subj) {
          let staffId: string | undefined;
          if (subj.name === 'Mathematics') staffId = staffIds[0];
          else if (['Physics', 'Chemistry', 'Biology'].includes(subj.name)) staffId = staffIds[1];
          else if (subj.name === 'English') staffId = staffIds[2];
          else if (subj.name === 'Social Studies') staffId = staffIds[3];
          else if (subj.name === 'Computer Science') staffId = staffIds[4];

          await prisma.timetablePeriod.create({
            data: {
              timetableId: timetable.id,
              periodNumber: i + 1,
              startTime: slot.start,
              endTime: slot.end,
              subjectId: subj.id,
              staffId,
            },
          });
        }
      }
    }
  }

  // Create Timetable for Class 7B
  const class7Subjs = await prisma.subject.findMany({ where: { classId: classes['Class 7'].id } });
  const class7Rotation = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science', 'General Knowledge'];

  for (const day of days) {
    const timetable = await prisma.timetable.create({
      data: { classId: classes['Class 7'].id, day, isActive: true },
    });

    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      if (slot.isBreak) {
        await prisma.timetablePeriod.create({
          data: {
            timetableId: timetable.id,
            periodNumber: i + 1,
            startTime: slot.start,
            endTime: slot.end,
            isBreak: true,
            breakType: slot.breakType,
          },
        });
      } else {
        const subjName = class7Rotation[(days.indexOf(day) + i) % class7Rotation.length];
        const subj = class7Subjs.find((s) => s.name === subjName);
        if (subj) {
          await prisma.timetablePeriod.create({
            data: {
              timetableId: timetable.id,
              periodNumber: i + 1,
              startTime: slot.start,
              endTime: slot.end,
              subjectId: subj.id,
            },
          });
        }
      }
    }
  }

  // Create Assignments for Class 10
  for (const subj of class10SubjIds) {
    await prisma.assignment.create({
      data: {
        subjectId: subj.id,
        title: `${subj.name} - Chapter 1 Assignment`,
        description: `Complete the exercises from Chapter 1 of ${subj.name}. Submit your work before the due date.`,
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        maxMarks: 50,
        studentAssignments: {
          create: {
            studentId: aaravId,
            status: 'Submitted',
            submittedAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
            marks: Math.floor(Math.random() * 10) + 38,
            feedback: 'Good work, keep it up!',
          },
        },
      },
    });

    await prisma.assignment.create({
      data: {
        subjectId: subj.id,
        title: `${subj.name} - Chapter 2 Assignment`,
        description: `Complete the exercises from Chapter 2 of ${subj.name}.`,
        dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        maxMarks: 50,
        studentAssignments: {
          create: {
            studentId: aaravId,
            status: 'Pending',
          },
        },
      },
    });
  }

  // Create Notices
  const notices = [
    { title: 'Parent-Teacher Meeting', content: 'A parent-teacher meeting is scheduled for Saturday, 15th October 2024 from 9:00 AM to 12:00 PM. All parents are requested to attend.', category: 'PTM', priority: 'High' },
    { title: 'Mid-Term Examination Results', content: 'Mid-Term examination results will be declared on 5th October 2024. Parents can view the results on the parent portal.', category: 'Examination', priority: 'High' },
    { title: 'Annual Sports Day', content: 'The Annual Sports Day will be held on 20th November 2024. Students are encouraged to participate in various athletic events.', category: 'Event', priority: 'Normal' },
    { title: 'Holiday Notice - Diwali Break', content: 'The school will remain closed from 28th October to 3rd November 2024 for Diwali celebrations. Classes will resume on 4th November.', category: 'Holiday', priority: 'High' },
    { title: 'Fee Reminder - Q3', content: 'This is a reminder that the Q3 tuition fees are due by 15th October 2024. Please make the payment before the due date to avoid late fee charges.', category: 'Fee', priority: 'High' },
    { title: 'Science Exhibition', content: 'A science exhibition will be organized on 25th October 2024. Students from classes 6-12 can participate. Register with your science teacher.', category: 'Event', priority: 'Normal' },
    { title: 'School Circular - Uniform Change', content: 'Starting from the new academic session, students are required to wear the new school uniform. Details available at the school office.', category: 'Circular', priority: 'Normal' },
  ];

  for (const n of notices) {
    await prisma.notice.create({
      data: {
        ...n,
        createdBy: adminUser.id,
        publishDate: new Date(),
      },
    });
  }

  // Create Events
  const events = [
    { title: 'Annual Day Celebration', description: 'Join us for our Annual Day Celebration featuring cultural performances, awards, and more.', category: 'Cultural', startDate: new Date('2024-12-15T17:00:00'), venue: 'School Auditorium', imageUrl: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800' },
    { title: 'Inter-School Sports Meet', description: 'Annual inter-school sports competition featuring cricket, football, athletics, and more.', category: 'Sports', startDate: new Date('2024-11-20T09:00:00'), venue: 'School Sports Ground', imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800' },
    { title: 'Science Exhibition 2024', description: 'Students showcase innovative science projects and experiments.', category: 'Academic', startDate: new Date('2024-10-25T10:00:00'), venue: 'Science Block', imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800' },
    { title: 'Independence Day Celebration', description: 'Flag hoisting ceremony and cultural program to celebrate Independence Day.', category: 'Cultural', startDate: new Date('2024-08-15T08:00:00'), venue: 'School Ground', imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800' },
    { title: 'Parent-Teacher Meeting', description: 'Quarterly parent-teacher meeting to discuss student progress.', category: 'PTM', startDate: new Date('2024-10-15T09:00:00'), venue: 'Respective Classrooms', imageUrl: '/images/events/parent-teacher-meeting.jpg' },
  ];

  for (const e of events) {
    await prisma.event.create({
      data: { ...e, createdBy: adminUser.id },
    });
  }

  // Create Gallery Items
  const galleryItems = [
    { title: 'School Campus', category: 'Campus', imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', description: 'Beautiful view of our school campus' },
    { title: 'Modern Classroom', category: 'Classrooms', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', description: 'Smart classroom with digital boards' },
    { title: 'Science Lab', category: 'Campus', imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', description: 'Well-equipped science laboratory' },
    { title: 'Sports Day', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800', description: 'Annual sports day celebration' },
    { title: 'Annual Day Performance', category: 'Annual Day', imageUrl: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800', description: 'Student performance on annual day' },
    { title: 'Cultural Dance', category: 'Cultural Activities', imageUrl: '/images/gallery/cultural-dance.jpg', description: 'Sri Chaitanya School students performing a cultural dance' },
    { title: 'Field Trip - Museum', category: 'Field Trips', imageUrl: '/images/gallery/field-trip-museum.jpg', description: 'Sri Chaitanya School students visiting a museum during an educational field trip' },
    { title: 'Library', category: 'Campus', imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800', description: 'Our well-stocked library' },
    { title: 'Annual Day Stage', category: 'Annual Day', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', description: 'Annual day stage decoration' },
    { title: 'Cricket Match', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', description: 'Inter-class cricket tournament' },
    { title: 'Art Exhibition', category: 'Events', imageUrl: '/images/gallery/art-exhibition.jpg', description: 'Sri Chaitanya School students participating in an art exhibition' },
    { title: 'Field Trip - Botanical Garden', category: 'Field Trips', imageUrl: '/images/gallery/field-trip-botanical-garden.jpg', description: 'Sri Chaitanya School students exploring a botanical garden' },
  ];

  for (const g of galleryItems) {
    await prisma.galleryItem.create({ data: g });
  }

  // Create Site Config
  const configs = [
    { key: 'yearsOfExcellence', value: '25' },
    { key: 'totalStudents', value: '5000' },
    { key: 'totalFaculty', value: '300' },
    { key: 'academicPrograms', value: '50' },
    { key: 'schoolName', value: 'Sri Chaitanya School' },
    { key: 'tagline', value: 'Learn. Grow. Excel.' },
    { key: 'address', value: '123 Education City Road, Bangalore, Karnataka 560001' },
    { key: 'phone', value: '+91 80 2345 6789' },
    { key: 'email', value: 'info@srichaitanya.edu.in' },
    { key: 'workingHours', value: 'Mon - Sat: 8:00 AM - 4:00 PM' },
  ];

  for (const c of configs) {
    await prisma.siteConfig.create({ data: c });
  }

  console.log('Seed completed successfully!');
  console.log('\nDemo Accounts:');
  console.log('  Parent:  parent@example.com / password123');
  console.log('  Student: student@example.com / password123');
  console.log('  Staff:   teacher@example.com / password123');
  console.log('  Admin:   admin@example.com / password123');
}

function getRemarks(total: number): string {
  if (total >= 90) return 'Excellent performance! Keep it up.';
  if (total >= 80) return 'Very good work. Continue the effort.';
  if (total >= 70) return 'Good performance. Room for improvement.';
  if (total >= 60) return 'Satisfactory. Needs more focus.';
  if (total >= 35) return 'Passed. Requires significant improvement.';
  return 'Needs serious attention and extra help.';
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
