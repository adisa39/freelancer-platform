import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from './env';
import connectDB from './db';
import { UserModel } from './models';

export type AppSession = { id: string; role: string; wallet: string };

export async function getSession() {
  const token = (await cookies()).get('bf_token')?.value;
  if (!token) return null;
  try {
    const session = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: 'bfblessy',
    }) as AppSession;
    if (typeof session.id !== 'string' || typeof session.wallet !== 'string') return null;

    await connectDB();
    const user = await UserModel.findById(session.id).select('role isActive');
    if (!user?.isActive) return null;

    return { ...session, role: user.role };
  } catch {
    return null;
  }
}
