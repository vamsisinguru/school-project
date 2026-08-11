export const isDbAvailable = !!process.env.DATABASE_URL;

export async function safeQuery<T>(q: () => Promise<T>, fb: T): Promise<T> {
  if (!isDbAvailable) return fb;
  try { return await q(); } catch { return fb; }
}

export const fbConfig: Record<string, string> = {
  yearsOfExcellence: '25', totalStudents: '5000', totalFaculty: '300', academicPrograms: '50',
};

export const fbEvents: any[] = [
  { id: 'e1', title: 'Annual Day', description: 'Cultural performances and showcases.', category: 'Cultural', startDate: new Date(Date.now() + 7e9).toISOString(), endDate: null, venue: 'Auditorium', imageUrl: null, createdBy: 's', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'e2', title: 'PTM', description: 'Quarterly parent-teacher meeting.', category: 'PTM', startDate: new Date(Date.now() + 14e9).toISOString(), endDate: null, venue: 'Classrooms', imageUrl: null, createdBy: 's', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const fbPastEvents: any[] = [
  { id: 'p1', title: 'Science Exhibition', description: 'Student science projects.', category: 'Academic', startDate: new Date(Date.now() - 30e9).toISOString(), endDate: null, venue: 'Labs', imageUrl: null, createdBy: 's', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const fbNotices: any[] = [
  { id: 'n1', title: 'Admissions Open', content: 'Applications accepted for 2024-2025.', category: 'Admission', priority: 'High', attachmentUrl: null, targetClass: null, publishDate: new Date().toISOString(), expiryDate: null, createdBy: 's', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'n2', title: 'Holiday Notice', content: 'School closed for public holiday.', category: 'Holiday', priority: 'Normal', attachmentUrl: null, targetClass: null, publishDate: new Date(Date.now() - 2e9).toISOString(), expiryDate: null, createdBy: 's', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const fbGallery: any[] = [
  { id: 'g1', title: 'Campus', category: 'Campus', imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop', description: 'School campus' },
  { id: 'g2', title: 'Science Lab', category: 'Classrooms', imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop', description: 'Science lab' },
  { id: 'g3', title: 'Sports Day', category: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&h=400&fit=crop', description: 'Sports meet' },
  { id: 'g4', title: 'Cultural Event', category: 'Cultural Activities', imageUrl: 'https://images.unsplash.com/photo-1499538493499-df731ae9b6f1?w=600&h=400&fit=crop', description: 'Cultural performance' },
];
