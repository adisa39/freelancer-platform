import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { UserModel, WalletModel } from '@/lib/models';
import { getDevelopmentMockUser, isDevelopmentMockAuthEnabled } from '@/lib/session';
import { env, getJwtSecret } from '@/lib/env';
import { asObject } from '@/lib/utils';
import { UserRole } from '@/types/enum';

const INTERLINK_TIMEOUT_MS = 10_000;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

type AuthFlow = 'login' | 'register';

class AuthError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function rpcUrl(path: string): string {
  return `${env.INTERLINK_RPC.replace(/\/$/, '')}${path}`;
}

async function postInterlink(path: string, body: Record<string, unknown>): Promise<Response> {
  try {
    return await fetch(rpcUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(INTERLINK_TIMEOUT_MS),
    });
  } catch {
    throw new AuthError('InterLink is temporarily unavailable. Try again shortly.', 502);
  }
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  const body: unknown = await response.json().catch(() => null);
  const data = asObject(body);
  if (!data) throw new AuthError('InterLink returned an invalid response.', 502);
  return data;
}

async function requestChallenge(walletAddress: string) {
  const response = await postInterlink('/auth/challenge', {
    walletAddress,
    chainId: String(env.CHAIN_ID),
  });
  if (!response.ok) {
    throw new AuthError('InterLink could not create a sign-in challenge.', 502);
  }

  const data = await readJson(response);
  const result = asObject(data.result);
  if (typeof result?.challengeId !== 'string' || typeof result.messageToSign !== 'string') {
    throw new AuthError('InterLink returned an incomplete sign-in challenge.', 502);
  }

  return {
    challenge: {
      challengeId: result.challengeId,
      messageToSign: result.messageToSign,
    },
  };
}

async function verifyChallenge(input: {
  walletAddress: string;
  challengeId: string;
  message: string;
  signature: string;
}): Promise<void> {
  let recoveredAddress: string;
  try {
    recoveredAddress = ethers.getAddress(ethers.verifyMessage(input.message, input.signature));
  } catch {
    throw new AuthError('The wallet signature is invalid.', 401);
  }
  if (recoveredAddress !== input.walletAddress) {
    throw new AuthError('The wallet signature does not match the connected wallet.', 401);
  }

  const response = await postInterlink('/auth/verify', {
      walletAddress: input.walletAddress,
      challengeId: input.challengeId,
      message: input.message,
      signature: input.signature,
      chainId: String(env.CHAIN_ID),
  });
  if (!response.ok) {
    throw new AuthError('InterLink could not verify this wallet signature.', 401);
  }
  const data = await readJson(response);
  const result = asObject(data.result);
  if (typeof result?.accessToken !== 'string' || !result.accessToken) {
    throw new AuthError('InterLink could not verify this wallet signature.', 401);
  }
}

function validFlow(value: unknown): value is AuthFlow {
  return value === 'login' || value === 'register';
}

function publicUser(user: { toObject(): Record<string, unknown> }) {
  const result = user.toObject();
  delete result.password;
  delete result.email;
  delete result.interlinkLoginId;
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = asObject(await request.json().catch(() => null));
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    if (body.action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Signed out.' });
      response.cookies.set('bf_token', '', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
      return response;
    }

    if (body.action === 'challenge') {
      if (typeof body.walletAddress !== 'string') {
        return NextResponse.json({ success: false, message: 'A wallet address is required.' }, { status: 400 });
      }

      let walletAddress: string;
      try {
        walletAddress = ethers.getAddress(body.walletAddress);
      } catch {
        return NextResponse.json({ success: false, message: 'The wallet address is invalid.' }, { status: 400 });
      }

      const result = await requestChallenge(walletAddress);
      return NextResponse.json({ success: true, data: result.challenge }, { headers: { 'Cache-Control': 'no-store' } });
    }

    if (body.action !== 'interlink' || !validFlow(body.flow)) {
      return NextResponse.json({ success: false, message: 'Choose sign-in or registration to continue.' }, { status: 400 });
    }

    const { walletAddress, challengeId, message, signature } = body;
    if (
      typeof walletAddress !== 'string' ||
      typeof challengeId !== 'string' || !challengeId || challengeId.length > 512 ||
      typeof message !== 'string' || !message || message.length > 10_000 ||
      typeof signature !== 'string' || !/^0x[\da-f]{130}$/i.test(signature)
    ) {
      return NextResponse.json({ success: false, message: 'The signed wallet challenge is incomplete or invalid.' }, { status: 400 });
    }

    let normalizedAddress: string;
    try {
      normalizedAddress = ethers.getAddress(walletAddress);
    } catch {
      return NextResponse.json({ success: false, message: 'The wallet address is invalid.' }, { status: 400 });
    }

    await verifyChallenge({ walletAddress: normalizedAddress, challengeId, message, signature });
    const jwtSecret = getJwtSecret();
    await connectDB();

    let wallet = await WalletModel.findOne({ address: normalizedAddress, chain_id: env.CHAIN_ID });
    let user = wallet ? await UserModel.findById(wallet.user_id) : null;

    if (!wallet) {
      if (body.flow === 'login') {
        return NextResponse.json({ success: false, message: 'No marketplace profile is connected to this wallet. Register first.' }, { status: 404 });
      }

      const profile = asObject(body.profile) ?? {};
      const role = body.role === UserRole.FREELANCER ? UserRole.FREELANCER : body.role === UserRole.CLIENT ? UserRole.CLIENT : null;
      const name = typeof profile.name === 'string' ? profile.name.trim().slice(0, 100) : '';
      if (!role || !name) {
        return NextResponse.json({ success: false, message: 'Choose an account type and enter a display name to register.' }, { status: 400 });
      }

      const skills = role === UserRole.FREELANCER && Array.isArray(profile.skills)
        ? profile.skills.filter((skill): skill is string => typeof skill === 'string').map((skill) => skill.trim().slice(0, 60)).filter(Boolean).slice(0, 20)
        : [];

      user = await UserModel.create({
        name,
        role,
        location: typeof profile.location === 'string' ? profile.location.trim().slice(0, 120) : undefined,
        bio: role === UserRole.FREELANCER && typeof profile.bio === 'string' ? profile.bio.trim().slice(0, 2000) : undefined,
        skills,
        isActive: true,
      });

      try {
        wallet = await WalletModel.create({
          user_id: user._id,
          address: normalizedAddress,
          chain_id: env.CHAIN_ID,
          provider: 'interlink',
          is_primary: true,
        });
      } catch (error) {
        await UserModel.deleteOne({ _id: user._id });
        if (asObject(error)?.code !== 11000) throw error;

        wallet = await WalletModel.findOne({ address: normalizedAddress, chain_id: env.CHAIN_ID });
        user = wallet ? await UserModel.findById(wallet.user_id) : null;
        if (!wallet || !user) throw error;
      }
    }

    if (!user || !wallet) {
      return NextResponse.json({ success: false, message: 'The marketplace account could not be loaded.' }, { status: 404 });
    }
    if (!user.isActive) {
      return NextResponse.json({ success: false, message: 'This account is disabled. Contact support for help.' }, { status: 403 });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, wallet: wallet.address },
      jwtSecret,
      { algorithm: 'HS256', expiresIn: SESSION_MAX_AGE_SECONDS, issuer: 'bfblessy' },
    );
    const response = NextResponse.json({ success: true, data: { user: publicUser(user) } });
    response.cookies.set('bf_token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('[AUTH]', error instanceof Error ? error.message : 'Unknown auth error');
    if (error instanceof AuthError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    return NextResponse.json({ success: false, message: 'Could not complete wallet sign-in. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('bf_token')?.value;
    if (!token) {
      const mockUser = await getDevelopmentMockUser();
      if (mockUser) return NextResponse.json({ success: true, data: { user: { ...publicUser(mockUser), isDevelopmentMock: true } } }, { headers: { 'Cache-Control': 'no-store' } });
      return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      issuer: 'bfblessy',
    }) as { id: string };
    await connectDB();
    const user = await UserModel.findById(decoded.id).select('-password -email -interlinkLoginId');
    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { user } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid session.' }, { status: 401 });
  }
}
