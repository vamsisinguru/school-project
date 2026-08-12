-- ============================================================
-- Sri Chaitanya School - Database Seed Script
-- Run this in Supabase SQL Editor AFTER `npx prisma db push`
-- ============================================================

-- Clean existing data (run in order to respect FK constraints)
TRUNCATE TABLE "ParentStudent", "StudentAssignment", "Assignment", "Mark", "ExamSubject", "Exam", "Attendance", "TimetablePeriod", "Timetable", "Subject", "Section", "Class", "Notice", "Event", "GalleryItem", "SiteConfig", "Student", "Parent", "Staff", "Session", "User", "AcademicYear" CASCADE;

-- ============================================================
-- 1. Academic Year
-- ============================================================
INSERT INTO "AcademicYear" ("id", "year", "startDate", "endDate", "isActive") VALUES
('ay_2024', '2024-2025', '2024-06-01', '2025-03-31', true);

-- ============================================================
-- 2. Classes
-- ============================================================
INSERT INTO "Class" ("id", "name", "level") VALUES
('cls_4',  'Class 4',  'Primary'),
('cls_5',  'Class 5',  'Primary'),
('cls_6',  'Class 6',  'Middle'),
('cls_7',  'Class 7',  'Middle'),
('cls_8',  'Class 8',  'Middle'),
('cls_9',  'Class 9',  'High'),
('cls_10', 'Class 10', 'High'),
('cls_11', 'Class 11', 'Higher Secondary'),
('cls_12', 'Class 12', 'Higher Secondary');

-- ============================================================
-- 3. Sections (A and B for each class)
-- ============================================================
INSERT INTO "Section" ("id", "name", "classId") VALUES
('sec_4a',  'A', 'cls_4'),  ('sec_4b',  'B', 'cls_4'),
('sec_5a',  'A', 'cls_5'),  ('sec_5b',  'B', 'cls_5'),
('sec_6a',  'A', 'cls_6'),  ('sec_6b',  'B', 'cls_6'),
('sec_7a',  'A', 'cls_7'),  ('sec_7b',  'B', 'cls_7'),
('sec_8a',  'A', 'cls_8'),  ('sec_8b',  'B', 'cls_8'),
('sec_9a',  'A', 'cls_9'),  ('sec_9b',  'B', 'cls_9'),
('sec_10a', 'A', 'cls_10'), ('sec_10b', 'B', 'cls_10'),
('sec_11a', 'A', 'cls_11'), ('sec_11b', 'B', 'cls_11'),
('sec_12a', 'A', 'cls_12'), ('sec_12b', 'B', 'cls_12');

-- ============================================================
-- 4. Subjects for each class
-- ============================================================
-- Primary subjects
INSERT INTO "Subject" ("id", "name", "code", "classId") VALUES
('sub_4_eng', 'English', 'ENG-Class4', 'cls_4'),
('sub_4_mat', 'Mathematics', 'MAT-Class4', 'cls_4'),
('sub_4_sci', 'Science', 'SCI-Class4', 'cls_4'),
('sub_4_soc', 'Social Studies', 'SOC-Class4', 'cls_4'),
('sub_4_hin', 'Hindi', 'HIN-Class4', 'cls_4'),
('sub_4_cs',  'Computer Science', 'COM-Class4', 'cls_4'),
('sub_4_gk',  'General Knowledge', 'GEN-Class4', 'cls_4'),
('sub_5_eng', 'English', 'ENG-Class5', 'cls_5'),
('sub_5_mat', 'Mathematics', 'MAT-Class5', 'cls_5'),
('sub_5_sci', 'Science', 'SCI-Class5', 'cls_5'),
('sub_5_soc', 'Social Studies', 'SOC-Class5', 'cls_5'),
('sub_5_hin', 'Hindi', 'HIN-Class5', 'cls_5'),
('sub_5_cs',  'Computer Science', 'COM-Class5', 'cls_5'),
('sub_5_gk',  'General Knowledge', 'GEN-Class5', 'cls_5'),
-- Middle subjects
('sub_6_eng', 'English', 'ENG-Class6', 'cls_6'),
('sub_6_mat', 'Mathematics', 'MAT-Class6', 'cls_6'),
('sub_6_phy', 'Physics', 'PHY-Class6', 'cls_6'),
('sub_6_chem','Chemistry', 'CHE-Class6', 'cls_6'),
('sub_6_bio', 'Biology', 'BIO-Class6', 'cls_6'),
('sub_6_soc', 'Social Studies', 'SOC-Class6', 'cls_6'),
('sub_6_hin', 'Hindi', 'HIN-Class6', 'cls_6'),
('sub_6_cs',  'Computer Science', 'COM-Class6', 'cls_6'),
('sub_7_eng', 'English', 'ENG-Class7', 'cls_7'),
('sub_7_mat', 'Mathematics', 'MAT-Class7', 'cls_7'),
('sub_7_phy', 'Physics', 'PHY-Class7', 'cls_7'),
('sub_7_chem','Chemistry', 'CHE-Class7', 'cls_7'),
('sub_7_bio', 'Biology', 'BIO-Class7', 'cls_7'),
('sub_7_soc', 'Social Studies', 'SOC-Class7', 'cls_7'),
('sub_7_hin', 'Hindi', 'HIN-Class7', 'cls_7'),
('sub_7_cs',  'Computer Science', 'COM-Class7', 'cls_7'),
('sub_8_eng', 'English', 'ENG-Class8', 'cls_8'),
('sub_8_mat', 'Mathematics', 'MAT-Class8', 'cls_8'),
('sub_8_phy', 'Physics', 'PHY-Class8', 'cls_8'),
('sub_8_chem','Chemistry', 'CHE-Class8', 'cls_8'),
('sub_8_bio', 'Biology', 'BIO-Class8', 'cls_8'),
('sub_8_soc', 'Social Studies', 'SOC-Class8', 'cls_8'),
('sub_8_hin', 'Hindi', 'HIN-Class8', 'cls_8'),
('sub_8_cs',  'Computer Science', 'COM-Class8', 'cls_8'),
-- High subjects
('sub_9_eng', 'English', 'ENG-Class9', 'cls_9'),
('sub_9_mat', 'Mathematics', 'MAT-Class9', 'cls_9'),
('sub_9_phy', 'Physics', 'PHY-Class9', 'cls_9'),
('sub_9_chem','Chemistry', 'CHE-Class9', 'cls_9'),
('sub_9_bio', 'Biology', 'BIO-Class9', 'cls_9'),
('sub_9_soc', 'Social Studies', 'SOC-Class9', 'cls_9'),
('sub_9_hin', 'Hindi', 'HIN-Class9', 'cls_9'),
('sub_9_cs',  'Computer Science', 'COM-Class9', 'cls_9'),
('sub_10_eng','English', 'ENG-Class10', 'cls_10'),
('sub_10_mat','Mathematics', 'MAT-Class10', 'cls_10'),
('sub_10_phy','Physics', 'PHY-Class10', 'cls_10'),
('sub_10_chem','Chemistry', 'CHE-Class10', 'cls_10'),
('sub_10_bio','Biology', 'BIO-Class10', 'cls_10'),
('sub_10_soc','Social Studies', 'SOC-Class10', 'cls_10'),
('sub_10_hin','Hindi', 'HIN-Class10', 'cls_10'),
('sub_10_cs', 'Computer Science', 'COM-Class10', 'cls_10'),
-- Higher Secondary subjects
('sub_11_eng','English', 'ENG-Class11', 'cls_11'),
('sub_11_mat','Mathematics', 'MAT-Class11', 'cls_11'),
('sub_11_phy','Physics', 'PHY-Class11', 'cls_11'),
('sub_11_chem','Chemistry', 'CHE-Class11', 'cls_11'),
('sub_11_bio','Biology', 'BIO-Class11', 'cls_11'),
('sub_11_cs', 'Computer Science', 'COM-Class11', 'cls_11'),
('sub_12_eng','English', 'ENG-Class12', 'cls_12'),
('sub_12_mat','Mathematics', 'MAT-Class12', 'cls_12'),
('sub_12_phy','Physics', 'PHY-Class12', 'cls_12'),
('sub_12_chem','Chemistry', 'CHE-Class12', 'cls_12'),
('sub_12_bio','Biology', 'BIO-Class12', 'cls_12'),
('sub_12_cs', 'Computer Science', 'COM-Class12', 'cls_12');

-- ============================================================
-- 5. Users (Staff, Admin, Parent, Students)
-- Password for all demo accounts: password123
-- bcrypt hash: $2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea
-- ============================================================
INSERT INTO "User" ("id", "email", "passwordHash", "role", "name", "phone") VALUES
-- Staff users
('u_staff1', 'teacher@example.com',  '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STAFF', 'Dr. Rajesh Kumar',  '+91 9876543210'),
('u_staff2', 'lakshmi@example.com',  '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STAFF', 'Mrs. Lakshmi Rao',   '+91 9876543210'),
('u_staff3', 'suresh@example.com',   '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STAFF', 'Mr. Suresh Reddy',   '+91 9876543210'),
('u_staff4', 'priya@example.com',    '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STAFF', 'Mrs. Priya Nair',    '+91 9876543210'),
('u_staff5', 'arjun@example.com',    '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STAFF', 'Mr. Arjun Gupta',    '+91 9876543210'),
-- Admin user
('u_admin',  'admin@example.com',    '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'ADMIN', 'School Administrator','+91 9876543200'),
-- Parent user
('u_parent', 'parent@example.com',   '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'PARENT','Mr. Krishna Sharma', '+91 9876543299'),
-- Student users
('u_stud1',  'student@example.com',  '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Aarav Sharma',      '+91 9876543299'),
('u_stud2',  'ananya@example.com',   '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Ananya Sharma',     '+91 9876543299'),
('u_stud3',  'vikram@example.com',   '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Vikram Reddy',      NULL),
('u_stud4',  'sneha@example.com',    '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Sneha Patel',       NULL),
('u_stud5',  'rohan@example.com',    '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Rohan Verma',       NULL),
('u_stud6',  'kavya@example.com',    '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Kavya Iyer',        NULL),
('u_stud7',  'aditya@example.com',   '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Aditya Nair',       NULL),
('u_stud8',  'diya@example.com',     '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Diya Gupta',        NULL),
('u_stud9',  'arjuns@example.com',   '$2a$10$oexChMubf0KsmAVVF3o9EO8swE1MbLX.Ld3BBBwSm5TnE4Wb7wHea', 'STUDENT','Arjun Singh',       NULL);

-- ============================================================
-- 6. Staff records
-- ============================================================
INSERT INTO "Staff" ("id", "userId", "employeeId", "designation", "qualification", "canManageTimetable", "canManageNotices", "canManageEvents", "isAdmin") VALUES
('stf1', 'u_staff1', 'EMP001', 'Senior Mathematics Teacher', 'M.Sc, B.Ed', true, true, true, false),
('stf2', 'u_staff2', 'EMP002', 'Science Teacher', 'M.Sc, B.Ed', false, false, false, false),
('stf3', 'u_staff3', 'EMP003', 'English Teacher', 'M.A, B.Ed', false, true, false, false),
('stf4', 'u_staff4', 'EMP004', 'Social Studies Teacher', 'M.A, B.Ed', false, false, false, false),
('stf5', 'u_staff5', 'EMP005', 'Computer Science Teacher', 'M.Tech', false, false, false, false),
('stf_admin', 'u_admin', 'ADM001', 'School Administrator', 'M.A, B.Ed, MBA', true, true, true, true);

-- Assign subjects to staff (Class 10)
UPDATE "Subject" SET "staffId" = 'stf1' WHERE "id" = 'sub_10_mat';
UPDATE "Subject" SET "staffId" = 'stf2' WHERE "id" IN ('sub_10_phy', 'sub_10_chem', 'sub_10_bio');
UPDATE "Subject" SET "staffId" = 'stf3' WHERE "id" = 'sub_10_eng';
UPDATE "Subject" SET "staffId" = 'stf4' WHERE "id" = 'sub_10_soc';
UPDATE "Subject" SET "staffId" = 'stf5' WHERE "id" = 'sub_10_cs';
-- Assign subjects to staff (Class 7)
UPDATE "Subject" SET "staffId" = 'stf1' WHERE "id" = 'sub_7_mat';
UPDATE "Subject" SET "staffId" = 'stf2' WHERE "id" = 'sub_7_phy';
UPDATE "Subject" SET "staffId" = 'stf3' WHERE "id" = 'sub_7_eng';

-- ============================================================
-- 7. Parent record
-- ============================================================
INSERT INTO "Parent" ("id", "userId", "occupation", "address") VALUES
('par1', 'u_parent', 'Software Engineer', '45 MG Road, Bangalore, Karnataka 560001');

-- ============================================================
-- 8. Student records
-- ============================================================
INSERT INTO "Student" ("id", "userId", "rollNumber", "admissionNo", "dateOfBirth", "gender", "address", "bloodGroup", "classId", "sectionId", "academicYearId") VALUES
('std1', 'u_stud1', '001', 'ADM2024001', '2009-05-15', 'Male',   '45 MG Road, Bangalore, Karnataka 560001', 'B+', 'cls_10', 'sec_10a', 'ay_2024'),
('std2', 'u_stud2', '015', 'ADM2024015', '2012-08-22', 'Female', '45 MG Road, Bangalore, Karnataka 560001', 'O+', 'cls_7',  'sec_7b',  'ay_2024'),
('std3', 'u_stud3', '002', 'ADM2024002', '2009-03-10', 'Male',   NULL, 'A+',  'cls_10', 'sec_10a', 'ay_2024'),
('std4', 'u_stud4', '003', 'ADM2024003', '2009-07-18', 'Female', NULL, 'AB+', 'cls_10', 'sec_10a', 'ay_2024'),
('std5', 'u_stud5', '004', 'ADM2024004', '2009-01-25', 'Male',   NULL, 'O-',  'cls_10', 'sec_10a', 'ay_2024'),
('std6', 'u_stud6', '005', 'ADM2024005', '2009-11-05', 'Female', NULL, 'B-',  'cls_10', 'sec_10a', 'ay_2024'),
('std7', 'u_stud7', '006', 'ADM2024006', '2009-06-12', 'Male',   NULL, 'A-',  'cls_10', 'sec_10a', 'ay_2024'),
('std8', 'u_stud8', '016', 'ADM2024016', '2012-02-28', 'Female', NULL, 'O+',  'cls_7',  'sec_7b',  'ay_2024'),
('std9', 'u_stud9', '017', 'ADM2024017', '2012-09-14', 'Male',   NULL, 'A+',  'cls_7',  'sec_7b',  'ay_2024');

-- ============================================================
-- 9. Parent-Student relationships
-- ============================================================
INSERT INTO "ParentStudent" ("id", "parentId", "studentId", "relation") VALUES
('ps1', 'par1', 'std1', 'Father'),
('ps2', 'par1', 'std2', 'Father');

-- ============================================================
-- 10. Exams
-- ============================================================
INSERT INTO "Exam" ("id", "name", "examType", "academicYearId", "startDate", "endDate", "isPublished") VALUES
('exam1', 'Mid-Term Examination 2024', 'Mid-Term', 'ay_2024', '2024-09-15', '2024-09-25', true),
('exam2', 'Final Examination 2025',    'Final',     'ay_2024', '2025-02-15', '2025-02-28', false);

-- ============================================================
-- 11. Exam Subjects + Marks (Class 10 Mid-Term)
-- ============================================================
INSERT INTO "ExamSubject" ("id", "examId", "subjectId", "examDate", "maxMarks", "passMarks") VALUES
('es10_eng',  'exam1', 'sub_10_eng',  '2024-09-16', 100, 35),
('es10_mat',  'exam1', 'sub_10_mat',  '2024-09-16', 100, 35),
('es10_phy',  'exam1', 'sub_10_phy',  '2024-09-16', 100, 35),
('es10_chem', 'exam1', 'sub_10_chem', '2024-09-16', 100, 35),
('es10_bio',  'exam1', 'sub_10_bio',  '2024-09-16', 100, 35),
('es10_soc',  'exam1', 'sub_10_soc',  '2024-09-16', 100, 35),
('es10_hin',  'exam1', 'sub_10_hin',  '2024-09-16', 100, 35),
('es10_cs',   'exam1', 'sub_10_cs',   '2024-09-16', 100, 35);

-- Marks for Aarav (std1) - Class 10
INSERT INTO "Mark" ("id", "studentId", "examSubjectId", "internalMarks", "examMarks", "remarks") VALUES
(gen_random_uuid()::text, 'std1', 'es10_eng',  18, 82, 'Excellent performance! Keep it up.'),
(gen_random_uuid()::text, 'std1', 'es10_mat',  19, 85, 'Excellent performance! Keep it up.'),
(gen_random_uuid()::text, 'std1', 'es10_phy',  17, 78, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std1', 'es10_chem', 16, 75, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std1', 'es10_bio',  18, 80, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std1', 'es10_soc',  17, 72, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std1', 'es10_hin',  16, 70, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std1', 'es10_cs',   19, 88, 'Excellent performance! Keep it up.');

-- Marks for other Class 10 students
INSERT INTO "Mark" ("id", "studentId", "examSubjectId", "internalMarks", "examMarks", "remarks") VALUES
(gen_random_uuid()::text, 'std3', 'es10_eng',  15, 65, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std3', 'es10_mat',  14, 60, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std3', 'es10_phy',  16, 70, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std3', 'es10_chem', 15, 62, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std3', 'es10_bio',  17, 72, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std3', 'es10_soc',  14, 58, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std3', 'es10_hin',  15, 63, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std3', 'es10_cs',   16, 68, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std4', 'es10_eng',  17, 75, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std4', 'es10_mat',  16, 72, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std4', 'es10_phy',  15, 68, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std4', 'es10_chem', 14, 65, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std4', 'es10_bio',  18, 78, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std4', 'es10_soc',  13, 55, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std4', 'es10_hin',  16, 70, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std4', 'es10_cs',   15, 67, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std5', 'es10_eng',  12, 50, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std5', 'es10_mat',  14, 58, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std5', 'es10_phy',  13, 55, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std5', 'es10_chem', 15, 62, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std5', 'es10_bio',  11, 48, 'Passed. Requires significant improvement.'),
(gen_random_uuid()::text, 'std5', 'es10_soc',  16, 68, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std5', 'es10_hin',  14, 60, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std5', 'es10_cs',   13, 56, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std6', 'es10_eng',  18, 80, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std6', 'es10_mat',  17, 76, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std6', 'es10_phy',  16, 72, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std6', 'es10_chem', 15, 68, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std6', 'es10_bio',  19, 82, 'Excellent performance! Keep it up.'),
(gen_random_uuid()::text, 'std6', 'es10_soc',  14, 62, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std6', 'es10_hin',  16, 70, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std6', 'es10_cs',   17, 74, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std7', 'es10_eng',  15, 65, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std7', 'es10_mat',  13, 55, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std7', 'es10_phy',  14, 60, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std7', 'es10_chem', 12, 52, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std7', 'es10_bio',  15, 63, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std7', 'es10_soc',  16, 70, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std7', 'es10_hin',  14, 58, 'Satisfactory. Needs more focus.'),
(gen_random_uuid()::text, 'std7', 'es10_cs',   15, 64, 'Satisfactory. Needs more focus.');

-- ============================================================
-- 12. Exam Subjects + Marks (Class 7 Mid-Term for Ananya)
-- ============================================================
INSERT INTO "ExamSubject" ("id", "examId", "subjectId", "examDate", "maxMarks", "passMarks") VALUES
('es7_eng',  'exam1', 'sub_7_eng',  '2024-09-17', 100, 35),
('es7_mat',  'exam1', 'sub_7_mat',  '2024-09-17', 100, 35),
('es7_phy',  'exam1', 'sub_7_phy',  '2024-09-17', 100, 35),
('es7_chem', 'exam1', 'sub_7_chem', '2024-09-17', 100, 35),
('es7_bio',  'exam1', 'sub_7_bio',  '2024-09-17', 100, 35),
('es7_soc',  'exam1', 'sub_7_soc',  '2024-09-17', 100, 35),
('es7_hin',  'exam1', 'sub_7_hin',  '2024-09-17', 100, 35),
('es7_cs',   'exam1', 'sub_7_cs',   '2024-09-17', 100, 35);

INSERT INTO "Mark" ("id", "studentId", "examSubjectId", "internalMarks", "examMarks", "remarks") VALUES
(gen_random_uuid()::text, 'std2', 'es7_eng',  18, 80, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std2', 'es7_mat',  17, 78, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std2', 'es7_phy',  16, 75, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std2', 'es7_chem', 15, 72, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std2', 'es7_bio',  18, 82, 'Excellent performance! Keep it up.'),
(gen_random_uuid()::text, 'std2', 'es7_soc',  17, 76, 'Very good work. Continue the effort.'),
(gen_random_uuid()::text, 'std2', 'es7_hin',  16, 70, 'Good performance. Room for improvement.'),
(gen_random_uuid()::text, 'std2', 'es7_cs',   19, 85, 'Excellent performance! Keep it up.');

-- ============================================================
-- 13. Attendance (last 60 weekdays for Aarav and Ananya)
-- ============================================================
-- Aarav (std1) - 60 days attendance
INSERT INTO "Attendance" ("id", "studentId", "date", "status", "markedBy") VALUES
(gen_random_uuid()::text, 'std1', '2024-08-12', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-13', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-14', 'ABSENT',  'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-15', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-16', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-19', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-20', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-21', 'LATE',    'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-22', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-23', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-26', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-27', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-28', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-29', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-08-30', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-02', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-03', 'ABSENT',  'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-04', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-05', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-06', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-09', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-10', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-11', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-12', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-13', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-16', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-17', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-18', 'LATE',    'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-19', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-20', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-23', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-24', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-25', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-26', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-27', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-09-30', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-01', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-02', 'ABSENT',  'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-03', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-04', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-07', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-08', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-09', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-10', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-11', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-14', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-15', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-16', 'LATE',    'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-17', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-18', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-21', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-22', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-23', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-24', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-25', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-28', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-29', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-30', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-10-31', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-11-01', 'PRESENT', 'stf1'),
(gen_random_uuid()::text, 'std1', '2024-11-04', 'PRESENT', 'stf1');

-- Ananya (std2) - 60 days attendance
INSERT INTO "Attendance" ("id", "studentId", "date", "status", "markedBy") VALUES
(gen_random_uuid()::text, 'std2', '2024-08-12', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-13', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-14', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-15', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-16', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-19', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-20', 'LATE',    'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-21', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-22', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-23', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-26', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-27', 'ABSENT',  'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-28', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-29', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-08-30', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-02', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-03', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-04', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-05', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-06', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-09', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-10', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-11', 'LATE',    'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-12', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-13', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-16', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-17', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-18', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-19', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-20', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-23', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-24', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-25', 'ABSENT',  'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-26', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-27', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-09-30', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-01', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-02', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-03', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-04', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-07', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-08', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-09', 'LATE',    'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-10', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-11', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-14', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-15', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-16', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-17', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-18', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-21', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-22', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-23', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-24', 'ABSENT',  'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-25', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-28', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-29', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-30', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-10-31', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-11-01', 'PRESENT', 'stf3'),
(gen_random_uuid()::text, 'std2', '2024-11-04', 'PRESENT', 'stf3');

-- ============================================================
-- 14. Notices
-- ============================================================
INSERT INTO "Notice" ("id", "title", "content", "category", "priority", "publishDate", "createdBy") VALUES
('n1', 'Parent-Teacher Meeting', 'A parent-teacher meeting is scheduled for Saturday, 15th October 2024 from 9:00 AM to 12:00 PM. All parents are requested to attend.', 'PTM', 'High', NOW(), 'u_admin'),
('n2', 'Mid-Term Examination Results', 'Mid-Term examination results will be declared on 5th October 2024. Parents can view the results on the parent portal.', 'Examination', 'High', NOW(), 'u_admin'),
('n3', 'Annual Sports Day', 'The Annual Sports Day will be held on 20th November 2024. Students are encouraged to participate in various athletic events.', 'Event', 'Normal', NOW(), 'u_admin'),
('n4', 'Holiday Notice - Diwali Break', 'The school will remain closed from 28th October to 3rd November 2024 for Diwali celebrations. Classes will resume on 4th November.', 'Holiday', 'High', NOW(), 'u_admin'),
('n5', 'Fee Reminder - Q3', 'This is a reminder that the Q3 tuition fees are due by 15th October 2024. Please make the payment before the due date to avoid late fee charges.', 'Fee', 'High', NOW(), 'u_admin'),
('n6', 'Science Exhibition', 'A science exhibition will be organized on 25th October 2024. Students from classes 6-12 can participate. Register with your science teacher.', 'Event', 'Normal', NOW(), 'u_admin'),
('n7', 'School Circular - Uniform Change', 'Starting from the new academic session, students are required to wear the new school uniform. Details available at the school office.', 'Circular', 'Normal', NOW(), 'u_admin');

-- ============================================================
-- 15. Events
-- ============================================================
INSERT INTO "Event" ("id", "title", "description", "category", "startDate", "venue", "imageUrl", "createdBy") VALUES
('e1', 'Annual Day Celebration', 'Join us for our Annual Day Celebration featuring cultural performances, awards, and more.', 'Cultural', '2024-12-15T17:00:00', 'School Auditorium', 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800', 'u_admin'),
('e2', 'Inter-School Sports Meet', 'Annual inter-school sports competition featuring cricket, football, athletics, and more.', 'Sports', '2024-11-20T09:00:00', 'School Sports Ground', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800', 'u_admin'),
('e3', 'Science Exhibition 2024', 'Students showcase innovative science projects and experiments.', 'Academic', '2024-10-25T10:00:00', 'Science Block', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', 'u_admin'),
('e4', 'Independence Day Celebration', 'Flag hoisting ceremony and cultural program to celebrate Independence Day.', 'Cultural', '2024-08-15T08:00:00', 'School Ground', 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800', 'u_admin'),
('e5', 'Parent-Teacher Meeting', 'Quarterly parent-teacher meeting to discuss student progress.', 'PTM', '2024-10-15T09:00:00', 'Respective Classrooms', '/images/events/parent-teacher-meeting.jpg', 'u_admin');

-- ============================================================
-- 16. Gallery Items
-- ============================================================
INSERT INTO "GalleryItem" ("id", "title", "category", "imageUrl", "description") VALUES
('g1',  'School Campus', 'Campus', 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', 'Beautiful view of our school campus'),
('g2',  'Modern Classroom', 'Classrooms', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', 'Smart classroom with digital boards'),
('g3',  'Science Lab', 'Campus', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', 'Well-equipped science laboratory'),
('g4',  'Sports Day', 'Sports', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800', 'Annual sports day celebration'),
('g5',  'Annual Day Performance', 'Annual Day', 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800', 'Student performance on annual day'),
('g6',  'Cultural Dance', 'Cultural Activities', '/images/gallery/cultural-dance.jpg', 'Sri Chaitanya School students performing a cultural dance'),
('g7',  'Field Trip - Museum', 'Field Trips', '/images/gallery/field-trip-museum.jpg', 'Sri Chaitanya School students visiting a museum during an educational field trip'),
('g8',  'Library', 'Campus', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800', 'Our well-stocked library'),
('g9',  'Annual Day Stage', 'Annual Day', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'Annual day stage decoration'),
('g10', 'Cricket Match', 'Sports', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 'Inter-class cricket tournament'),
('g11', 'Art Exhibition', 'Events', '/images/gallery/art-exhibition.jpg', 'Sri Chaitanya School students participating in an art exhibition'),
('g12', 'Field Trip - Botanical Garden', 'Field Trips', '/images/gallery/field-trip-botanical-garden.jpg', 'Sri Chaitanya School students exploring a botanical garden');

-- ============================================================
-- 17. Site Config
-- ============================================================
INSERT INTO "SiteConfig" ("id", "key", "value") VALUES
('sc1', 'yearsOfExcellence', '25'),
('sc2', 'totalStudents', '5000'),
('sc3', 'totalFaculty', '300'),
('sc4', 'academicPrograms', '50'),
('sc5', 'schoolName', 'Sri Chaitanya School'),
('sc6', 'tagline', 'Learn. Grow. Excel.'),
('sc7', 'address', '123 Education City Road, Bangalore, Karnataka 560001'),
('sc8', 'phone', '+91 80 2345 6789'),
('sc9', 'email', 'info@srichaitanya.edu.in'),
('sc10', 'workingHours', 'Mon - Sat: 8:00 AM - 4:00 PM');

-- ============================================================
-- 18. Assignments for Class 10
-- ============================================================
INSERT INTO "Assignment" ("id", "subjectId", "title", "description", "dueDate", "maxMarks") VALUES
('asg_10_eng_1', 'sub_10_eng', 'English - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of English. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_eng_2', 'sub_10_eng', 'English - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of English.', NOW() + INTERVAL '14 days', 50),
('asg_10_mat_1', 'sub_10_mat', 'Mathematics - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of Mathematics. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_mat_2', 'sub_10_mat', 'Mathematics - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of Mathematics.', NOW() + INTERVAL '14 days', 50),
('asg_10_phy_1', 'sub_10_phy', 'Physics - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of Physics. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_phy_2', 'sub_10_phy', 'Physics - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of Physics.', NOW() + INTERVAL '14 days', 50),
('asg_10_chem_1','sub_10_chem','Chemistry - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of Chemistry. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_chem_2','sub_10_chem','Chemistry - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of Chemistry.', NOW() + INTERVAL '14 days', 50),
('asg_10_bio_1', 'sub_10_bio', 'Biology - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of Biology. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_bio_2', 'sub_10_bio', 'Biology - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of Biology.', NOW() + INTERVAL '14 days', 50),
('asg_10_soc_1', 'sub_10_soc', 'Social Studies - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of Social Studies. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_soc_2', 'sub_10_soc', 'Social Studies - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of Social Studies.', NOW() + INTERVAL '14 days', 50),
('asg_10_hin_1', 'sub_10_hin', 'Hindi - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of Hindi. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_hin_2', 'sub_10_hin', 'Hindi - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of Hindi.', NOW() + INTERVAL '14 days', 50),
('asg_10_cs_1',  'sub_10_cs',  'Computer Science - Chapter 1 Assignment', 'Complete the exercises from Chapter 1 of Computer Science. Submit your work before the due date.', NOW() + INTERVAL '7 days', 50),
('asg_10_cs_2',  'sub_10_cs',  'Computer Science - Chapter 2 Assignment', 'Complete the exercises from Chapter 2 of Computer Science.', NOW() + INTERVAL '14 days', 50);

-- ============================================================
-- 19. Student Assignments (Aarav - submitted + pending)
-- ============================================================
INSERT INTO "StudentAssignment" ("id", "assignmentId", "studentId", "status", "submittedAt", "marks", "feedback") VALUES
(gen_random_uuid()::text, 'asg_10_eng_1', 'std1', 'Submitted', NOW() - INTERVAL '2 days', 42, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_mat_1', 'std1', 'Submitted', NOW() - INTERVAL '2 days', 45, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_phy_1', 'std1', 'Submitted', NOW() - INTERVAL '2 days', 40, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_chem_1','std1', 'Submitted', NOW() - INTERVAL '2 days', 38, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_bio_1', 'std1', 'Submitted', NOW() - INTERVAL '2 days', 44, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_soc_1', 'std1', 'Submitted', NOW() - INTERVAL '2 days', 41, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_hin_1', 'std1', 'Submitted', NOW() - INTERVAL '2 days', 39, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_cs_1',  'std1', 'Submitted', NOW() - INTERVAL '2 days', 46, 'Good work, keep it up!'),
(gen_random_uuid()::text, 'asg_10_eng_2', 'std1', 'Pending',   NULL, NULL, NULL),
(gen_random_uuid()::text, 'asg_10_mat_2', 'std1', 'Pending',   NULL, NULL, NULL),
(gen_random_uuid()::text, 'asg_10_phy_2', 'std1', 'Pending',   NULL, NULL, NULL),
(gen_random_uuid()::text, 'asg_10_chem_2','std1', 'Pending',   NULL, NULL, NULL),
(gen_random_uuid()::text, 'asg_10_bio_2', 'std1', 'Pending',   NULL, NULL, NULL),
(gen_random_uuid()::text, 'asg_10_soc_2', 'std1', 'Pending',   NULL, NULL, NULL),
(gen_random_uuid()::text, 'asg_10_hin_2', 'std1', 'Pending',   NULL, NULL, NULL),
(gen_random_uuid()::text, 'asg_10_cs_2',  'std1', 'Pending',   NULL, NULL, NULL);

-- ============================================================
-- 20. Timetable for Class 10A
-- ============================================================
INSERT INTO "Timetable" ("id", "classId", "day", "isActive") VALUES
('tt_10_mon', 'cls_10', 'Monday',    true),
('tt_10_tue', 'cls_10', 'Tuesday',   true),
('tt_10_wed', 'cls_10', 'Wednesday', true),
('tt_10_thu', 'cls_10', 'Thursday',  true),
('tt_10_fri', 'cls_10', 'Friday',    true),
('tt_10_sat', 'cls_10', 'Saturday',  true);

-- Timetable periods for Class 10A (Monday)
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_10_mon', 1, '08:30', '09:15', 'sub_10_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_10_mon', 2, '09:15', '10:00', 'sub_10_phy',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_mon', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_10_mon', 4, '10:15', '11:00', 'sub_10_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_10_mon', 5, '11:00', '11:45', 'sub_10_chem', 'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_mon', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_10_mon', 7, '12:30', '01:15', 'sub_10_bio',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_mon', 8, '01:15', '02:00', 'sub_10_cs',   'stf5', false, NULL);

-- Tuesday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_10_tue', 1, '08:30', '09:15', 'sub_10_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_10_tue', 2, '09:15', '10:00', 'sub_10_chem', 'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_tue', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_10_tue', 4, '10:15', '11:00', 'sub_10_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_10_tue', 5, '11:00', '11:45', 'sub_10_soc',  'stf4', false, NULL),
(gen_random_uuid()::text, 'tt_10_tue', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_10_tue', 7, '12:30', '01:15', 'sub_10_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_10_tue', 8, '01:15', '02:00', 'sub_10_phy',  'stf2', false, NULL);

-- Wednesday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_10_wed', 1, '08:30', '09:15', 'sub_10_phy',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_wed', 2, '09:15', '10:00', 'sub_10_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_10_wed', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_10_wed', 4, '10:15', '11:00', 'sub_10_cs',   'stf5', false, NULL),
(gen_random_uuid()::text, 'tt_10_wed', 5, '11:00', '11:45', 'sub_10_bio',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_wed', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_10_wed', 7, '12:30', '01:15', 'sub_10_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_10_wed', 8, '01:15', '02:00', 'sub_10_soc',  'stf4', false, NULL);

-- Thursday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_10_thu', 1, '08:30', '09:15', 'sub_10_chem', 'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_thu', 2, '09:15', '10:00', 'sub_10_bio',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_thu', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_10_thu', 4, '10:15', '11:00', 'sub_10_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_10_thu', 5, '11:00', '11:45', 'sub_10_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_10_thu', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_10_thu', 7, '12:30', '01:15', 'sub_10_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_10_thu', 8, '01:15', '02:00', 'sub_10_cs',   'stf5', false, NULL);

-- Friday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_10_fri', 1, '08:30', '09:15', 'sub_10_soc',  'stf4', false, NULL),
(gen_random_uuid()::text, 'tt_10_fri', 2, '09:15', '10:00', 'sub_10_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_10_fri', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_10_fri', 4, '10:15', '11:00', 'sub_10_phy',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_fri', 5, '11:00', '11:45', 'sub_10_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_10_fri', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_10_fri', 7, '12:30', '01:15', 'sub_10_chem', 'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_10_fri', 8, '01:15', '02:00', 'sub_10_bio',  'stf2', false, NULL);

-- Saturday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_10_sat', 1, '08:30', '09:15', 'sub_10_cs',   'stf5', false, NULL),
(gen_random_uuid()::text, 'tt_10_sat', 2, '09:15', '10:00', 'sub_10_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_10_sat', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_10_sat', 4, '10:15', '11:00', 'sub_10_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_10_sat', 5, '11:00', '11:45', 'sub_10_soc',  'stf4', false, NULL),
(gen_random_uuid()::text, 'tt_10_sat', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_10_sat', 7, '12:30', '01:15', 'sub_10_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_10_sat', 8, '01:15', '02:00', 'sub_10_phy',  'stf2', false, NULL);

-- ============================================================
-- 21. Timetable for Class 7B
-- ============================================================
INSERT INTO "Timetable" ("id", "classId", "day", "isActive") VALUES
('tt_7_mon', 'cls_7', 'Monday',    true),
('tt_7_tue', 'cls_7', 'Tuesday',   true),
('tt_7_wed', 'cls_7', 'Wednesday', true),
('tt_7_thu', 'cls_7', 'Thursday',  true),
('tt_7_fri', 'cls_7', 'Friday',    true),
('tt_7_sat', 'cls_7', 'Saturday',  true);

-- Monday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_7_mon', 1, '08:30', '09:15', 'sub_7_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_7_mon', 2, '09:15', '10:00', 'sub_7_phy',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_7_mon', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_7_mon', 4, '10:15', '11:00', 'sub_7_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_7_mon', 5, '11:00', '11:45', 'sub_7_soc',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_mon', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_7_mon', 7, '12:30', '01:15', 'sub_7_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_mon', 8, '01:15', '02:00', 'sub_7_cs',   NULL,  false, NULL);

-- Tuesday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_7_tue', 1, '08:30', '09:15', 'sub_7_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_7_tue', 2, '09:15', '10:00', 'sub_7_chem', NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_tue', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_7_tue', 4, '10:15', '11:00', 'sub_7_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_7_tue', 5, '11:00', '11:45', 'sub_7_bio',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_tue', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_7_tue', 7, '12:30', '01:15', 'sub_7_cs',   NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_tue', 8, '01:15', '02:00', 'sub_7_soc',  NULL,  false, NULL);

-- Wednesday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_7_wed', 1, '08:30', '09:15', 'sub_7_phy',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_7_wed', 2, '09:15', '10:00', 'sub_7_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_7_wed', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_7_wed', 4, '10:15', '11:00', 'sub_7_cs',   NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_wed', 5, '11:00', '11:45', 'sub_7_bio',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_wed', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_7_wed', 7, '12:30', '01:15', 'sub_7_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_7_wed', 8, '01:15', '02:00', 'sub_7_soc',  NULL,  false, NULL);

-- Thursday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_7_thu', 1, '08:30', '09:15', 'sub_7_chem', NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_thu', 2, '09:15', '10:00', 'sub_7_bio',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_thu', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_7_thu', 4, '10:15', '11:00', 'sub_7_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_7_thu', 5, '11:00', '11:45', 'sub_7_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_thu', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_7_thu', 7, '12:30', '01:15', 'sub_7_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_7_thu', 8, '01:15', '02:00', 'sub_7_cs',   NULL,  false, NULL);

-- Friday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_7_fri', 1, '08:30', '09:15', 'sub_7_soc',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_fri', 2, '09:15', '10:00', 'sub_7_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_fri', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_7_fri', 4, '10:15', '11:00', 'sub_7_phy',  'stf2', false, NULL),
(gen_random_uuid()::text, 'tt_7_fri', 5, '11:00', '11:45', 'sub_7_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_7_fri', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_7_fri', 7, '12:30', '01:15', 'sub_7_chem', NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_fri', 8, '01:15', '02:00', 'sub_7_bio',  NULL,  false, NULL);

-- Saturday
INSERT INTO "TimetablePeriod" ("id", "timetableId", "periodNumber", "startTime", "endTime", "subjectId", "staffId", "isBreak", "breakType") VALUES
(gen_random_uuid()::text, 'tt_7_sat', 1, '08:30', '09:15', 'sub_7_cs',   NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_sat', 2, '09:15', '10:00', 'sub_7_eng',  'stf3', false, NULL),
(gen_random_uuid()::text, 'tt_7_sat', 3, '10:00', '10:15', NULL, NULL, true, 'Short Break'),
(gen_random_uuid()::text, 'tt_7_sat', 4, '10:15', '11:00', 'sub_7_mat',  'stf1', false, NULL),
(gen_random_uuid()::text, 'tt_7_sat', 5, '11:00', '11:45', 'sub_7_soc',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_sat', 6, '11:45', '12:30', NULL, NULL, true, 'Lunch'),
(gen_random_uuid()::text, 'tt_7_sat', 7, '12:30', '01:15', 'sub_7_hin',  NULL,  false, NULL),
(gen_random_uuid()::text, 'tt_7_sat', 8, '01:15', '02:00', 'sub_7_phy',  'stf2', false, NULL);

-- ============================================================
-- DONE! Demo accounts:
--   Parent:  parent@example.com / password123  → /portal/parent
--   Student: student@example.com / password123 → /portal/student
--   Staff:   teacher@example.com / password123 → /portal/staff
--   Admin:   admin@example.com / password123   → /portal/admin
-- ============================================================
