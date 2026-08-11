import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'sc_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => {});
  }
}

export const SESSION_COOKIE = SESSION_COOKIE_NAME;
export const SESSION_MAX_AGE = SESSION_DURATION;

export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function getStudentForParent(parentUserId: string, studentId: string) {
  const parent = await prisma.parent.findFirst({
    where: { userId: parentUserId },
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

  if (!parent) return null;

  const child = parent.children.find((c) => c.studentId === studentId);
  return child ? child.student : null;
}

export async function getStudentForUser(userId: string) {
  return prisma.student.findFirst({
    where: { userId },
    include: {
      user: true,
      class: true,
      section: true,
      academicYear: true,
    },
  });
}

export async function getStaffForUser(userId: string) {
  return prisma.staff.findFirst({
    where: { userId },
    include: { user: true },
  });
}
