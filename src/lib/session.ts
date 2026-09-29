import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bfblessy_secret_change_in_prod';

export async function getSession() {
  const token = (await cookies()).get('bf_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string; loginId: string };
  } catch {
    return null;
  }
}
