import { redirect } from 'next/navigation';
import { getSession, getStudentForParent } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getParentContext() {
  const session = await getSession();
  if (!session || session.role !== 'PARENT') redirect('/login');

  const parent = await prisma.parent.findFirst({
    where: { userId: session.id },
    include: {
      children: {
        include: {
          student: {
            include: {
              user: true,
              class: true,
              section: true,
              academicYear: true,
            },
          },
        },
      },
    },
  });

  if (!parent) redirect('/login');

  return { session, parent };
}

export async function getAuthorizedStudent(parentUserId: string, studentId: string) {
  return getStudentForParent(parentUserId, studentId);
}

export async function getFirstChild(parent: any) {
  return parent.children[0]?.student || null;
}
