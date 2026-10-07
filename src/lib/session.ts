import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { env, getJwtSecret } from './env';
import connectDB from './db';
import { UserModel } from './models';

export type AppSession = { id: string; role: string; wallet: string };

const DEV_MOCK_USER_ID = '000000000000000000000042';
const DEV_MOCK_WALLET = '0x0000000000000000000000000000000000000042';

export function isDevelopmentMockAuthEnabled() {
  return env.NODE_ENV === 'development' &&  env.DEV_MOCK_AUTH !== false;
}

function createDevelopmentMockUser() {
  const role = env.DEV_MOCK_ROLE === 'client' ? 'client' : 'freelancer';
  const user = {
    _id: { toString: () => DEV_MOCK_USER_ID },
    name: role === 'client' ? 'Development Client' : 'Development Freelancer',
    role,
    location: 'Lagos, Nigeria',
    bio: role === 'client'
      ? 'Demo client account for local development.'
      : 'Demo freelancer account for local development. Add skills and portfolio details in profile settings.',
    skills: role === 'freelancer' ? ['Translation', 'Proofreading', 'Localization'] : [],
    languages: role === 'freelancer' ? ['English', 'Yoruba'] : [],
    isActive: true,
    toObject() {
      const { toObject: _toObject, ...plainUser } = this;
      return plainUser;
    },
  };
  return user;
}

export async function getDevelopmentMockUser() {
  if (!isDevelopmentMockAuthEnabled()) return null;
  return createDevelopmentMockUser();
}
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('bf_token')?.value;
  if (!token) {
    try {
      const user = await getDevelopmentMockUser();
      if (!user) return null;
      return { id: user._id.toString(), role: user.role, wallet: DEV_MOCK_WALLET };
    } catch {
      return null;
    }
  }

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
