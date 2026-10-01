import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from './env';

export type AppSession = { id: string; role: string; loginId: string };

export async function getSession() {
  const token = (await cookies()).get('bf_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'], issuer: 'bfblessy' }) as AppSession;
  } catch {
    return null;
  }
}
